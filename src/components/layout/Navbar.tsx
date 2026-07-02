import { Link, useLocation } from "react-router-dom";
import { Download, Menu, X, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { SoundToggle } from "./SoundToggle";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Focus", href: "#focus" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="container">
        <div
          className={cn(
            "flex items-center justify-between gap-4 px-4 md:px-6 h-14 rounded-full",
            scrolled ? "hud-panel-strong" : "hud-panel",
          )}
        >
          <Link to="/" className="flex items-center gap-2 font-hud text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_12px_hsl(var(--cyan))] anim-pulse-glow" />
            <span className="tracking-widest">MOHIT.OS</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {onHome &&
              NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                >
                  {n.label}
                </a>
              ))}
            {!onHome && (
              <>
                <Link to="/" className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground">
                  ← Portfolio
                </Link>
                <Link to="/smart-hr-portal" className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground">
                  Smart HR
                </Link>
                <Link to="/compiler" className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground">
                  Compiler
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/compiler"
              className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-full font-hud text-xs border border-cyan/40 text-cyan bg-cyan/5 hover:bg-cyan/10 hover:shadow-[0_0_16px_hsl(var(--cyan)/0.35)] transition-all"
              aria-label="Open Python Compiler"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">COMPILER</span>
              <span className="lg:hidden">PY</span>
            </Link>
            <a
              href={siteConfig.resume}
              download={siteConfig.resumeDownloadName}
              className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-full font-hud text-xs bg-gradient-text text-primary-foreground hover:shadow-glow transition-shadow"
            >
              <Download className="h-3.5 w-3.5" /> RESUME
            </a>
            <SoundToggle />
            <ThemeToggle />
            <button
              className="lg:hidden hud-panel h-10 w-10 grid place-items-center"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 hud-panel-strong p-4 space-y-1 anim-fade-up">
            {onHome
              ? NAV.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-secondary text-sm"
                  >
                    {n.label}
                  </a>
                ))
              : (
                <>
                  <Link to="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-secondary text-sm">← Portfolio</Link>
                  <Link to="/smart-hr-portal" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-secondary text-sm">Smart HR Portal</Link>
                </>
              )}
            <Link
              to="/compiler"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary text-sm text-cyan"
            >
              <Terminal className="h-4 w-4" /> Python Compiler
            </Link>
            <a
              href={siteConfig.resume}
              download={siteConfig.resumeDownloadName}
              onClick={() => setOpen(false)}
              className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary text-sm"
            >
              <Download className="h-4 w-4" /> Resume
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
