import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  children: ReactNode;
};

export const GlowButton = forwardRef<HTMLButtonElement, Props>(
  ({ children, className, variant = "primary", ...rest }, ref) => {
    return (
      <button
        ref={ref}
        {...rest}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full font-hud text-xs tracking-wider transition-all",
          variant === "primary" &&
            "bg-gradient-text text-primary-foreground shadow-hud hover:shadow-glow hover:scale-[1.02]",
          variant === "outline" &&
            "hud-panel hover:shadow-glow border border-cyan/40",
          variant === "ghost" &&
            "text-foreground hover:bg-secondary",
          className,
        )}
      >
        {children}
      </button>
    );
  },
);
GlowButton.displayName = "GlowButton";
