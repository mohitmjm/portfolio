import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { certifications, education, experience } from "@/data/experience";
import { Award, Briefcase, GraduationCap } from "lucide-react";

export function JourneySection() {
  return (
    <section id="journey" className="relative py-28">
      <div className="container">
        <SectionHeader
          eyebrow="// TIMELINE TUNNEL"
          title="Education, internships, learning path."
          description="A verified track of where I've been and what I'm actively doing."
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="font-hud text-[11px] tracking-[0.3em] text-cyan mb-4 flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5" /> EXPERIENCE
            </div>
            <div className="space-y-4">
              {experience.map((e, i) => (
                <motion.div
                  key={e.role}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <HolographicPanel>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-semibold">{e.role}</h3>
                        <div className="text-sm text-muted-foreground">{e.org}</div>
                      </div>
                      <div className="text-[11px] font-mono text-cyan whitespace-nowrap">{e.period}</div>
                    </div>
                    <div className="text-[10px] font-hud tracking-widest text-signal mb-2">{e.type.toUpperCase()}</div>
                    <p className="text-sm text-muted-foreground">{e.summary}</p>
                  </HolographicPanel>
                </motion.div>
              ))}
            </div>

            <div className="font-hud text-[11px] tracking-[0.3em] text-violet mt-8 mb-4 flex items-center gap-2">
              <Award className="h-3.5 w-3.5" /> CERTIFICATIONS
            </div>
            <HolographicPanel>
              <ul className="space-y-2">
                {certifications.map((c) => (
                  <li key={c.name} className="flex items-center justify-between text-sm">
                    <span>{c.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{c.note}</span>
                  </li>
                ))}
              </ul>
            </HolographicPanel>
          </div>

          <div>
            <div className="font-hud text-[11px] tracking-[0.3em] text-electric mb-4 flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5" /> EDUCATION
            </div>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan via-electric to-violet opacity-50" />
              <div className="space-y-4">
                {education.map((ed, i) => (
                  <motion.div
                    key={ed.institute}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="relative pl-12"
                  >
                    <div className="absolute left-0 top-4 h-8 w-8 rounded-full hud-panel-strong grid place-items-center overflow-hidden">
                      <img
                        src={ed.logo}
                        alt={`${ed.institute} logo`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
                      />
                    </div>
                    <HolographicPanel>
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-semibold text-base leading-tight">{ed.institute}</h3>
                        <span className="text-[11px] font-mono text-cyan whitespace-nowrap">{ed.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{ed.degree}</p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] font-hud tracking-widest">
                        <span className="text-muted-foreground">{ed.location.toUpperCase()}</span>
                        <span className="text-signal">• {ed.status.toUpperCase()}</span>
                      </div>
                    </HolographicPanel>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
