import { motion } from "framer-motion";
import { ArrowRight, Download, MessageSquare, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { siteConfig } from "@/data/siteConfig";
import { GlowButton } from "@/components/ui/GlowButton";

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Left-side scrim: fades the 3D canvas so text never competes with wireframes. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none
                   bg-gradient-to-r from-background via-background/92 to-transparent
                   dark:from-background dark:via-background/90 dark:to-transparent"
      />
      {/* Mobile scrim: full-bleed base tint so text stays readable. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none md:hidden bg-background/80"
      />

      <div className="container relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-content max-w-[56rem] pr-0 lg:pr-12"
        >
          <div className="hud-panel inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-hud tracking-widest">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
            SYSTEM ONLINE — OPEN TO OPPORTUNITIES
          </div>

          <p className="mt-12 text-4xl md:text-5xl lg:text-[56px] xl:text-[64px] font-semibold leading-[1.05] text-foreground/95">
            Hey, I'm Mohit
          </p>

          <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[52px] font-semibold leading-[1.12] tracking-tight text-foreground">
            Building intelligent, secure, and automated products for the{" "}
            <span className="text-gradient drop-shadow-[0_2px_30px_hsl(var(--cyan)/0.35)]">
              next digital era.
            </span>
          </h1>

          <p className="mt-7 text-lg md:text-xl lg:text-[22px] text-muted-foreground max-w-[52rem] leading-relaxed">
            A developer focused on AI automation, RAG security testing, full-stack products, and futuristic digital systems.
          </p>

          <div className="mt-10 flex flex-wrap lg:flex-nowrap gap-3">
            <a href="#projects">
              <GlowButton>
                VIEW PROJECTS <ArrowRight className="h-3.5 w-3.5" />
              </GlowButton>
            </a>
            <a href={siteConfig.resume} download={siteConfig.resumeDownloadName}>
              <GlowButton variant="outline">
                <Download className="h-3.5 w-3.5" /> DOWNLOAD RESUME
              </GlowButton>
            </a>
            <Link to="/compiler">
              <GlowButton variant="outline">
                <Terminal className="h-3.5 w-3.5" /> PYTHON COMPILER
              </GlowButton>
            </Link>
            <a href="#contact">
              <GlowButton variant="outline">
                <MessageSquare className="h-3.5 w-3.5" /> START A CONVERSATION
              </GlowButton>
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3 text-[10px] font-hud tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-16 bg-cyan/50" />
            SCROLL TO ENGAGE
            <span className="h-px w-16 bg-cyan/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}


