// Local deterministic fallback for the persona chatbot.
// Only sends chat context to providers when keys are present. No fake stats.

import { siteConfig } from "@/data/siteConfig";
import { projects } from "@/data/projects";

export type ChatMsg = { role: "user" | "assistant"; content: string };

const SYSTEM = `
You are ${siteConfig.name}'s AI persona on his portfolio website.
Mohit is a B.Tech CSE (AI & ML) student at RCOEM Nagpur, India.
He is a Full Stack Developer and AI/ML enthusiast.

ABOUT MOHIT:
- Studying Computer Science with specialization in AI & ML at RCOEM Nagpur (3rd Year)
- Passionate about building useful, polished, and reliable web + AI solutions
- Based in ${siteConfig.location}
- Email: ${siteConfig.email}
- Current: AI Security Analyst Intern at Quinine Cybersecurity (Apr 2026-Present)

PROJECTS & EXPERIENCE:
- Smart HR Portal with Predictive Analysis: A collaborative HRMS platform utilizing Next.js 14 and Supabase. It features comprehensive employee portals (attendance, leaves, document repository, voice assistant) and admin command centers (CRUD directory, approval flows, job vacancies). The core innovation lies in its AI-driven modules: Predicts employee turnover risk, performs workforce productivity analysis, maps mood & risk intelligence (burnout alerts), and uses a voice assistant powered by Gemini AI.
  Tech: Next.js 14, TypeScript, Tailwind CSS, Clerk Auth, Supabase (Realtime chat), Google Gemini API, LangGraph, Recharts, Framer Motion.
- Resume AI Analyzer: An intelligent platform to parse, analyze, and grade resumes against job roles using TF-IDF cosine similarity. Tech: React, Python, Flask, NLP.
- Diabetes Prediction App: A Streamlit-based web dashboard predicting diabetes risk using Scikit-Learn classification models.
- Drowsiness Detector: A computer vision app calculating Eye Aspect Ratio (EAR) with MediaPipe + OpenCV to detect real-time driver drowsiness.
- Python Compiler (this site): In-browser Pyodide compiler with an AI mentor (Analyze / Improve / Learn) — available at /compiler.

SKILLS:
- Frontend: React.js, Next.js, TypeScript, HTML, CSS, Tailwind
- AI/ML: Scikit-Learn, TensorFlow basics, OpenCV, MediaPipe, NLP (TF-IDF, Cosine Similarity)
- Backend: Python (Flask, Streamlit), Node.js (Express), MongoDB, Supabase
- Tools: Git, GitHub, VS Code, Vercel, Netlify

BEHAVIOR RULES:
- Keep answers short and confident (2-4 sentences max).
- Tone: friendly, witty, professional — like Mohit himself.
- If unsure, say "Mohit will get back to you — hit the contact section!"
- When asked about the HR Portal's modules/screenshots, suggest visiting the Smart HR Portal details page at /smart-hr-portal.
- End hiring/collaboration answers by nudging the visitor to the Contact section.
- Never fabricate numbers, stats or details.
`;

function localAnswer(user: string): string {
  const q = user.toLowerCase();
  if (q.includes("hire") || q.includes("intern") || q.includes("job") || q.includes("collab"))
    return `Mohit is open to internships, freelance and full-time roles in AI/ML, cybersecurity, automation and full-stack. The fastest path is the Contact terminal below, or ${siteConfig.email}.`;
  if (q.includes("smart hr") || q.includes("hr portal"))
    return `Smart HR Portal is Mohit's flagship — a data-driven HR platform combining standard workflows with predictive models for attrition, performance and recruitment. Built on Next.js 14 + ML. See the case study page.`;
  if (q.includes("resume ai") || q.includes("resume analyz"))
    return `Resume AI Analyzer parses resumes and scores them against job descriptions using NLP + TF-IDF cosine similarity. React front, Python/Flask back.`;
  if (q.includes("drowsi"))
    return `Drowsiness Detector uses Eye Aspect Ratio via MediaPipe + OpenCV in a Streamlit app to warn on likely micro-sleep events.`;
  if (q.includes("voice") || q.includes("attrition"))
    return `Smart HR includes a voice-assisted quick-actions panel and predictive attrition/turnover modules on the admin side. Full walkthrough is in the case study.`;
  if (q.includes("skill") || q.includes("stack"))
    return `Core stack: React/Next.js/TypeScript, Python/Flask/Node, Scikit-Learn/TensorFlow/OpenCV/MediaPipe/NLP, plus Git, Vercel, Netlify, Streamlit. Actively going deeper on AI security and automation.`;
  if (q.includes("contact") || q.includes("email"))
    return `You can reach Mohit at ${siteConfig.email}, or via the LinkedIn/GitHub links in the Contact section.`;
  return `I'm Mohit's on-site persona. Ask me about his projects (Smart HR Portal, Resume AI, Diabetes, Drowsiness Detector), skills, focus areas or how to work with him.`;
}

async function callGemini(key: string, messages: ChatMsg[]): Promise<string | null> {
  try {
    const body = {
      systemInstruction: { role: "system", parts: [{ text: SYSTEM }] },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: { temperature: 0.4, maxOutputTokens: 260 },
    };
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
    );
    if (!r.ok) return null;
    const j = await r.json();
    const text = j?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" ? text.trim() : null;
  } catch {
    return null;
  }
}

async function callGroq(key: string, model: string, messages: ChatMsg[]): Promise<string | null> {
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 260,
        messages: [{ role: "system", content: SYSTEM }, ...messages],
      }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    return j?.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  }
}

export async function askPersona(messages: ChatMsg[]): Promise<string> {
  const last = messages[messages.length - 1]?.content ?? "";
  const gk = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  const grq = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
  const grqModel = (import.meta.env.VITE_GROQ_MODEL as string | undefined) || "llama-3.3-70b-versatile";

  if (gk) {
    const r = await callGemini(gk, messages);
    if (r) return r;
  }
  if (grq) {
    const r = await callGroq(grq, grqModel, messages);
    if (r) return r;
  }
  return localAnswer(last);
}

export const QUICK_REPLIES = [
  "✨ HR Portal Overview",
  "✨ HR Portal AI Features",
  "✨ Voice Assistant & Attrition",
  "👥 Resume AI Analyzer",
  "👁️ Drowsiness Detector",
];

export const projectMentions = projects.map((p) => p.name);
