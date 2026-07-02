import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import { projects, type Project } from "@/data/projects";
import { ExternalLink, Github, FileText, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function ProjectStation({ p, index }: { p: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -y * 6, ry: x * 6 });
  };
  const reset = () => setTilt({ rx: 0, ry: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      className="tilt-3d"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <HolographicPanel strong={p.flagship} className="h-full relative overflow-hidden">
          {p.flagship && (
            <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan/15 border border-cyan/40 text-cyan text-[10px] font-hud tracking-widest">
              <Sparkles className="h-3 w-3" /> FLAGSHIP
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="font-hud text-[10px] tracking-[0.3em] text-cyan">
              STATION 0{index + 1} • {p.category.toUpperCase()}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-semibold mb-2 leading-tight">{p.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{p.summary}</p>

          {(p.problem || p.solution) && (
            <div className="space-y-2 mb-4 text-xs">
              {p.problem && (
                <div>
                  <span className="font-hud text-[10px] text-violet tracking-widest">PROBLEM · </span>
                  <span className="text-muted-foreground">{p.problem}</span>
                </div>
              )}
              {p.solution && (
                <div>
                  <span className="font-hud text-[10px] text-signal tracking-widest">SOLUTION · </span>
                  <span className="text-muted-foreground">{p.solution}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-5">
            {p.tags.map((t) => (
              <span key={t} className="px-2 py-1 rounded-md bg-secondary/70 text-[10px] font-mono text-muted-foreground">
                {t}
              </span>
            ))}
          </div>

          {p.status && (
            <div className="inline-flex items-center gap-2 mb-4 text-[11px] font-hud tracking-wider text-amber-hud">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-hud animate-pulse" />
              {p.status.toUpperCase()}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {p.links.live && (
              <a href={p.links.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-gradient-text text-primary-foreground text-xs font-hud tracking-wider hover:shadow-glow transition-shadow">
                <ExternalLink className="h-3 w-3" /> LIVE
              </a>
            )}
            {p.links.github && (
              <a href={p.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full hud-panel text-xs font-hud tracking-wider hover:shadow-glow">
                <Github className="h-3 w-3" /> CODE
              </a>
            )}
            {p.links.report && (
              <a href={p.links.report} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full hud-panel text-xs font-hud tracking-wider hover:shadow-glow">
                <FileText className="h-3 w-3" /> REPORT
              </a>
            )}
            {p.links.details && (
              <Link to={p.links.details} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full hud-panel text-xs font-hud tracking-wider hover:shadow-glow">
                CASE STUDY <ArrowUpRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </HolographicPanel>
      </div>
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-28">
      <div className="container">
        <SectionHeader
          eyebrow="// PROJECT STATIONS"
          title="Floating command screens. Real deployments."
          description="Every station links to code, live demo or full report — no black boxes."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <ProjectStation key={p.slug} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
