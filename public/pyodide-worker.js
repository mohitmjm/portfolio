/* ============================================================================
 * pyodide-worker.js — Python execution sandbox (Web Worker)
 * ----------------------------------------------------------------------------
 * Runs CPython (Pyodide / WebAssembly) off the main thread.
 *
 * Interactive stdin: instead of Pyodide's emulated OS stdin device (which
 * raises [Errno 29] on read in a worker), we override Python's builtins.input
 * to call a JS function (__js_input) that BLOCKS on a SharedArrayBuffer via
 * Atomics.wait until the main thread supplies a line. Requires the page to be
 * cross-origin isolated (COOP/COEP). Without a shared buffer, input() -> EOF.
 *
 * Shared buffer layout: Int32 control [flag, length] at byte 0..8, then a
 * Uint8 data region from byte 8.
 * ========================================================================== */

/* eslint-disable no-restricted-globals */

const PYODIDE_VERSION = 'v0.27.5';
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

let pyodide = null;
let readyPromise = null;

let control = null; // Int32Array [flag, length]
let data = null; // Uint8Array data region
const decoder = new TextDecoder();

// Called synchronously from Python (as __js_input). Blocks the worker until the
// main thread writes a line into the shared buffer. Returns the line, or null = EOF.
function jsInput() {
  if (!control) return null;
  Atomics.store(control, 0, 0);
  self.postMessage({ type: 'needInput' });
  Atomics.wait(control, 0, 0);
  const len = Atomics.load(control, 1);
  if (len < 0) return null;
  // TextDecoder rejects SharedArrayBuffer-backed views, so copy to a plain array first.
  const bytes = new Uint8Array(len);
  bytes.set(data.subarray(0, len));
  return decoder.decode(bytes);
}

const HARNESS = String.raw`
import sys, time, traceback, tracemalloc, json, builtins

def __patched_input(prompt=""):
    if prompt:
        sys.stdout.write(str(prompt))
        sys.stdout.flush()
    line = __js_input()
    if line is None:
        raise EOFError("EOF when reading a line")
    return line.rstrip("\n")

builtins.input = __patched_input

def __run_user_code(__src):
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
    tracemalloc.start()
    t0 = time.perf_counter()
    try:
        exec(code_obj, {"__name__": "__main__"})
    except SystemExit:
        pass
    except BaseException:
        et, ev, tb = sys.exc_info()
        frames = [f for f in traceback.extract_tb(tb) if f.filename != "<exec>"]
        if frames:
            parts = ["Traceback (most recent call last):\n"]
            parts += traceback.format_list(frames)
            parts += traceback.format_exception_only(et, ev)
            err = "".join(parts)
        else:
            err = "".join(traceback.format_exception_only(et, ev))
    finally:
        elapsed = time.perf_counter() - t0
        _cur, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

    return json.dumps({"error": err, "time": elapsed, "memory": peak})
`;

async function init() {
  if (readyPromise) return readyPromise;
  readyPromise = (async () => {
    importScripts(INDEX_URL + 'pyodide.js');
    // eslint-disable-next-line no-undef
    pyodide = await loadPyodide({ indexURL: INDEX_URL });
    await pyodide.runPythonAsync(HARNESS);
    pyodide.globals.set('__js_input', jsInput); // expose blocking input to Python
    return pyodide;
  })();
  return readyPromise;
}

self.onmessage = async (event) => {
  const msg = event.data || {};

  if (msg.type === 'init') {
    if (msg.sab) {
      control = new Int32Array(msg.sab, 0, 2);
      data = new Uint8Array(msg.sab, 8);
    }
    try {
      await init();
      self.postMessage({ type: 'ready', version: pyodide.version });
    } catch (err) {
      self.postMessage({ type: 'initError', error: String((err && err.message) || err) });
    }
    return;
  }

  if (msg.type === 'run') {
    const { id, code } = msg;

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

    const outDecoder = new TextDecoder('utf-8', { fatal: false });
    const errDecoder = new TextDecoder('utf-8', { fatal: false });
    // Unbuffered writes so input() prompts (no trailing newline) show immediately.
    pyodide.setStdout({
      write: (buf) => {
        self.postMessage({ type: 'stdout', id, text: outDecoder.decode(buf, { stream: true }) });
        return buf.length;
      },
    });
    pyodide.setStderr({
      write: (buf) => {
        self.postMessage({ type: 'stderr', id, text: errDecoder.decode(buf, { stream: true }) });
        return buf.length;
      },
    });

    try {
      pyodide.globals.set('__src', code);
      // Synchronous run so the blocking input (Atomics.wait) works cleanly.
      const resultJson = pyodide.runPython('__run_user_code(__src)');
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
      } catch (_) {
        /* ignore cleanup errors */
      }
    }
  }
};
