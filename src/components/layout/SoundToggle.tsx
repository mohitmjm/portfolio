import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";
import { getSoundEnabled, playUiSound, setSoundEnabled, SOUND_PREF_EVENT } from "@/lib/sound";

type SoundToggleProps = {
  className?: string;
};

export function SoundToggle({ className }: SoundToggleProps) {
  const [enabled, setEnabled] = useState(() => getSoundEnabled());

  useEffect(() => {
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<boolean>).detail;
      setEnabled(typeof next === "boolean" ? next : getSoundEnabled());
    };

    window.addEventListener(SOUND_PREF_EVENT, onChange);
    return () => window.removeEventListener(SOUND_PREF_EVENT, onChange);
  }, []);

  const toggle = () => {
    const next = !enabled;

    if (next) {
      setSoundEnabled(true);
      window.setTimeout(() => playUiSound("success", { force: true }), 10);
    } else {
      playUiSound("toggle", { force: true });
      setSoundEnabled(false);
    }

    setEnabled(next);
  };

  return (
    <button
      type="button"
      data-sound-control
      onClick={toggle}
      aria-label={enabled ? "Turn interface sound off" : "Turn interface sound on"}
      aria-pressed={enabled}
      title={enabled ? "Sound on" : "Sound off"}
      className={cn("hud-panel h-10 w-10 grid place-items-center hover:shadow-glow transition-shadow", className)}
    >
      {enabled ? <Volume2 className="h-4 w-4 text-cyan" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
    </button>
  );
}
