/* ============================================================================
 * pyodide-worker.js — Python execution sandbox (Web Worker)
 * ----------------------------------------------------------------------------
 * Runs CPython (via Pyodide / WebAssembly) OFF the main thread. Because it
 * lives in a Worker, the main UI stays responsive and the host page can
 * enforce a hard timeout by terminating this worker. User code therefore never
 * executes on any server — it runs inside the visitor's own browser sandbox.
 *
 * Message protocol (main -> worker):
 *   { type: 'init' }
 *   { type: 'run', id, code, stdin }
 *
 * Message protocol (worker -> main):
 *   { type: 'ready', version }
 *   { type: 'initError', error }
 *   { type: 'stdout', id, text }
 *   { type: 'stderr', id, text }
 *   { type: 'result', id, ok, error, time, memory }
 * ========================================================================== */

/* eslint-disable no-restricted-globals */

const PYODIDE_VERSION = 'v0.27.5';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

let pyodide = null;
let readyPromise = null;

/*
 * Python harness. Defined once after the runtime boots. It:
 *  - feeds a provided stdin buffer to input() so programs never hang waiting
 *    for interactive input,
 *  - reports clean syntax-error messages,
 *  - strips the harness frame from tracebacks so users only see their own code,
 *  - measures wall-clock time (perf_counter) and peak Python heap (tracemalloc).
 * String.raw keeps backslashes (e.g. "\n") literal for Python.
 */
const HARNESS = String.raw`
import sys, io, time, builtins, traceback, tracemalloc, json

def __run_user_code(__src, __stdin_data):
    __stdin = io.StringIO(__stdin_data or "")
    __orig_input = builtins.input
    __orig_stdin = sys.stdin

    def __patched_input(prompt=""):
        if prompt:
            sys.stdout.write(str(prompt))
            sys.stdout.flush()
        line = __stdin.readline()
        if not line:
            raise EOFError("EOF when reading a line")
        return line.rstrip("\n")

    # Compile separately so syntax errors are reported cleanly (with caret).
    try:
        code_obj = compile(__src, "<main>", "exec")
    except SyntaxError:
        et, ev, _tb = sys.exc_info()
        return json.dumps({
            "error": "".join(traceback.format_exception_only(et, ev)),
            "time": 0.0,
            "memory": 0,
        })

    err = None
    builtins.input = __patched_input
    sys.stdin = __stdin
    tracemalloc.start()
    t0 = time.perf_counter()
    try:
        exec(code_obj, {"__name__": "__main__"})
    except SystemExit:
        pass
    except BaseException:
        et, ev, tb = sys.exc_info()
        # Show only user/library frames; hide internal harness frames ("<exec>").
        user_frames = [f for f in traceback.extract_tb(tb) if f.filename != "<exec>"]
        if user_frames:
            parts = ["Traceback (most recent call last):\n"]
            parts += traceback.format_list(user_frames)
            parts += traceback.format_exception_only(et, ev)
            err = "".join(parts)
        else:
            err = "".join(traceback.format_exception_only(et, ev))
    finally:
        elapsed = time.perf_counter() - t0
        _cur, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        builtins.input = __orig_input
        sys.stdin = __orig_stdin

    return json.dumps({"error": err, "time": elapsed, "memory": peak})
`;

async function init() {
  if (readyPromise) return readyPromise;
  readyPromise = (async () => {
    importScripts(INDEX_URL + 'pyodide.js');
    // eslint-disable-next-line no-undef
    pyodide = await loadPyodide({ indexURL: INDEX_URL });
    await pyodide.runPythonAsync(HARNESS);
    return pyodide;
  })();
  return readyPromise;
}

self.onmessage = async (event) => {
  const msg = event.data || {};

  if (msg.type === 'init') {
    try {
      await init();
      self.postMessage({ type: 'ready', version: pyodide.version });
    } catch (err) {
      self.postMessage({ type: 'initError', error: String((err && err.message) || err) });
    }
    return;
  }

  if (msg.type === 'run') {
    const { id, code, stdin } = msg;

    try {
      await init();
    } catch (err) {
      self.postMessage({
        type: 'result',
        id,
        ok: false,
        error: 'Failed to load the Python runtime: ' + String((err && err.message) || err),
        time: 0,
        memory: 0,
      });
      return;
    }

    // Stream stdout/stderr back to the page as the program runs.
    pyodide.setStdout({ batched: (text) => self.postMessage({ type: 'stdout', id, text }) });
    pyodide.setStderr({ batched: (text) => self.postMessage({ type: 'stderr', id, text }) });

    try {
      pyodide.globals.set('__src', code);
      pyodide.globals.set('__stdin_data', stdin || '');
      const resultJson = await pyodide.runPythonAsync('__run_user_code(__src, __stdin_data)');
      const result = JSON.parse(resultJson);
      self.postMessage({
        type: 'result',
        id,
        ok: !result.error,
        error: result.error || null,
        time: result.time,
        memory: result.memory,
      });
    } catch (err) {
      self.postMessage({
        type: 'result',
        id,
        ok: false,
        error: String((err && err.message) || err),
        time: 0,
        memory: 0,
      });
    } finally {
      try {
        pyodide.setStdout({});
        pyodide.setStderr({});
        pyodide.globals.delete('__src');
        pyodide.globals.delete('__stdin_data');
      } catch (_) {
        /* ignore cleanup errors */
      }
    }
  }
};
