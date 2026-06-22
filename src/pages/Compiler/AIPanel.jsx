import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiZap, FiX, FiCheck, FiCpu, FiBookOpen, FiAlertTriangle, FiInfo, FiAlertOctagon,
} from 'react-icons/fi';

/* progressive text reveal (typewriter) */
function Typewriter({ text }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    if (!text) return undefined;
    const step = Math.max(1, Math.round(text.length / 150));
    const id = setInterval(() => {
      setCount((c) => {
        const next = c + step;
        if (next >= text.length) clearInterval(id);
        return next;
      });
    }, 14);
    return () => clearInterval(id);
  }, [text]);
  const done = count >= (text?.length || 0);
  return (
    <span>
      {text ? text.slice(0, count) : ''}
      {!done && <span className="pyc-tw-caret" />}
    </span>
  );
}

const SEVERITY = {
  critical: { cls: 'critical', icon: <FiAlertOctagon />, label: 'Critical' },
  warning: { cls: 'warning', icon: <FiAlertTriangle />, label: 'Warning' },
  suggestion: { cls: 'suggestion', icon: <FiInfo />, label: 'Suggestion' },
};

function ProviderBadge({ provider, model }) {
  if (!provider) return null;
  const gemini = provider === 'gemini';
  return (
    <span className={`pyc-prov ${provider}`} title={model}>
      {gemini ? '✨' : '⚡'} {gemini ? 'Gemini' : 'Groq'}
    </span>
  );
}

function CodeBlock({ title, code, onApply }) {
  const [applied, setApplied] = useState(false);
  if (!code) return null;
  return (
    <div className="pyc-codeblock">
      <div className="pyc-codeblock-head">
        <span>{title}</span>
        {onApply && (
          <button
            type="button"
            className={`pyc-apply ${applied ? 'done' : ''}`}
            onClick={() => {
              onApply(code);
              setApplied(true);
              setTimeout(() => setApplied(false), 2000);
            }}
          >
            {applied ? <FiCheck /> : <FiZap />}
            {applied ? 'Applied' : 'Apply Fix'}
          </button>
        )}
      </div>
      <pre className="pyc-code">{code}</pre>
    </div>
  );
}

function List({ title, items }) {
  if (!items || !items.length) return null;
  return (
    <div className="pyc-ai-section">
      <h4>{title}</h4>
      <ul className="pyc-ai-list">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AIPanel({ ai, onApply, onLearn, onClose }) {
  const bodyRef = useRef(null);
  const { status, kind, data, provider, model, message } = ai;

  const loadingLabel =
    kind === 'improve' ? 'Reviewing your code' : kind === 'learn' ? 'Preparing a lesson' : 'Analyzing the error';

  return (
    <motion.div
      className="pyc-ai"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pyc-ai-head">
        <span className="pyc-ai-title">
          <span className={`pyc-ai-glyph ${status === 'loading' ? 'busy' : ''}`}>
            <FiZap />
          </span>
          AI Mentor
        </span>
        <span className="pyc-ai-head-right">
          {status === 'done' && <ProviderBadge provider={provider} model={model} />}
          <button type="button" className="pyc-ai-close" onClick={onClose} aria-label="Dismiss AI panel">
            <FiX />
          </button>
        </span>
      </div>

      <div className="pyc-ai-body" ref={bodyRef}>
        {status === 'loading' && (
          <div className="pyc-ai-loading">
            <span className="pyc-ai-orb" />
            <div className="pyc-ai-loading-text">
              <span>{loadingLabel}…</span>
              <span className="pyc-shimmer" />
              <span className="pyc-shimmer short" />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="pyc-ai-error">
            {message || 'AI assistance is unavailable right now. Please try again.'}
          </div>
        )}

        {status === 'done' && kind === 'analyze' && data && (
          <div className="pyc-fade-in">
            <div className="pyc-ai-toprow">
              <span className="pyc-errtype">{data.errorType || 'Error'}</span>
              {SEVERITY[data.severity] && (
                <span className={`pyc-sev ${SEVERITY[data.severity].cls}`}>
                  {SEVERITY[data.severity].icon}
                  {SEVERITY[data.severity].label}
                </span>
              )}
              {data.line != null && <span className="pyc-line-tag">Line {data.line}</span>}
            </div>

            <div className="pyc-ai-section">
              <h4>What happened</h4>
              <p><Typewriter text={data.explanation || ''} /></p>
            </div>

            {data.rootCause && (
              <div className="pyc-ai-section">
                <h4>Root cause</h4>
                <p>{data.rootCause}</p>
              </div>
            )}

            {data.prevention && (
              <div className="pyc-ai-section">
                <h4>How to prevent it</h4>
                <p>{data.prevention}</p>
              </div>
            )}

            <CodeBlock title="Suggested fix" code={data.fixedCode} onApply={onApply} />

            <List title="Optimization suggestions" items={data.optimizationSuggestions} />

            <button type="button" className="pyc-ai-action" onClick={onLearn}>
              <FiBookOpen />
              Learn from this error
            </button>
          </div>
        )}

        {status === 'done' && kind === 'improve' && data && (
          <div className="pyc-fade-in">
            <div className="pyc-ai-toprow">
              <span className="pyc-errtype">
                <FiCpu style={{ marginRight: 6, verticalAlign: '-2px' }} />
                Code Review
              </span>
              {data.currentComplexity && (
                <span className="pyc-complexity">
                  {data.currentComplexity} <span className="arrow">→</span> {data.suggestedComplexity || 'same'}
                </span>
              )}
            </div>

            {data.summary && (
              <div className="pyc-ai-section">
                <h4>Summary</h4>
                <p><Typewriter text={data.summary} /></p>
              </div>
            )}

            <CodeBlock title="Improved code" code={data.improvedCode} onApply={onApply} />
            <List title="Suggestions" items={data.suggestions} />
          </div>
        )}

        {status === 'done' && kind === 'learn' && data && (
          <div className="pyc-fade-in">
            <div className="pyc-ai-toprow">
              <span className="pyc-errtype">
                <FiBookOpen style={{ marginRight: 6, verticalAlign: '-2px' }} />
                {data.concept || 'Concept'}
              </span>
            </div>
            {data.explanation && (
              <div className="pyc-ai-section">
                <p><Typewriter text={data.explanation} /></p>
              </div>
            )}
            <List title="Examples" items={data.examples} />
            <List title="Best practices" items={data.bestPractices} />
            <List title="Common mistakes" items={data.commonMistakes} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
