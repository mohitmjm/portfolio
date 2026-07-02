import { useEffect, useState } from "react";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";
import { siteConfig, socialLinks } from "@/data/siteConfig";

export function Footer() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const bumped = sessionStorage.getItem("mm-view-bumped");
    const url = bumped ? siteConfig.counterApi.read : siteConfig.counterApi.up;
    if (!bumped) sessionStorage.setItem("mm-view-bumped", "1");
    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        const n = data?.count ?? data?.data?.count ?? data?.value ?? null;
        if (typeof n === "number") setViews(n);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="relative border-t border-border/60 mt-20">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. Built with intent.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="hud-panel h-9 w-9 grid place-items-center hover:shadow-glow"><Mail className="h-4 w-4" /></a>
          <a href={socialLinks.github} aria-label="GitHub" target="_blank" rel="noreferrer" className="hud-panel h-9 w-9 grid place-items-center hover:shadow-glow"><Github className="h-4 w-4" /></a>
          <a href={socialLinks.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer" className="hud-panel h-9 w-9 grid place-items-center hover:shadow-glow"><Linkedin className="h-4 w-4" /></a>
          <a href={socialLinks.instagram} aria-label="Instagram" target="_blank" rel="noreferrer" className="hud-panel h-9 w-9 grid place-items-center hover:shadow-glow"><Instagram className="h-4 w-4" /></a>
        </div>

        <div className="font-mono text-xs text-muted-foreground">
          {views !== null ? (
            <>SIGNAL PINGS <span className="text-cyan">{views.toLocaleString()}</span></>
          ) : (
            <>SIGNAL PINGS <span className="opacity-50">…</span></>
          )}
        </div>
      </div>
    </footer>
  );
}
