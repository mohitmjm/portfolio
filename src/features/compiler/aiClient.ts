/* ============================================================================
 * aiClient.ts — ported 1:1 from mohitmjm/portfolio src/pages/Compiler/aiClient.js
 *
 * Priority: Gemini (primary) -> Groq (automatic fallback).
 * JSON-mode responses, per-request timeout, one retry on transient errors,
 * in-memory response cache + request dedup.
 * ========================================================================== */

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
const GROQ_MODEL = (import.meta.env.VITE_GROQ_MODEL as string | undefined) || "llama-3.3-70b-versatile";
const GEMINI_MODEL = "gemini-2.5-flash";

const TIMEOUT_MS = 22000;

export type AIProvider = "gemini" | "groq";

export interface AIError extends Error {
  status?: number;
}

export function aiAvailable(): boolean {
  return Boolean(GEMINI_KEY || GROQ_KEY);
}

async function callGemini(system: string, user: string, signal: AbortSignal): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
      }),
    },
  );
  if (!res.ok) {
    const err: AIError = new Error(`Gemini request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response");
  return text as string;
}

async function callGroq(system: string, user: string, signal: AbortSignal): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
    signal,
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const err: AIError = new Error(`Groq request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq returned an empty response");
  return text as string;
}

async function attempt(
  fn: (s: string, u: string, sig: AbortSignal) => Promise<string>,
  system: string,
  user: string,
): Promise<string> {
  let lastErr: AIError | undefined;
  for (let i = 0; i < 2; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      return await fn(system, user, controller.signal);
    } catch (err) {
      lastErr = err as AIError;
      const status = lastErr.status;
      const transient = status === undefined || status >= 500;
      if (i === 0 && transient && status !== 429) continue;
      break;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

async function getAIResponse(
  system: string,
  user: string,
): Promise<{ text: string; provider: AIProvider; model: string }> {
  if (GEMINI_KEY) {
    try {
      const text = await attempt(callGemini, system, user);
      return { text, provider: "gemini", model: GEMINI_MODEL };
    } catch (err) {
      if (!GROQ_KEY) throw err;
    }
  }
  if (GROQ_KEY) {
    const text = await attempt(callGroq, system, user);
    return { text, provider: "groq", model: GROQ_MODEL };
  }
  throw new Error("No AI provider configured");
}

function parseJson<T = unknown>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    /* try to recover JSON embedded in prose / code fences */
  }
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]) as T;
    } catch {
      /* give up */
    }
  }
  return null;
}

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function keyFor(mode: string, code: string, error: string) {
  return `${mode}::${error || ""}::${code}`;
}

async function structured<T>(
  mode: string,
  system: string,
  user: string,
  code: string,
  error: string,
): Promise<{ data: T; provider: AIProvider; model: string }> {
  const key = keyFor(mode, code, error);
  if (cache.has(key)) return cache.get(key) as { data: T; provider: AIProvider; model: string };
  if (inflight.has(key)) return inflight.get(key) as Promise<{ data: T; provider: AIProvider; model: string }>;

  const promise = (async () => {
    const { text, provider, model } = await getAIResponse(system, user);
    const data = parseJson<T>(text);
    if (!data) throw new Error("Could not parse the AI response");
    const result = { data, provider, model };
    cache.set(key, result);
    return result;
  })();

  inflight.set(key, promise);
  try {
    return (await promise) as { data: T; provider: AIProvider; model: string };
  } finally {
    inflight.delete(key);
  }
}

const INSTRUCTOR = `You are a senior Python instructor and debugging expert helping a learner.
Rules:
1. Explain errors in simple, jargon-free English.
2. Identify the root cause precisely.
3. Explain why it happened.
4. Generate corrected code that PRESERVES the original logic and intent.
5. Never invent functionality that wasn't there.
6. Suggest improvements only when genuinely helpful.
7. Always respond with a single valid JSON object and nothing else.`;

export interface AnalyzeResult {
  errorType: string;
  severity: "critical" | "warning" | "suggestion";
  explanation: string;
  rootCause: string;
  prevention: string;
  line: number | null;
  fixedCode: string;
  optimizationSuggestions: string[];
}

export function analyzeError(args: {
  code: string;
  error: string;
  output?: string;
  lineNumber?: number | null;
}) {
  const { code, error, output, lineNumber } = args;
  const system = `${INSTRUCTOR}
Respond with JSON shaped exactly as:
{
  "errorType": string,
  "severity": "critical" | "warning" | "suggestion",
  "explanation": string,
  "rootCause": string,
  "prevention": string,
  "line": number | null,
  "fixedCode": string,
  "optimizationSuggestions": string[]
}`;
  const user = `My Python program failed.

CODE:
${code}

ERROR / TRACEBACK:
${error}

PROGRAM OUTPUT BEFORE FAILURE:
${output || "(none)"}

LIKELY LINE: ${lineNumber ?? "unknown"}

Explain it simply and give corrected code.`;
  return structured<AnalyzeResult>("analyze", system, user, code, error);
}

export interface ImproveResult {
  summary: string;
  currentComplexity: string;
  suggestedComplexity: string;
  improvedCode: string;
  suggestions: string[];
}

export function improveCode(args: { code: string; output?: string }) {
  const { code, output } = args;
  const system = `You are a senior Python engineer doing a friendly code review.
Preserve behaviour; never invent functionality. Respond with JSON shaped exactly as:
{
  "summary": string,
  "currentComplexity": string,
  "suggestedComplexity": string,
  "improvedCode": string,
  "suggestions": string[]
}`;
  const user = `Review and improve this working Python code for readability, performance, and best practices.

CODE:
${code}

OUTPUT:
${output || "(none)"}`;
  return structured<ImproveResult>("improve", system, user, code, "");
}

export interface LearnResult {
  concept: string;
  explanation: string;
  examples: string[];
  bestPractices: string[];
  commonMistakes: string[];
}

export function learnFromError(args: { code: string; error: string }) {
  const { code, error } = args;
  const system = `You are a patient Python teacher turning a mistake into a lesson.
Respond with JSON shaped exactly as:
{
  "concept": string,
  "explanation": string,
  "examples": string[],
  "bestPractices": string[],
  "commonMistakes": string[]
}`;
  const user = `A beginner hit this error. Teach the underlying concept clearly.

CODE:
${code}

ERROR:
${error}`;
  return structured<LearnResult>("learn", system, user, code, error);
}
