import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="hud-panel h-10 w-10 grid place-items-center hover:shadow-glow transition-shadow"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-cyan" />
      ) : (
        <Moon className="h-4 w-4 text-electric" />
      )}
    </button>
  );
}
