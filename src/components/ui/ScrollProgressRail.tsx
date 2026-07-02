import { useEffect, useState } from "react";
import { useScrollProgress } from "@/lib/motion";

const SECTIONS = [
  { id: "hero", label: "CORE" },
  { id: "about", label: "ID" },
  { id: "skills", label: "ORBIT" },
  { id: "projects", label: "STATIONS" },
  { id: "focus", label: "SHIELD" },
  { id: "journey", label: "TUNNEL" },
  { id: "contact", label: "LAUNCH" },
];

export function ScrollProgressRail() {
  const p = useScrollProgress();
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3">
      <div className="font-hud text-[10px] text-muted-foreground tracking-[0.3em]">
        {String(Math.round(p * 100)).padStart(2, "0")}%
      </div>
      <div className="relative h-64 w-px bg-border">
        <div
          className="absolute top-0 left-0 w-px bg-gradient-to-b from-cyan via-electric to-violet transition-all"
          style={{ height: `${p * 100}%` }}
        />
      </div>
      <ul className="flex flex-col gap-2 text-right">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`font-hud text-[10px] tracking-[0.25em] transition-colors ${
                active === s.id ? "text-cyan" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
