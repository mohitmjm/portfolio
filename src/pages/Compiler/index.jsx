import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiPlay, FiLoader, FiMaximize, FiMinimize, FiSun, FiMoon, FiArrowLeft,
  FiTerminal, FiZap, FiCode, FiX, FiClock, FiCpu, FiActivity,
} from 'react-icons/fi';
import CodeEditor from './CodeEditor';
import EnergyOrb from './EnergyOrb';
import AIPanel from './AIPanel';
import CommandDock from './CommandDock';
import NeuralBackground from './NeuralBackground';
import { usePythonRunner } from './usePythonRunner';
import { analyzeError, improveCode, learnFromError, aiAvailable } from './aiClient';
import { DEFAULT_CODE, TEMPLATES, formatTime, formatBytes } from './constants';
import './Compiler.css';

function parseLine(error) {
  if (!error) return null;
  const all = [...error.matchAll(/<main>", line (\d+)/g)];
  if (all.length) return Number(all[all.length - 1][1]);
  const m = error.match(/line (\d+)/);
  return m ? Number(m[1]) : null;
}

/* count-up number for the metric readouts */
function AnimatedNumber({ value, decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(0);
  useEffect(() => {
    const target = Number(value) || 0;
    const start = performance.now();
    const dur = 650;
    cancelAnimationFrame(rafRef.current);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(target * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);
  return <>{display.toFixed(decimals)}</>;
}

const SHORTCUTS = [
  ['Ctrl + Enter', 'Run code'],
  ['Ctrl + S', 'Download .py'],
  ['Ctrl + D', 'Duplicate line'],
  ['Ctrl + /', 'Toggle comment'],
  ['F11', 'Fullscreen'],
];

export default function Compiler() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [theme, setTheme] = useState('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orbState, setOrbState] = useState('ready');
  const [lastRun, setLastRun] = useState({ ok: null, time: null, memory: null });
  const [ai, setAi] = useState({ status: 'idle' });
  const [runId, setRunId] = useState(0);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { status, lines, awaitingInput, provideInput, run, clear, setLines } = usePythonRunner();

  const busyRef = useRef(false);
  const outRef = useRef(null);
  const linesRef = useRef([]);
  const lastErrorRef = useRef('');
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const rootRef = useRef(null);
  const activityRef = useRef({ running: false });
  const parallaxRaf = useRef(0);

  const ready = status === 'ready';
  const running = status === 'running';
  const hasAI = aiAvailable();

  useEffect(() => {
    const prev = document.title;
    document.title = 'AI Python Compiler · Mohit Mohatkar';
    return () => { document.title = prev; };
  }, []);

  useEffect(() => {
    linesRef.current = lines;
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [lines]);

  // reveal the AI panel when it appears
  useEffect(() => {
    if (ai.status !== 'idle' && outRef.current) {
      requestAnimationFrame(() => {
        if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
      });
    }
  }, [ai.status, ai.kind]);

  // keep the interactive input line in view
  useEffect(() => {
    if (awaitingInput && outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [awaitingInput]);

  // mouse parallax -> CSS vars on root
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const onMove = (e) => {
      if (parallaxRaf.current) return;
      parallaxRaf.current = requestAnimationFrame(() => {
        parallaxRaf.current = 0;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        if (rootRef.current) {
          rootRef.current.style.setProperty('--px', nx.toFixed(3));
          rootRef.current.style.setProperty('--py', ny.toFixed(3));
        }
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const analyze = useCallback(async (errorText, outputText, snapshot) => {
    if (!aiAvailable()) return;
    setAi({ status: 'loading', kind: 'analyze' });
    try {
      const { data, provider, model } = await analyzeError({
        code: snapshot,
        error: errorText,
        output: outputText,
        lineNumber: parseLine(errorText),
      });
      setAi({ status: 'done', kind: 'analyze', data, provider, model });
    } catch {
      setAi({
        status: 'error',
        kind: 'analyze',
        message: 'AI analysis is unavailable right now — the raw error is shown above.',
      });
    }
  }, []);

  const handleRun = useCallback(async () => {
    if (busyRef.current || status !== 'ready') return;
    busyRef.current = true;
    activityRef.current.running = true;
    setAi({ status: 'idle' });
    setLines([]);
    setOrbState('processing');
    setRunId((n) => n + 1);

    const snapshot = code;
    const result = await run(snapshot);
    const outputText = linesRef.current.map((l) => l.text).join('');

    setLines((prev) => {
      const produced = prev.some((l) => l.stream === 'stdout' || l.stream === 'stderr');
      if (!produced && result.ok) {
        return [...prev, { stream: 'system', text: '[Program finished with no output]' }];
      }
      return prev;
    });
    setLastRun(result);
    activityRef.current.running = false;

    if (!result.ok && result.error) {
      setOrbState('error');
      lastErrorRef.current = result.error;
      analyze(result.error, outputText, snapshot);
    } else if (result.ok) {
      setOrbState('success');
      setTimeout(() => setOrbState('ready'), 1600);
    } else {
      setOrbState('ready');
    }
    busyRef.current = false;
  }, [status, code, run, setLines, analyze]);

  const handleImprove = useCallback(async () => {
    if (!aiAvailable() || ai.status === 'loading') return;
    const outputText = linesRef.current.map((l) => l.text).join('');
    setAi({ status: 'loading', kind: 'improve' });
    try {
      const { data, provider, model } = await improveCode({ code, output: outputText });
      setAi({ status: 'done', kind: 'improve', data, provider, model });
    } catch {
      setAi({ status: 'error', kind: 'improve', message: 'AI code review is unavailable right now.' });
    }
  }, [code, ai.status]);

  const handleLearn = useCallback(async () => {
    if (!aiAvailable()) return;
    setAi({ status: 'loading', kind: 'learn' });
    try {
      const { data, provider, model } = await learnFromError({ code, error: lastErrorRef.current || '' });
      setAi({ status: 'done', kind: 'learn', data, provider, model });
    } catch {
      setAi({ status: 'error', kind: 'learn', message: 'AI lesson is unavailable right now.' });
    }
  }, [code]);

  const applyFix = useCallback((newCode) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) {
      setCode(newCode);
      return;
    }
    const model = editor.getModel();
    const oldLines = model.getLinesContent();
    editor.pushUndoStop();
    editor.executeEdits('ai-fix', [{ range: model.getFullModelRange(), text: newCode }]);
    editor.pushUndoStop();

    const newLines = newCode.split('\n');
    const changed = [];
    for (let i = 0; i < newLines.length; i++) {
      if (newLines[i] !== oldLines[i]) changed.push(i + 1);
    }
    if (changed.length) {
      const decos = changed.map((ln) => ({
        range: new monaco.Range(ln, 1, ln, 1),
        options: { isWholeLine: true, className: 'pyc-line-changed' },
      }));
      const ids = editor.deltaDecorations([], decos);
      setTimeout(() => {
        try { editor.deltaDecorations(ids, []); } catch { /* gone */ }
      }, 2200);
    }
    editor.focus();
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code]);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(code).catch(() => {});
  }, [code]);

  const loadTemplate = useCallback((tpl) => {
    setTemplatesOpen(false);
    if (code.trim() && code !== DEFAULT_CODE && code !== tpl.code) {
      if (!window.confirm(`Load the "${tpl.label}" template? This replaces your current code.`)) return;
    }
    setCode(tpl.code);
  }, [code]);

  const toggleFullscreen = useCallback(() => setIsFullscreen((f) => !f), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  // global shortcuts (bound once)
  const actionsRef = useRef({});
  actionsRef.current = { handleRun, handleDownload, toggleFullscreen };
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 'Enter') { e.preventDefault(); actionsRef.current.handleRun(); }
      else if (mod && (e.key === 's' || e.key === 'S')) { e.preventDefault(); actionsRef.current.handleDownload(); }
      else if (e.key === 'F11') { e.preventDefault(); actionsRef.current.toggleFullscreen(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const runLabel = running ? 'Running' : ready ? 'Run' : 'Loading';
  const canImprove = hasAI && lastRun.ok === true && ai.status !== 'loading';
  const statusText = running ? 'Running' : status === 'loading' ? 'Booting runtime' : 'Ready';

  return (
    <div className={`pyc ${theme} ${isFullscreen ? 'fullscreen' : ''}`} ref={rootRef}>
      <NeuralBackground activityRef={activityRef} theme={theme} />

      <div className="pyc-stage">
        {/* floating islands */}
        <div className="pyc-top">
          <div className="pyc-island pyc-island-left">
            <Link to="/" className="pyc-icon" title="Back to portfolio" aria-label="Back to portfolio">
              <FiArrowLeft />
            </Link>
            <span className="pyc-file">
              <span className="pyc-file-dot" />
              main.py
            </span>
          </div>

          <div className="pyc-island pyc-island-center">
            <button
              type="button"
              className={`pyc-run ${running ? 'running' : ''}`}
              onClick={handleRun}
              disabled={!ready || running}
              title="Run (Ctrl+Enter)"
            >
              {running ? <FiLoader className="pyc-spin" /> : <FiPlay />}
              {runLabel}
            </button>
          </div>

          <div className="pyc-island pyc-island-right">
            <EnergyOrb state={orbState} />
            <span className="pyc-island-div" />
            <button className="pyc-icon" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
            <button className="pyc-icon" onClick={toggleFullscreen} title="Fullscreen" aria-label="Fullscreen">
              {isFullscreen ? <FiMinimize /> : <FiMaximize />}
            </button>
          </div>
        </div>

        {/* workspace cards */}
        <div className="pyc-workspace">
          <section className="pyc-card pyc-editor-card">
            <div className="pyc-card-head">
              <span className="pyc-card-title"><FiCode /> Editor</span>
              <span className="pyc-card-sub">Python 3 · Pyodide</span>
            </div>
            <div className="pyc-editor-host">
              <CodeEditor
                value={code}
                onChange={setCode}
                theme={theme}
                fontSize={14}
                wordWrap={false}
                minimap={false}
                onRun={handleRun}
                onReady={(editor, monaco) => {
                  editorRef.current = editor;
                  monacoRef.current = monaco;
                }}
              />
            </div>
          </section>

          <section className="pyc-card pyc-output-card">
            <div className="pyc-card-head">
              <span className="pyc-card-title"><FiTerminal /> Output</span>
              <span className="pyc-card-actions">
                {canImprove && (
                  <button type="button" className="pyc-improve" onClick={handleImprove} title="AI code review">
                    <FiZap /> Improve
                  </button>
                )}
                <button type="button" className="pyc-clear" onClick={() => { clear(); setAi({ status: 'idle' }); }}>
                  Clear
                </button>
              </span>
            </div>

            <div className="pyc-out-scroll" ref={outRef}>
              <div className="pyc-out-body" role="log" aria-live="polite">
                {lines.length === 0 && !running ? (
                  <span className="pyc-placeholder">{'>'} Run your code to see the output here.</span>
                ) : (
                  lines.map((line, i) => (
                    <span key={i} className={`pyc-line ${line.stream}`}>
                      {line.text}
                    </span>
                  ))
                )}
                {running && !awaitingInput && <span className="pyc-blink" aria-hidden="true" />}
              </div>

              {awaitingInput && (
                <form
                  className="pyc-stdin-line"
                  onSubmit={(e) => { e.preventDefault(); provideInput(inputValue); setInputValue(''); }}
                >
                  <span className="pyc-stdin-caret">›</span>
                  <input
                    autoFocus
                    className="pyc-stdin-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type input, then press Enter"
                    spellCheck="false"
                    aria-label="Program input"
                  />
                </form>
              )}

              <AnimatePresence>
                {ai.status !== 'idle' && (
                  <AIPanel
                    ai={ai}
                    onApply={applyFix}
                    onLearn={handleLearn}
                    onClose={() => setAi({ status: 'idle' })}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="pyc-metrics">
              <span className="pyc-metric">
                <FiClock />
                <span className="v">{lastRun.time != null ? <AnimatedNumber value={lastRun.time * 1000} /> : '—'}</span>
                <span className="u">ms</span>
              </span>
              <span className="pyc-metric">
                <FiCpu />
                <span className="v">
                  {lastRun.memory != null ? <AnimatedNumber value={lastRun.memory / 1024} decimals={1} /> : '—'}
                </span>
                <span className="u">KB</span>
              </span>
              <span className={`pyc-metric ${lastRun.ok === true ? 'ok' : lastRun.ok === false ? 'fail' : ''}`}>
                <FiActivity />
                <span className="v">{lastRun.ok === true ? 'Success' : lastRun.ok === false ? 'Failed' : statusText}</span>
              </span>
            </div>
          </section>
        </div>

        <CommandDock
          theme={theme}
          aiOpen={ai.status !== 'idle'}
          onTemplates={() => setTemplatesOpen(true)}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onToggleAI={() => (ai.status === 'idle' ? handleImprove() : setAi({ status: 'idle' }))}
          onToggleTheme={toggleTheme}
          onShortcuts={() => setShortcutsOpen(true)}
        />
      </div>

      {/* cinematic light sweep on run */}
      {runId > 0 && <div key={runId} className="pyc-sweep" aria-hidden="true" />}

      {/* templates popover */}
      <AnimatePresence>
        {templatesOpen && (
          <motion.div
            className="pyc-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTemplatesOpen(false)}
          >
            <motion.div
              className="pyc-modal"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pyc-modal-head">
                <span>Templates</span>
                <button type="button" className="pyc-ai-close" onClick={() => setTemplatesOpen(false)}><FiX /></button>
              </div>
              <div className="pyc-tpl-grid">
                {TEMPLATES.map((tpl) => (
                  <button key={tpl.id} type="button" className="pyc-tpl" onClick={() => loadTemplate(tpl)}>
                    {tpl.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* shortcuts overlay */}
      <AnimatePresence>
        {shortcutsOpen && (
          <motion.div
            className="pyc-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShortcutsOpen(false)}
          >
            <motion.div
              className="pyc-modal"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pyc-modal-head">
                <span>Keyboard shortcuts</span>
                <button type="button" className="pyc-ai-close" onClick={() => setShortcutsOpen(false)}><FiX /></button>
              </div>
              <div className="pyc-sc-list">
                {SHORTCUTS.map(([k, v]) => (
                  <div key={k} className="pyc-sc-row">
                    <kbd>{k}</kbd>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
