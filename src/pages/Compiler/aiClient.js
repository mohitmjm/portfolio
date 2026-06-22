/* ============================================================================
 * aiClient.js — centralized AI provider service for the Python compiler.
 *
 * Priority: Gemini (primary) -> Groq (automatic fallback).
 * Falls back on 429 / quota / timeout / 5xx / network / provider-unavailable.
 * The switch is automatic; callers never see provider failures unless BOTH die.
 *
 * Features: JSON-mode responses, per-request timeout (AbortController),
 * one retry on transient errors, in-memory response cache + request dedup.
 *
 * NOTE: keys are read from Vite env (VITE_*). Only code/error/output text is
 * ever sent to the provider — never keys or unrelated data.
 * ========================================================================== */

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
const GEMINI_MODEL = 'gemini-2.5-flash';

const TIMEOUT_MS = 22000;

export function aiAvailable() {
  return Boolean(GEMINI_KEY || GROQ_KEY);
}

/* ----------------------------------------------------------- low-level calls */

async function callGemini(system, user, signal) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
      }),
    },
  );
  if (!res.ok) {
    const err = new Error(`Gemini request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned an empty response');
  return text;
}

async function callGroq(system, user, signal) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
    signal,
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) {
    const err = new Error(`Groq request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq returned an empty response');
  return text;
}

/* ----------------------------------------------------- provider w/ timeout+retry */

async function attempt(fn, system, user) {
  // up to 2 tries; retry only on transient errors (timeout / network / 5xx)
  let lastErr;
  for (let i = 0; i < 2; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fn(system, user, controller.signal);
    } catch (err) {
      lastErr = err;
      const status = err.status;
      const transient = status === undefined || status >= 500; // network/abort/5xx
      // 429 / quota / 4xx -> do not retry this provider, bubble up to fallback
      if (i === 0 && transient && status !== 429) continue;
      break;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

async function getAIResponse(system, user) {
  // Try Gemini, then Groq. Returns { text, provider, model }.
  if (GEMINI_KEY) {
    try {
      const text = await attempt(callGemini, system, user);
      return { text, provider: 'gemini', model: GEMINI_MODEL };
    } catch (err) {
      if (!GROQ_KEY) throw err;
      // any Gemini failure -> automatic Groq fallback
    }
  }
  if (GROQ_KEY) {
    const text = await attempt(callGroq, system, user);
    return { text, provider: 'groq', model: GROQ_MODEL };
  }
  throw new Error('No AI provider configured');
}

/* --------------------------------------------------------------- json parsing */

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    /* try to recover JSON embedded in prose / code fences */
  }
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {
      /* give up */
    }
  }
  return null;
}

/* ------------------------------------------------------- cache + dedup wrapper */

const cache = new Map();
const inflight = new Map();

function keyFor(mode, code, error) {
  return `${mode}::${error || ''}::${code}`;
}

async function structured(mode, system, user, code, error) {
  const key = keyFor(mode, code, error);
  if (cache.has(key)) return cache.get(key);
  if (inflight.has(key)) return inflight.get(key);

  const promise = (async () => {
    const { text, provider, model } = await getAIResponse(system, user);
    const data = parseJson(text);
    if (!data) throw new Error('Could not parse the AI response');
    const result = { data, provider, model };
    cache.set(key, result);
    return result;
  })();

  inflight.set(key, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(key);
  }
}

/* ------------------------------------------------------------------- prompts */

const INSTRUCTOR = `You are a senior Python instructor and debugging expert helping a learner.
Rules:
1. Explain errors in simple, jargon-free English.
2. Identify the root cause precisely.
3. Explain why it happened.
4. Generate corrected code that PRESERVES the original logic and intent.
5. Never invent functionality that wasn't there.
6. Suggest improvements only when genuinely helpful.
7. Always respond with a single valid JSON object and nothing else.`;

export function analyzeError({ code, error, output, lineNumber }) {
  const system = `${INSTRUCTOR}
Respond with JSON shaped exactly as:
{
  "errorType": string,            // e.g. "SyntaxError"
  "severity": "critical" | "warning" | "suggestion",
  "explanation": string,          // beginner-friendly, 1-3 sentences
  "rootCause": string,
  "prevention": string,           // how to avoid this next time
  "line": number | null,          // offending line if known
  "fixedCode": string,            // full corrected program
  "optimizationSuggestions": string[]
}`;
  const user = `My Python program failed.

CODE:
${code}

ERROR / TRACEBACK:
${error}

PROGRAM OUTPUT BEFORE FAILURE:
${output || '(none)'}

LIKELY LINE: ${lineNumber ?? 'unknown'}

Explain it simply and give corrected code.`;
  return structured('analyze', system, user, code, error);
}

export function improveCode({ code, output }) {
  const system = `You are a senior Python engineer doing a friendly code review.
Preserve behaviour; never invent functionality. Respond with JSON shaped exactly as:
{
  "summary": string,
  "currentComplexity": string,    // e.g. "O(n^2)" or "n/a"
  "suggestedComplexity": string,  // e.g. "O(n)" or "same"
  "improvedCode": string,         // full improved program
  "suggestions": string[]
}`;
  const user = `Review and improve this working Python code for readability, performance, and best practices.

CODE:
${code}

OUTPUT:
${output || '(none)'}`;
  return structured('improve', system, user, code, '');
}

export function learnFromError({ code, error }) {
  const system = `You are a patient Python teacher turning a mistake into a lesson.
Respond with JSON shaped exactly as:
{
  "concept": string,              // the concept to learn
  "explanation": string,
  "examples": string[],           // short correct snippets or bullets
  "bestPractices": string[],
  "commonMistakes": string[]
}`;
  const user = `A beginner hit this error. Teach the underlying concept clearly.

CODE:
${code}

ERROR:
${error}`;
  return structured('learn', system, user, code, error);
}
