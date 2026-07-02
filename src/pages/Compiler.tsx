import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Clock,
  Copy,
  Cpu,
  Download,
  HardDrive,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { SoundToggle } from "@/components/layout/SoundToggle";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { GlowButton } from "@/components/ui/GlowButton";
import { HolographicPanel } from "@/components/ui/HolographicPanel";
import AIPanel, { type AIState } from "@/features/compiler/AIPanel";
import CodeEditor from "@/features/compiler/CodeEditor";
import {
  aiAvailable,
  analyzeError,
  improveCode,
  learnFromError,
  type AnalyzeResult,
  type ImproveResult,
} from "@/features/compiler/aiClient";
import { DEFAULT_CODE, formatBytes, formatTime } from "@/features/compiler/constants";
import { usePythonRunner } from "@/features/compiler/usePythonRunner";
import { cn } from "@/lib/utils";

function parseLine(error: string | null): number | null {
  if (!error) return null;
  const all = [...error.matchAll(/<main>", line (\d+)/g)];
  if (all.length) return Number(all[all.length - 1][1]);
  const m = error.match(/line (\d+)/);
  return m ? Number(m[1]) : null;
}

const Compiler = () => {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [lastRun, setLastRun] = useState<{ ok: boolean | null; time: number | null; memory: number | null }>({
    ok: null,
    time: null,
    memory: null,
  });
  const [ai, setAi] = useState<AIState>({ status: "idle" });
  const [showAI, setShowAI] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const {
    status,
    version,
    lines,
    awaitingInput,
    inputSupported,
    run,
    provideInput,
    clear,
    reboot,
  } = usePythonRunner();

  const outRef = useRef<HTMLDivElement>(null);
  const lastErrorRef = useRef<string>("");
  const busyRef = useRef(false);

  const ready = status === "ready";
  const running = status === "running";

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [lines, awaitingInput]);

  const handleRun = useCallback(async () => {
    if (busyRef.current || !ready) return;
    busyRef.current = true;
    clear();
    lastErrorRef.current = "";
    const result = await run(code);
    busyRef.current = false;
    lastErrorRef.current = result.error || "";
    setLastRun({ ok: result.ok, time: result.time, memory: result.memory });
  }, [code, run, clear, ready]);

  const download = useCallback(() => {
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mohit_script.py";
    a.click();
    URL.revokeObjectURL(url);
  }, [code]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    toast.success("Copied");
  };

  const outputText = lines.map((l) => l.text).join("");

  const runAnalyze = useCallback(async () => {
    if (!aiAvailable()) {
      setShowAI(true);
      setAi({ status: "error", message: "No AI keys configured. Set VITE_GEMINI_API_KEY or VITE_GROQ_API_KEY." });
      return;
    }
    setShowAI(true);
    setAi({ status: "loading", kind: "analyze" });
    try {
      const { data, provider, model } = await analyzeError({
        code,
        error: lastErrorRef.current,
        output: outputText,
        lineNumber: parseLine(lastErrorRef.current),
      });
      setAi({ status: "done", kind: "analyze", data, provider, model });
    } catch (err) {
      setAi({ status: "error", kind: "analyze", message: (err as Error).message });
    }
  }, [code, outputText]);

  const runImprove = useCallback(async () => {
    if (!aiAvailable()) {
      setShowAI(true);
      setAi({ status: "error", message: "No AI keys configured. Set VITE_GEMINI_API_KEY or VITE_GROQ_API_KEY." });
      return;
    }
    setShowAI(true);
    setAi({ status: "loading", kind: "improve" });
    try {
      const { data, provider, model } = await improveCode({ code, output: outputText });
      setAi({ status: "done", kind: "improve", data, provider, model });
    } catch (err) {
      setAi({ status: "error", kind: "improve", message: (err as Error).message });
    }
  }, [code, outputText]);

  const runLearn = useCallback(async () => {
    if (!aiAvailable()) {
      setShowAI(true);
      setAi({ status: "error", message: "No AI keys configured. Set VITE_GEMINI_API_KEY or VITE_GROQ_API_KEY." });
      return;
    }
    setShowAI(true);
    setAi({ status: "loading", kind: "learn" });
    try {
      const { data, provider, model } = await learnFromError({ code, error: lastErrorRef.current });
      setAi({ status: "done", kind: "learn", data, provider, model });
    } catch (err) {
      setAi({ status: "error", kind: "learn", message: (err as Error).message });
    }
  }, [code]);

  const applyFix = useCallback((fixed: string) => {
    setCode(fixed);
    toast.success("Applied AI fix");
  }, []);

  const applyFromAi = useCallback((fixed: string) => {
    const d = ai.data as AnalyzeResult | ImproveResult | undefined;
    if (!d) return applyFix(fixed);
    if ("fixedCode" in d && d.fixedCode) applyFix(d.fixedCode);
    else if ("improvedCode" in d && d.improvedCode) applyFix(d.improvedCode);
    else applyFix(fixed);
  }, [ai, applyFix]);

  const submitInput = (e: React.FormEvent) => {
    e.preventDefault();
    provideInput(inputValue);
    setInputValue("");
  };

  const hasError = Boolean(lastErrorRef.current);
  const aiEnabled = aiAvailable();

  return (
    <>
      <Helmet>
        <title>Python Compiler - In-browser Studio | Mohit Mohatkar</title>
        <meta
          name="description"
          content="Run Python directly in your browser with Pyodide. Interactive stdin, AI error analysis, and a Monaco editor."
        />
        <link rel="canonical" href="https://mohitmohatkar.in/compiler" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border/60 py-3">
          <div className="container flex items-center justify-between gap-3">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Portfolio
            </Link>
            <div className="flex items-center gap-2 font-hud text-[10px] tracking-widest text-cyan">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  status === "ready" && "bg-emerald-400 shadow-[0_0_8px_hsl(var(--cyan))]",
                  status === "running" && "bg-amber-400 animate-pulse",
                  status === "loading" && "bg-cyan animate-pulse",
                  status === "error" && "bg-red-500",
                )}
              />
              PYTHON STUDIO {version && `- v${version}`}
            </div>
            <div className="flex items-center gap-2">
              <SoundToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 container py-4 flex flex-col gap-4">
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.85fr)] xl:items-stretch">
            <HolographicPanel className="p-0 overflow-hidden min-h-[430px] flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <div className="font-hud text-[10px] tracking-widest text-cyan">SCRIPT.PY</div>
                <div className="flex items-center gap-1">
                  <button onClick={copyCode} className="h-8 w-8 grid place-items-center rounded-md hover:bg-secondary" aria-label="Copy">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={download} className="h-8 w-8 grid place-items-center rounded-md hover:bg-secondary" aria-label="Download">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setCode("")} className="h-8 w-8 grid place-items-center rounded-md hover:bg-secondary" aria-label="Clear">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={reboot} className="h-8 w-8 grid place-items-center rounded-md hover:bg-secondary" aria-label="Reboot runtime">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="min-h-[300px] h-[46vh] xl:h-[calc(100vh-27rem)]">
                <CodeEditor value={code} onChange={setCode} onRun={handleRun} onSave={download} />
              </div>

              <div className="p-2 border-t border-border flex flex-wrap items-center gap-2">
                <GlowButton onClick={handleRun} disabled={!ready || running} className="min-w-[180px]">
                  {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                  {status === "loading" ? "BOOTING PYODIDE..." : running ? "RUNNING..." : "RUN (CTRL+ENTER)"}
                </GlowButton>
                <button
                  onClick={runAnalyze}
                  disabled={!hasError}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-hud border border-red-500/40 text-red-300 bg-red-500/5 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  title={hasError ? "Analyze last error" : "Run code that errors first"}
                >
                  <AlertTriangle className="h-3.5 w-3.5" /> ANALYZE
                </button>
                <button
                  onClick={runImprove}
                  disabled={!code.trim()}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-hud border border-violet-500/40 text-violet-300 bg-violet-500/5 hover:bg-violet-500/10 disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" /> IMPROVE
                </button>
                <button
                  onClick={runLearn}
                  disabled={!hasError}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-hud border border-cyan/40 text-cyan bg-cyan/5 hover:bg-cyan/10 disabled:opacity-40"
                >
                  <BookOpen className="h-3.5 w-3.5" /> LEARN
                </button>
              </div>

              {!aiEnabled && (
                <div className="px-3 pb-2 text-[10px] text-muted-foreground">
                  AI actions disabled: no <code>VITE_GEMINI_API_KEY</code> / <code>VITE_GROQ_API_KEY</code> configured.
                </div>
              )}
            </HolographicPanel>

            <HolographicPanel className="p-0 overflow-hidden min-h-[430px] flex flex-col">
              <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-border">
                <div className="flex flex-wrap items-center gap-3 font-hud text-[10px] tracking-widest">
                  <span className="text-signal">OUTPUT</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {formatTime(lastRun.time)} ms
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <HardDrive className="h-3 w-3" /> {formatBytes(lastRun.memory)} KB
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Cpu className="h-3 w-3" /> {status.toUpperCase()}
                  </span>
                </div>
                <button onClick={clear} className="h-8 w-8 grid place-items-center rounded-md hover:bg-secondary" aria-label="Clear output">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div ref={outRef} className="flex-1 min-h-[300px] p-3 bg-background/50 font-mono text-sm overflow-auto">
                {lines.length === 0 && !awaitingInput ? (
                  <span className="text-muted-foreground">// Output will appear here...</span>
                ) : (
                  <>
                    {lines.map((l, i) => (
                      <span
                        key={i}
                        className={cn(
                          "whitespace-pre-wrap",
                          l.stream === "stderr" && "text-red-400",
                          l.stream === "stdin" && "text-cyan/80",
                        )}
                      >
                        {l.text}
                      </span>
                    ))}
                    {awaitingInput && (
                      <form onSubmit={submitInput} className="flex items-center gap-2 mt-2">
                        <span className="text-cyan font-hud text-xs">STDIN&gt;</span>
                        <input
                          autoFocus
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="flex-1 bg-transparent border-b border-cyan/40 focus:border-cyan outline-none text-sm py-0.5"
                          placeholder={inputSupported ? "Type input and press Enter" : "SharedArrayBuffer not available in this preview"}
                          disabled={!inputSupported}
                        />
                      </form>
                    )}
                  </>
                )}
              </div>

              {!inputSupported && (
                <div className="px-3 py-1.5 border-t border-border text-[10px] text-amber-400/80">
                  Interactive input() disabled: page is not cross-origin-isolated.
                </div>
              )}
            </HolographicPanel>
          </section>

          <HolographicPanel className="p-0 overflow-hidden min-h-[150px]">
            {showAI && ai.status !== "idle" ? (
              <div className="max-h-[420px] overflow-auto">
                <AIPanel
                  ai={ai}
                  onApply={applyFromAi}
                  onLearn={runLearn}
                  onClose={() => {
                    setShowAI(false);
                    setAi({ status: "idle" });
                  }}
                />
              </div>
            ) : (
              <div className="p-4 md:p-5 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)_260px] md:items-center">
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-cyan" />
                  <div>
                    <div className="font-hud text-xs tracking-widest text-cyan">AI MENTOR</div>
                    <div className="text-xs text-muted-foreground">Analyze, improve, learn.</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Run your code. If it errors, use <strong className="text-red-300">ANALYZE</strong> for a plain-English fix,
                  <strong className="text-violet-300"> IMPROVE</strong> for a code review, or
                  <strong className="text-cyan"> LEARN</strong> to turn the mistake into a lesson.
                </p>
                <div className="text-[10px] font-mono text-muted-foreground space-y-1 md:text-right">
                  <div>Ctrl+Enter - run</div>
                  <div>Ctrl+S - download</div>
                  <div>Ctrl+D - duplicate line</div>
                </div>
              </div>
            )}
          </HolographicPanel>
        </main>
      </div>
    </>
  );
};

export default Compiler;
