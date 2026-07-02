import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("mb-10 md:mb-14", align === "center" && "text-center mx-auto max-w-2xl", className)}>
      <div className={cn("flex items-center gap-2 mb-4", align === "center" && "justify-center")}>
        <span className="h-px w-8 bg-cyan" />
        <span className="font-hud text-[11px] tracking-[0.3em] text-cyan">{eyebrow}</span>
        <span className="h-px w-8 bg-cyan" />
      </div>
      <h2 className="text-3xl md:text-5xl font-semibold leading-[1.05]">
        <span className="text-gradient">{title}</span>
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
