/* AIPanel — renders analyze / improve / learn results from aiClient.
   Trimmed reimplementation using project design tokens (HolographicPanel). */

import { Zap, X, Check, BookOpen, AlertOctagon, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import type { AnalyzeResult, ImproveResult, LearnResult, AIProvider } from "./aiClient";
import { cn } from "@/lib/utils";

export type AIKind = "analyze" | "improve" | "learn";

export interface AIState {
  status: "idle" | "loading" | "done" | "error";
  kind?: AIKind;
  data?: AnalyzeResult | ImproveResult | LearnResult;
  provider?: AIProvider;
  model?: string;
  message?: string;
}

const SEVERITY = {
  critical: { cls: "text-red-400 border-red-500/40 bg-red-500/10", Icon: AlertOctagon, label: "Critical" },
  warning: { cls: "text-amber-400 border-amber-500/40 bg-amber-500/10", Icon: AlertTriangle, label: "Warning" },
  suggestion: { cls: "text-cyan border-cyan/40 bg-cyan/10", Icon: Info, label: "Suggestion" },
} as const;

function ProviderBadge({ provider, model }: { provider?: AIProvider; model?: string }) {
  if (!provider) return null;
  const gemini = provider === "gemini";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-hud tracking-wider border",
        gemini ? "border-violet-500/40 text-violet-300 bg-violet-500/10" : "border-orange-500/40 text-orange-300 bg-orange-500/10",
      )}
      title={model}
    >
      {gemini ? "✨ Gemini" : "⚡ Groq"}
    </span>
  );
}

function CodeBlock({ title, code, onApply }: { title: string; code?: string; onApply?: (c: string) => void }) {
  const [applied, setApplied] = useState(false);
  if (!code) return null;
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-background/60">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border text-[10px] font-hud tracking-widest text-muted-foreground">
        <span>{title}</span>
        {onApply && (
          <button
            type="button"
            onClick={() => {
              onApply(code);
              setApplied(true);
              setTimeout(() => setApplied(false), 2000);
            }}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] transition-colors",
              applied ? "text-emerald-400 bg-emerald-500/10" : "text-cyan hover:bg-cyan/10",
            )}
          >
            {applied ? <Check className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
            {applied ? "APPLIED" : "APPLY FIX"}
          </button>
        )}
      </div>
      <pre className="p-3 text-xs font-mono whitespace-pre-wrap overflow-auto max-h-80">{code}</pre>
    </div>
  );
}

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="space-y-1.5">
      <h4 className="font-hud text-[10px] tracking-widest text-cyan">{title}</h4>
      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </section>
  );
}

interface Props {
  ai: AIState;
  onApply?: (code: string) => void;
  onLearn?: () => void;
  onClose: () => void;
}

export default function AIPanel({ ai, onApply, onLearn, onClose }: Props) {
  const { status, kind, data, provider, model, message } = ai;

  const loadingLabel =
    kind === "improve" ? "Reviewing your code" :
    kind === "learn" ? "Preparing a lesson" :
    "Analyzing the error";

  return (
    <div className="anim-fade-up flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="inline-flex items-center gap-2 font-hud text-[11px] tracking-widest text-cyan">
          <Zap className={cn("h-3.5 w-3.5", status === "loading" && "animate-pulse")} />
          AI MENTOR
        </span>
        <span className="flex items-center gap-2">
          {status === "done" && <ProviderBadge provider={provider} model={model} />}
          <button onClick={onClose} aria-label="Dismiss" className="h-7 w-7 grid place-items-center rounded-md hover:bg-secondary">
            <X className="h-3.5 w-3.5" />
          </button>
        </span>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-4 text-sm">
        {status === "loading" && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan animate-pulse" />
            {loadingLabel}…
          </div>
        )}

        {status === "error" && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 text-red-300 p-3 text-xs">
            {message || "AI assistance is unavailable right now. Please try again."}
          </div>
        )}

        {status === "done" && kind === "analyze" && data && (() => {
          const d = data as AnalyzeResult;
          const sev = SEVERITY[d.severity] ?? SEVERITY.suggestion;
          const SIcon = sev.Icon;
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md border border-border font-mono text-[11px]">{d.errorType || "Error"}</span>
                <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-hud border", sev.cls)}>
                  <SIcon className="h-3 w-3" /> {sev.label}
                </span>
                {d.line != null && <span className="px-2 py-0.5 rounded-md bg-secondary text-[10px]">Line {d.line}</span>}
              </div>
              <section><h4 className="font-hud text-[10px] tracking-widest text-cyan mb-1">WHAT HAPPENED</h4><p className="text-muted-foreground">{d.explanation}</p></section>
              {d.rootCause && <section><h4 className="font-hud text-[10px] tracking-widest text-cyan mb-1">ROOT CAUSE</h4><p className="text-muted-foreground">{d.rootCause}</p></section>}
              {d.prevention && <section><h4 className="font-hud text-[10px] tracking-widest text-cyan mb-1">HOW TO PREVENT</h4><p className="text-muted-foreground">{d.prevention}</p></section>}
              <CodeBlock title="Suggested fix" code={d.fixedCode} onApply={onApply} />
              <List title="OPTIMIZATION SUGGESTIONS" items={d.optimizationSuggestions} />
              {onLearn && (
                <button onClick={onLearn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-cyan/40 text-cyan text-xs hover:bg-cyan/10">
                  <BookOpen className="h-3.5 w-3.5" /> Learn from this error
                </button>
              )}
            </div>
          );
        })()}

        {status === "done" && kind === "improve" && data && (() => {
          const d = data as ImproveResult;
          return (
            <div className="space-y-4">
              <section><h4 className="font-hud text-[10px] tracking-widest text-cyan mb-1">SUMMARY</h4><p className="text-muted-foreground">{d.summary}</p></section>
              <div className="flex gap-2 text-[11px] font-mono">
                <span className="px-2 py-1 rounded-md bg-secondary">now: {d.currentComplexity}</span>
                <span className="px-2 py-1 rounded-md bg-cyan/10 text-cyan">→ {d.suggestedComplexity}</span>
              </div>
              <CodeBlock title="Improved code" code={d.improvedCode} onApply={onApply} />
              <List title="SUGGESTIONS" items={d.suggestions} />
            </div>
          );
        })()}

        {status === "done" && kind === "learn" && data && (() => {
          const d = data as LearnResult;
          return (
            <div className="space-y-4">
              <section><h4 className="font-hud text-[10px] tracking-widest text-cyan mb-1">CONCEPT</h4><p className="font-mono text-base">{d.concept}</p></section>
              <section><h4 className="font-hud text-[10px] tracking-widest text-cyan mb-1">EXPLANATION</h4><p className="text-muted-foreground">{d.explanation}</p></section>
              <List title="EXAMPLES" items={d.examples} />
              <List title="BEST PRACTICES" items={d.bestPractices} />
              <List title="COMMON MISTAKES" items={d.commonMistakes} />
            </div>
          );
        })()}
      </div>
    </div>
  );
}
