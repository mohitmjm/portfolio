export const reportData = {
  liveUrl: 'https://smart-hr-protal.vercel.app/portal/auth',
  githubUrl: 'https://github.com/Team-Innovatrix/Smart-HR-protal',
  title: "Smart HR Portal",
  subtitle: "with Predictive Analysis & AI Intelligence",
  aim: "To build a full-stack, enterprise-grade HR management portal that replaces manual HR processes with an intelligent, data-driven platform — integrating AI-powered predictions, real-time analytics, and role-based access control.",
  objectives: [
    "Automate routine HR operations: attendance tracking, leave management, payroll, and document handling.",
    "Provide employees with a self-service portal to manage their HR needs without depending on HR staff.",
    "Give HR admins a command-center dashboard with real-time organizational metrics.",
    "Integrate AI to predict employee turnover, analyze mood, and surface actionable HR insights.",
    "Implement secure, role-based access so employees and admins see only relevant modules.",
    "Support voice-based HR query resolution via an AI chatbot."
  ],
  solution: "A Next.js 14 full-stack web application with a deep navy sidebar shell, dual portals (Employee & Admin), and an AI analytics layer. The system uses Supabase for real-time data, Clerk for auth & role management, and Google Gemini for all AI-powered features.",
  methodology: [
    { step: "Requirements Analysis", detail: "Mapped all HR pain points across employee self-service, admin operations, and analytics." },
    { step: "System Architecture", detail: "Designed a dual-portal Next.js App Router architecture with server components and protected routes." },
    { step: "Database Design", detail: "Built PostgreSQL schema on Supabase covering employees, attendance, leaves, vacancies, and mood data." },
    { step: "Authentication & RBAC", detail: "Implemented Clerk for JWT-based auth with role-based rendering — employees and admins see different UIs." },
    { step: "AI Integration", detail: "Connected Google Gemini API via LangGraph for multi-step reasoning in turnover prediction, mood analysis, and the voice chatbot." },
    { step: "Frontend Development", detail: "Built 27 distinct UI modules in Tailwind CSS with Framer Motion animations and Recharts visualizations." },
    { step: "Testing & Deployment", detail: "End-to-end tested all CRUD operations, role guards, and AI responses before deploying on Vercel." }
  ],
  keyHighlights: [
    { icon: "🤖", title: "AI Turnover Prediction", desc: "Predicts which employees are at risk of leaving using attendance patterns, appraisal scores, and grievance history." },
    { icon: "😊", title: "Mood Intelligence", desc: "Aggregates sentiment from chat, surveys, and grievances to produce an org-wide mood score with early burnout alerts." },
    { icon: "🎙️", title: "Voice Assistant", desc: "Employees can ask HR questions hands-free: 'What is my leave balance?' or 'Show my last payslip'." },
    { icon: "📊", title: "Holiday Trend Analytics", desc: "Visualizes yearly and monthly leave patterns so HR can plan around peak-absence periods." },
    { icon: "🔐", title: "Role-Based Access", desc: "Clerk-powered RBAC ensures employees and admins access only their relevant portal modules." },
    { icon: "⚡", title: "Real-Time Data", desc: "Supabase Realtime keeps attendance dashboards, chat, and priority messages updated without page refresh." }
  ],
  techStack: [
    { name: "Next.js 14 App Router", purpose: "Full-stack framework with server components, API routes, and file-based routing for 27+ modules." },
    { name: "TypeScript", purpose: "Strict typing across all components, API handlers, and database models to prevent runtime errors." },
    { name: "Tailwind CSS", purpose: "Utility-first styling for rapid UI development with consistent spacing, color, and responsive design." },
    { name: "Google Gemini API", purpose: "Powers AI turnover prediction, employee mood analysis, holiday reason forecasting, and the HR chatbot." },
    { name: "LangGraph", purpose: "Orchestrates multi-step AI reasoning chains for complex predictions (e.g. attrition risk with multiple factors)." },
    { name: "Supabase (PostgreSQL)", purpose: "Cloud database for all HR records — employees, attendance, leave, vacancies, mood. Realtime subscriptions for live dashboards." },
    { name: "Supabase Storage", purpose: "File storage for employee documents, offer letters, payslips, and profile photos." },
    { name: "Clerk Authentication", purpose: "JWT-based auth with Google/GitHub OAuth. Manages employee vs. admin roles and session handling." },
    { name: "Framer Motion", purpose: "Page transitions, sidebar animations, scroll-triggered reveals, and micro-interactions across all modules." },
    { name: "Recharts", purpose: "Data visualizations: attendance bar charts, mood gauges, turnover trend lines, and holiday heatmaps." },
    { name: "date-fns", purpose: "Date arithmetic for leave calculations, attendance periods, and working-day exclusions." },
    { name: "SheetJS (xlsx)", purpose: "Excel export for attendance sheets, leave summaries, and employee reports." },
    { name: "SendGrid / Nodemailer", purpose: "Transactional emails for leave approval/rejection notifications and priority message alerts." },
    { name: "Web Speech API", purpose: "Browser-native voice input for the Quick Actions voice assistant module." },
    { name: "jsPDF", purpose: "PDF generation for attendance reports, holiday trend exports, and AI risk reports." }
  ]
};
