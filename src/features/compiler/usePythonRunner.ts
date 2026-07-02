/* ============================================================================
 * usePythonRunner.ts — ported 1:1 from mohitmjm/portfolio.
 *
 * Owns the Pyodide worker lifecycle and execution state. Interactive stdin
 * via SharedArrayBuffer + Atomics; 15s hard timeout; reboot on timeout.
 * ========================================================================== */

import { useCallback, useEffect, useRef, useState } from "react";
import { RUN_TIMEOUT_MS } from "./constants";

const DATA_CAPACITY = 64 * 1024;

export type RunStatus = "loading" | "ready" | "running" | "error";

export interface OutputLine {
  stream: "stdout" | "stderr" | "stdin";
  text: string;
}

export interface RunResult {
  ok: boolean;
  time: number;
  memory: number | null;
  timedOut: boolean;
  error: string | null;
}

interface Pending {
  id: number;
  resolve: (v: RunResult) => void;
  timer: ReturnType<typeof setTimeout> | null;
}

export function usePythonRunner() {
  const [status, setStatus] = useState<RunStatus>("loading");
  const [version, setVersion] = useState("");
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [awaitingInput, setAwaitingInput] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const runIdRef = useRef(0);
  const pendingRef = useRef<Pending | null>(null);
  const controlRef = useRef<Int32Array | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);

  const inputSupported =
    typeof SharedArrayBuffer !== "undefined" &&
    typeof globalThis !== "undefined" &&
    !!(globalThis as unknown as { crossOriginIsolated?: boolean }).crossOriginIsolated;

  const append = useCallback((entry: OutputLine) => {
    setLines((prev) => [...prev, entry]);
  }, []);

  const spawn = useCallback(() => {
    if (typeof window === "undefined") return;

    let sab: SharedArrayBuffer | null = null;
    if (inputSupported) {
      sab = new SharedArrayBuffer(8 + DATA_CAPACITY);
      controlRef.current = new Int32Array(sab, 0, 2);
      dataRef.current = new Uint8Array(sab, 8);
    } else {
      controlRef.current = null;
      dataRef.current = null;
    }

    const worker = new Worker("/pyodide-worker.js");

    worker.onmessage = (event: MessageEvent) => {
      const msg = (event.data || {}) as Record<string, unknown>;
      const pending = pendingRef.current;

      switch (msg.type) {
        case "ready":
          setVersion((msg.version as string) || "");
          setStatus((s) => (s === "running" ? s : "ready"));
          break;

        case "initError":
          setStatus("error");
          append({ stream: "stderr", text: "Runtime failed to load: " + String(msg.error) });
          break;

        case "stdout":
          if (pending && msg.id === pending.id) append({ stream: "stdout", text: String(msg.text) });
          break;

        case "stderr":
          if (pending && msg.id === pending.id) append({ stream: "stderr", text: String(msg.text) });
          break;

        case "needInput":
          if (pending && pending.timer) {
            clearTimeout(pending.timer);
            pending.timer = null;
          }
          setAwaitingInput(true);
          break;

        case "result": {
          if (pending && msg.id === pending.id) {
            if (pending.timer) clearTimeout(pending.timer);
            pendingRef.current = null;
            setAwaitingInput(false);
            if (msg.error) append({ stream: "stderr", text: String(msg.error) });
            setStatus("ready");
            pending.resolve({
              ok: Boolean(msg.ok),
              time: Number(msg.time),
              memory: (msg.memory as number | null) ?? null,
              timedOut: false,
              error: (msg.error as string | null) || null,
            });
          }
          break;
        }

        default:
          break;
      }
    };

    worker.onerror = (err) => {
      setStatus("error");
      append({ stream: "stderr", text: "Worker error: " + (err.message || "unknown error") });
    };

    worker.postMessage({ type: "init", sab });
    workerRef.current = worker;
  }, [append, inputSupported]);

  useEffect(() => {
    spawn();
    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, [spawn]);

  const armTimeout = useCallback(() => {
    if (!pendingRef.current) return;
    pendingRef.current.timer = setTimeout(() => {
      if (workerRef.current) workerRef.current.terminate();
      const p = pendingRef.current;
      pendingRef.current = null;
      setAwaitingInput(false);
      append({
        stream: "stderr",
        text: `\n[Execution exceeded ${RUN_TIMEOUT_MS / 1000}s and was terminated. Check for infinite loops.]`,
      });
      setStatus("loading");
      setVersion("");
      spawn();
      if (p) {
        p.resolve({
          ok: false,
          time: RUN_TIMEOUT_MS / 1000,
          memory: null,
          timedOut: true,
          error: `TimeoutError: execution exceeded ${RUN_TIMEOUT_MS / 1000}s and was terminated.`,
        });
      }
    }, RUN_TIMEOUT_MS);
  }, [append, spawn]);

  const run = useCallback(
    (code: string) =>
      new Promise<RunResult>((resolve) => {
        if (!workerRef.current) {
          resolve({ ok: false, time: 0, memory: null, timedOut: false, error: null });
          return;
        }
        const id = ++runIdRef.current;
        setStatus("running");
        setAwaitingInput(false);
        pendingRef.current = { id, resolve, timer: null };
        armTimeout();
        workerRef.current.postMessage({ type: "run", id, code });
      }),
    [armTimeout],
  );

  const provideInput = useCallback(
    (text: string) => {
      const control = controlRef.current;
      const data = dataRef.current;
      if (!control || !data) return;
      const bytes = new TextEncoder().encode((text ?? "") + "\n");
      const len = Math.min(bytes.length, data.length);
      data.set(bytes.subarray(0, len));
      Atomics.store(control, 1, len);
      Atomics.store(control, 0, 1);
      Atomics.notify(control, 0, 1);
      setAwaitingInput(false);
      append({ stream: "stdin", text: (text ?? "") + "\n" });
      if (pendingRef.current && !pendingRef.current.timer) armTimeout();
    },
    [append, armTimeout],
  );

  const clear = useCallback(() => setLines([]), []);

  const reboot = useCallback(() => {
    if (workerRef.current) workerRef.current.terminate();
    if (pendingRef.current) {
      if (pendingRef.current.timer) clearTimeout(pendingRef.current.timer);
      pendingRef.current = null;
    }
    setAwaitingInput(false);
    setStatus("loading");
    setVersion("");
    spawn();
  }, [spawn]);

  return {
    status,
    version,
    lines,
    awaitingInput,
    inputSupported,
    run,
    provideInput,
    clear,
    reboot,
    setLines,
  };
}
