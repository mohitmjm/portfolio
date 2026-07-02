import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  strong?: boolean;
  scanline?: boolean;
};

export function HolographicPanel({ children, className, strong, scanline, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={cn(
        strong ? "hud-panel-strong" : "hud-panel",
        scanline && "relative scanline",
        "p-6 md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
