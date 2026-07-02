import { motion } from "framer-motion";
import { ArrowRight, Download, MessageSquare } from "lucide-react";
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
          className="hero-content max-w-[46rem] pr-0 lg:pr-12"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] xl:text-[84px] font-semibold leading-[0.98] tracking-tight text-foreground">
            Hey, I'm{" "}
            <span className="text-cyan drop-shadow-[0_0_28px_hsl(var(--cyan)/0.45)]">
              Mohit
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-[34rem] leading-relaxed">
            AI developer, cybersecurity intern, and full-stack builder.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
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
            <a href="#contact">
              <GlowButton variant="outline">
                <MessageSquare className="h-3.5 w-3.5" /> CONTACT ME
              </GlowButton>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
