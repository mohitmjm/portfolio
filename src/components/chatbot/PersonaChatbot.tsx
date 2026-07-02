import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { askPersona, QUICK_REPLIES, type ChatMsg } from "@/lib/chatbot-providers";

function renderWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const m = part.match(/([!.,?)]+)$/);
      const url = m ? part.slice(0, -m[0].length) : part;
      const suffix = m ? m[0] : "";
      return (
        <span key={i}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan underline font-semibold">
            {url}
          </a>
          {suffix}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function PersonaChatbot() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hi — I'm Mohit's AI persona. Ask about his projects, focus areas, or how to work with him." },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next: ChatMsg[] = [...msgs, { role: "user", content: text.trim() }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const reply = await askPersona(next);
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        aria-label="Open Mohit's AI persona"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-gradient-text text-primary-foreground shadow-glow grid place-items-center hover:scale-110 transition-transform"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm hud-panel-strong overflow-hidden flex flex-col"
            style={{ maxHeight: "min(70vh, 640px)" }}
          >
            <div className="p-4 border-b border-border flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan" />
              <div>
                <div className="font-hud text-xs tracking-widest">MOHIT.AI PERSONA</div>
                <div className="text-[10px] font-mono text-muted-foreground">Ask about work, projects, hiring</div>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] text-sm rounded-2xl px-3 py-2 leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-text text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {m.role === "assistant" ? renderWithLinks(m.content) : m.content}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl px-3 py-2 text-sm font-mono">
                    <span className="animate-pulse">▊</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={busy}
                  className="text-[10px] font-hud tracking-wider px-2 py-1 rounded-full bg-secondary hover:bg-cyan/20 hover:text-cyan transition-colors"
                >
                  {q.toUpperCase()}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-border flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-10 px-3 rounded-lg bg-background/60 border border-border focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan text-sm"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-text text-primary-foreground disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
