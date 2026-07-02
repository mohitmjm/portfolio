const profileImg = "/images/mohit-ai-profile.png";

const TAGS = ["AI Automation", "RAG Security", "Full-Stack"];

export function ProfileHologramCard() {
  return (
    <div className="relative w-full max-w-[400px] mx-auto lg:ml-auto lg:mr-0">
      {/* Ambient glow — behind card only */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[32px] pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 55% at 60% 40%, hsl(var(--cyan)/0.18), transparent 70%), radial-gradient(50% 50% at 30% 80%, hsl(var(--violet)/0.18), transparent 70%)",
          filter: "blur(28px)",
        }}
      />

      <div
        className="relative rounded-[28px] overflow-hidden border border-cyan/25 bg-[rgba(15,23,42,0.72)] backdrop-blur-xl shadow-[0_25px_80px_-30px_hsl(var(--cyan)/0.35)]"
        style={{ aspectRatio: "4 / 5" }}
      >
        {/* Corner accents */}
        <div className="absolute top-2.5 left-2.5 h-3.5 w-3.5 border-t border-l border-cyan/70 z-20" aria-hidden />
        <div className="absolute top-2.5 right-2.5 h-3.5 w-3.5 border-t border-r border-cyan/70 z-20" aria-hidden />
        <div className="absolute bottom-2.5 left-2.5 h-3.5 w-3.5 border-b border-l border-cyan/70 z-20" aria-hidden />
        <div className="absolute bottom-2.5 right-2.5 h-3.5 w-3.5 border-b border-r border-cyan/70 z-20" aria-hidden />

        {/* Portrait image */}
        <img
          src={profileImg}
          alt="Mohit Mohatkar professional AI profile portrait"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[center_top]"
        />

        {/* Navy tonal overlay to match palette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(2,6,23,0.15) 0%, rgba(2,6,23,0.05) 40%, rgba(2,6,23,0.85) 100%)",
          }}
        />

        {/* Subtle scanline */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-15 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(34,211,238,0.5) 0px, rgba(34,211,238,0.5) 1px, transparent 1px, transparent 4px)",
          }}
        />

        {/* Bottom info overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-white tracking-tight">
              Mohit Mohatkar
            </p>
            <span className="flex items-center gap-1.5 font-hud text-[9px] tracking-widest text-signal">
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
              AVAILABLE
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full border border-cyan/25 bg-black/40 text-[10px] tracking-wide text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
