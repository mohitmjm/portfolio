import { useState, useEffect, useRef, useCallback } from 'react';
import { RUN_TIMEOUT_MS } from './constants';

const DATA_CAPACITY = 64 * 1024; // shared input buffer size

/*
 * usePythonRunner — owns the Pyodide worker lifecycle and execution state.
 *
 * Interactive stdin: when the worker reports it needs input, `awaitingInput`
 * becomes true; the UI collects a line and calls provideInput(text), which
 * writes it into the SharedArrayBuffer and wakes the worker.
 *
 * Returns:
 *   status        : 'loading' | 'ready' | 'running' | 'error'
 *   version, lines
 *   awaitingInput : true while a running program is blocked on input()
 *   inputSupported: whether SharedArrayBuffer interactive input is available
 *   run(code) -> Promise<{ ok, time, memory, timedOut, error }>
 *   provideInput(text), clear(), reboot(), setLines
 */
export function usePythonRunner() {
  const [status, setStatus] = useState('loading');
  const [version, setVersion] = useState('');
  const [lines, setLines] = useState([]);
  const [awaitingInput, setAwaitingInput] = useState(false);

  const workerRef = useRef(null);
  const runIdRef = useRef(0);
  const pendingRef = useRef(null); // { id, resolve, timer }
  const controlRef = useRef(null);
  const dataRef = useRef(null);

  const inputSupported =
    typeof SharedArrayBuffer !== 'undefined' && typeof globalThis !== 'undefined' && !!globalThis.crossOriginIsolated;

  const append = useCallback((entry) => {
    setLines((prev) => [...prev, entry]);
  }, []);

  const spawn = useCallback(() => {
    if (typeof window === 'undefined') return;

    let sab = null;
    if (inputSupported) {
      sab = new SharedArrayBuffer(8 + DATA_CAPACITY);
      controlRef.current = new Int32Array(sab, 0, 2);
      dataRef.current = new Uint8Array(sab, 8);
    } else {
      controlRef.current = null;
      dataRef.current = null;
    }

    const worker = new Worker('/pyodide-worker.js');

    worker.onmessage = (event) => {
      const msg = event.data || {};
      const pending = pendingRef.current;

      switch (msg.type) {
        case 'ready':
          setVersion(msg.version || '');
          setStatus((s) => (s === 'running' ? s : 'ready'));
          break;

        case 'initError':
          setStatus('error');
          append({ stream: 'stderr', text: 'Runtime failed to load: ' + msg.error });
          break;

        case 'stdout':
          if (pending && msg.id === pending.id) append({ stream: 'stdout', text: msg.text });
          break;

        case 'stderr':
          if (pending && msg.id === pending.id) append({ stream: 'stderr', text: msg.text });
          break;

        case 'needInput':
          // Pause the run timeout while we wait for the user to type.
          if (pending && pending.timer) {
            clearTimeout(pending.timer);
            pending.timer = null;
          }
          setAwaitingInput(true);
          break;

        case 'result': {
          if (pending && msg.id === pending.id) {
            if (pending.timer) clearTimeout(pending.timer);
            pendingRef.current = null;
            setAwaitingInput(false);
            if (msg.error) append({ stream: 'stderr', text: msg.error });
            setStatus('ready');
            pending.resolve({
              ok: msg.ok,
              time: msg.time,
              memory: msg.memory,
              timedOut: false,
              error: msg.error || null,
            });
          }
          break;
        }

        default:
          break;
      }
    };

    worker.onerror = (err) => {
      setStatus('error');
      append({ stream: 'stderr', text: 'Worker error: ' + (err.message || 'unknown error') });
    };

    worker.postMessage({ type: 'init', sab });
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
        stream: 'stderr',
        text: `\n[Execution exceeded ${RUN_TIMEOUT_MS / 1000}s and was terminated. Check for infinite loops.]`,
      });
      setStatus('loading');
      setVersion('');
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
    (code) =>
      new Promise((resolve) => {
        if (!workerRef.current) {
          resolve({ ok: false, time: 0, memory: null, timedOut: false, error: null });
          return;
        }
        const id = ++runIdRef.current;
        setStatus('running');
        setAwaitingInput(false);
        pendingRef.current = { id, resolve, timer: null };
        armTimeout();
        workerRef.current.postMessage({ type: 'run', id, code });
      }),
    [armTimeout],
  );

  const provideInput = useCallback(
    (text) => {
      const control = controlRef.current;
      const data = dataRef.current;
      if (!control || !data) return;
      const bytes = new TextEncoder().encode((text ?? '') + '\n');
      const len = Math.min(bytes.length, data.length);
      data.set(bytes.subarray(0, len));
      Atomics.store(control, 1, len);
      Atomics.store(control, 0, 1);
      Atomics.notify(control, 0, 1);
      setAwaitingInput(false);
      append({ stream: 'stdin', text: (text ?? '') + '\n' });
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
    setStatus('loading');
    setVersion('');
    spawn();
  }, [spawn]);

  return { status, version, lines, awaitingInput, inputSupported, run, provideInput, clear, reboot, setLines };
}
