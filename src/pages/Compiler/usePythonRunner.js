import { useState, useEffect, useRef, useCallback } from 'react';
import { RUN_TIMEOUT_MS } from './constants';

/*
 * usePythonRunner — owns the Pyodide worker lifecycle and execution state.
 *
 * Returns:
 *   status   : 'loading' | 'ready' | 'running' | 'error'
 *   version  : Python version string once the runtime is ready
 *   lines    : [{ stream: 'stdout'|'stderr'|'system', text }]  (current run)
 *   run(code, stdin) -> Promise<{ ok, time, memory, timedOut }>
 *   clear()  : empties the console
 *   reboot() : tears down and respawns the worker
 */
export function usePythonRunner() {
  const [status, setStatus] = useState('loading');
  const [version, setVersion] = useState('');
  const [lines, setLines] = useState([]);

  const workerRef = useRef(null);
  const runIdRef = useRef(0);
  const pendingRef = useRef(null); // { id, resolve, timer }

  const append = useCallback((entry) => {
    setLines((prev) => [...prev, entry]);
  }, []);

  const spawn = useCallback(() => {
    if (typeof window === 'undefined') return;

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

        case 'result': {
          if (pending && msg.id === pending.id) {
            clearTimeout(pending.timer);
            pendingRef.current = null;
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

    worker.postMessage({ type: 'init' });
    workerRef.current = worker;
  }, [append]);

  useEffect(() => {
    spawn();
    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
  }, [spawn]);

  const run = useCallback(
    (code, stdin) =>
      new Promise((resolve) => {
        if (!workerRef.current) {
          resolve({ ok: false, time: 0, memory: null, timedOut: false, error: null });
          return;
        }

        const id = ++runIdRef.current;
        setStatus('running');

        const timer = setTimeout(() => {
          // Hard kill: terminate the worker, surface a timeout, and respawn.
          if (workerRef.current) workerRef.current.terminate();
          pendingRef.current = null;
          append({
            stream: 'stderr',
            text: `\n[Execution exceeded ${RUN_TIMEOUT_MS / 1000}s and was terminated. ` +
              `Check for infinite loops or very heavy work.]`,
          });
          setStatus('loading');
          setVersion('');
          spawn();
          resolve({
            ok: false,
            time: RUN_TIMEOUT_MS / 1000,
            memory: null,
            timedOut: true,
            error: `TimeoutError: execution exceeded ${RUN_TIMEOUT_MS / 1000}s and was terminated.`,
          });
        }, RUN_TIMEOUT_MS);

        pendingRef.current = { id, resolve, timer };
        workerRef.current.postMessage({ type: 'run', id, code, stdin });
      }),
    [append, spawn],
  );

  const clear = useCallback(() => setLines([]), []);

  const reboot = useCallback(() => {
    if (workerRef.current) workerRef.current.terminate();
    if (pendingRef.current) {
      clearTimeout(pendingRef.current.timer);
      pendingRef.current = null;
    }
    setStatus('loading');
    setVersion('');
    spawn();
  }, [spawn]);

  return { status, version, lines, run, clear, reboot, setLines };
}
