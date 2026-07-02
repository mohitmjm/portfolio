import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { GlowButton } from "@/components/ui/GlowButton";

import { smartHrModules } from "@/data/smartHrModules";
import { ExternalLink, FileText, Github } from "lucide-react";

const NAV = [
  { id: "report", label: "Project Report" },
  { id: "modules", label: "Module Demos" },
  { id: "employee", label: "Employee Portal" },
  { id: "admin", label: "Admin Portal" },
  { id: "ai", label: "AI Analytics" },
];

const HIGHLIGHTS = [
  "Predictive attrition and turnover modelling",
  "Voice-assisted quick actions for employees",
  "Holiday trend + reason prediction",
  "Risk & mood intelligence dashboard",
  "Priority messaging and mood chatbot",
  "Admin analytics for workforce planning",
];

const STACK = ["Next.js 14", "TypeScript", "Tailwind CSS", "Clerk Auth", "Framer Motion", "Machine Learning (Predictive)"];

const SmartHrPortal = () => {
  const [active, setActive] = useState("report");

  return (
    <>
      <Helmet>
        <title>Smart HR Portal — Case Study | Mohit Mohatkar</title>
        <meta name="description" content="Case study of the Smart HR Portal — a Next.js + Machine Learning HR platform with predictive attrition, voice assistance and AI analytics." />
        <link rel="canonical" href="https://mohitmohatkar.in/smart-hr-portal" />
      </Helmet>

      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container">
          <div className="mb-10">
            <div className="font-hud text-[11px] tracking-[0.3em] text-cyan mb-3">// FLAGSHIP CASE STUDY</div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              <span className="text-gradient">Smart HR Portal</span> with Predictive Analysis & AI Intelligence
            </h1>
            <p className="mt-4 text-muted-foreground max-w-3xl">
              A collaborative HR platform that fuses standard HR workflows with predictive analytics and AI —
              built to help teams plan headcount, spot attrition risk and act early.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a href="https://smart-hr-protal.vercel.app/portal/auth" target="_blank" rel="noreferrer">
                <GlowButton><ExternalLink className="h-3.5 w-3.5" /> LIVE PROJECT</GlowButton>
              </a>
              <a href="https://github.com/Team-Innovatrix/Smart-HR-protal" target="_blank" rel="noreferrer">
                <GlowButton variant="outline"><Github className="h-3.5 w-3.5" /> GITHUB</GlowButton>
              </a>
              <a href="/assets/Hr_Portal.pdf" target="_blank" rel="noreferrer">
                <GlowButton variant="outline"><FileText className="h-3.5 w-3.5" /> FULL REPORT (PDF)</GlowButton>
              </a>
            </div>
          </div>

          <div className="grid lg:grid-cols-[220px_1fr] gap-6">
            <aside className="lg:sticky lg:top-24 self-start">
              <HolographicPanel className="p-3">
                <nav className="flex lg:flex-col gap-1 overflow-x-auto">
                  {NAV.map((n) => (
                    <a
                      key={n.id}
                      href={`#${n.id}`}
                      onClick={() => setActive(n.id)}
                      className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                        active === n.id ? "bg-cyan/15 text-cyan" : "hover:bg-secondary text-muted-foreground"
                      }`}
                    >
                      {n.label}
                    </a>
                  ))}
                </nav>
              </HolographicPanel>
            </aside>

            <div className="space-y-6">
              <HolographicPanel id="report" strong>
                <h2 className="text-2xl font-semibold mb-4"><span className="text-gradient">Project Report</span></h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-hud text-[10px] tracking-widest text-cyan mb-1">AIM</div>
                    <p className="text-muted-foreground">Deliver a modern HR platform that combines everyday operations with forward-looking predictive intelligence.</p>
                  </div>
                  <div>
                    <div className="font-hud text-[10px] tracking-widest text-violet mb-1">OBJECTIVES</div>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Employee + admin experiences under one roof</li>
                      <li>Predictive attrition & turnover</li>
                      <li>Mood + risk intelligence</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-hud text-[10px] tracking-widest text-signal mb-1">SOLUTION</div>
                    <p className="text-muted-foreground">Next.js 14 + TypeScript front, Clerk auth, ML models for prediction and analytics dashboards for HR.</p>
                  </div>
                  <div>
                    <div className="font-hud text-[10px] tracking-widest text-amber-hud mb-1">METHODOLOGY</div>
                    <p className="text-muted-foreground">Iterative delivery — module by module, with real HR flows validated before layering intelligence on top.</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="font-hud text-[10px] tracking-widest text-cyan mb-2">KEY HIGHLIGHTS</div>
                  <div className="flex flex-wrap gap-2">
                    {HIGHLIGHTS.map((h) => (
                      <span key={h} className="text-xs px-2.5 py-1 rounded-full bg-secondary border border-border">{h}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="font-hud text-[10px] tracking-widest text-violet mb-2">TECH STACK</div>
                  <div className="flex flex-wrap gap-2">
                    {STACK.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-cyan/10 border border-cyan/40 text-cyan font-mono">{s}</span>
                    ))}
                  </div>
                </div>
              </HolographicPanel>

              <HolographicPanel id="modules">
                <h2 className="text-2xl font-semibold mb-2"><span className="text-gradient">Module Walkthrough</span></h2>
                <p className="text-sm text-muted-foreground mb-6">All {smartHrModules.length} modules in order — lazy loaded.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {smartHrModules.map((m, i) => (
                    <figure key={m.title} className="hud-panel p-2 flex flex-col">
                      <div className="aspect-video rounded-md overflow-hidden bg-secondary/60 border border-border">
                        <img
                          src={m.file}
                          alt={`${m.title} — Smart HR Portal screenshot`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const el = e.currentTarget as HTMLImageElement;
                            el.style.display = "none";
                            el.parentElement!.innerHTML = `<div class="w-full h-full grid place-items-center text-[10px] font-mono text-muted-foreground">SCREENSHOT ${i + 1}</div>`;
                          }}
                        />
                      </div>
                      <figcaption className="mt-2 text-xs">
                        <span className="font-hud text-[10px] tracking-widest text-cyan">{String(i + 1).padStart(2, "0")}</span>
                        <span className="ml-2">{m.title}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </HolographicPanel>

              <div className="grid md:grid-cols-2 gap-6">
                <HolographicPanel id="employee">
                  <h3 className="text-lg font-semibold mb-2 text-gradient">Employee Portal</h3>
                  <p className="text-sm text-muted-foreground">Dashboard, attendance, leave, profile, HR docs, chat and voice quick actions.</p>
                </HolographicPanel>
                <HolographicPanel id="admin">
                  <h3 className="text-lg font-semibold mb-2 text-gradient">Admin Portal</h3>
                  <p className="text-sm text-muted-foreground">Employee, leave, attendance, vacancies — with export flows built in.</p>
                </HolographicPanel>
              </div>

              <HolographicPanel id="ai" strong>
                <h3 className="text-lg font-semibold mb-2 text-gradient">AI Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Attrition prediction, turnover analysis, holiday trend/reason prediction, mood tracking and priority
                  messaging — surfaced as actionable dashboards for HR decision-making.
                </p>
              </HolographicPanel>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SmartHrPortal;
