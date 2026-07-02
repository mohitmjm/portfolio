export type SkillGroup = {
  name: string;
  accent: "cyan" | "violet" | "electric" | "signal" | "amber-hud";
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  { name: "Frontend", accent: "cyan", skills: ["React", "Next.js", "JavaScript", "TypeScript", "HTML & CSS", "Tailwind"] },
  { name: "Backend", accent: "electric", skills: ["Python", "Node.js", "Flask", "MongoDB"] },
  { name: "AI / ML", accent: "violet", skills: ["Machine Learning", "TensorFlow", "OpenCV", "MediaPipe", "NLP", "Scikit-Learn"] },
  { name: "Tools & Deploy", accent: "signal", skills: ["Git & GitHub", "Vercel", "Netlify", "Streamlit"] },
  { name: "Automation", accent: "amber-hud", skills: ["Workflow Automation", "Scripting", "Data Pipelines"] },
  { name: "Cybersecurity", accent: "cyan", skills: ["Security Research", "LLM Security Awareness", "Prompt Injection Awareness", "RAG Security Testing"] },
];
