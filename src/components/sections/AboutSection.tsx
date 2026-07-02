import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { siteConfig } from "@/data/siteConfig";
import { MapPin, Mail, GraduationCap } from "lucide-react";

const ROLES = [
  { title: "Student", body: "B.Tech CSE (AI & ML) at RCOEM Nagpur — 2024–2027." },
  { title: "Full-Stack Developer", body: "React, Next.js, Node.js, Python — shipping product-quality interfaces and backends." },
  { title: "AI Automation Builder", body: "Automating workflows and building AI-assisted tools around real problems." },
  { title: "Cybersecurity Learner / Intern", body: "AI Security Analyst Intern at Quinine Cybersecurity — LLM security, RAG testing, prompt-injection awareness." },
  { title: "SaaS / Product Builder", body: "Thinking in problem → solution → shipped product, not just features." },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-28">
      <div className="container">
        <SectionHeader
          eyebrow="// IDENTITY PANEL"
          title="An operator between AI, security and product."
          description="I care about building software that actually works, defends itself, and moves fast. This is the operating layer behind everything I ship."
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <HolographicPanel strong className="lg:col-span-1">
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-secondary/60 border border-cyan/25 relative">
                <img
                  src={siteConfig.profileImage}
                  alt="Mohit Mohatkar futuristic AI portrait"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-[center_top]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(2,6,23,0.02) 0%, rgba(2,6,23,0.02) 45%, rgba(2,6,23,0.76) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                  <div className="font-hud text-[10px] tracking-[0.28em] text-cyan">AI PROFILE</div>
                  <div className="mt-1 text-sm font-semibold text-white">{siteConfig.name}</div>
                </div>
                <div className="absolute inset-0 pointer-events-none scanline" />
              </div>
              <div className="font-hud text-sm tracking-wider">{siteConfig.name.toUpperCase()}</div>
              <div className="text-xs font-mono text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-cyan" /> {siteConfig.location}</div>
                <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-cyan" /> {siteConfig.email}</div>
                <div className="flex items-center gap-2"><GraduationCap className="h-3 w-3 text-cyan" /> B.Tech CSE — AI & ML</div>
              </div>
            </div>
          </HolographicPanel>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {ROLES.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <HolographicPanel className="h-full">
                  <div className="font-hud text-[10px] tracking-[0.25em] text-cyan mb-2">MODULE 0{i + 1}</div>
                  <h3 className="text-lg font-semibold mb-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
                </HolographicPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
