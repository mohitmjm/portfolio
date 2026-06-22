import { motion } from 'framer-motion';

/*
 * EnergyOrb — ambient compiler-status indicator.
 *   ready      -> blue
 *   processing -> purple (pulsing)
 *   success    -> green
 *   error      -> red
 */

const STATES = {
  ready: { color: '#3b82f6', glow: 'rgba(59,130,246,0.6)', label: 'Ready' },
  processing: { color: '#a855f7', glow: 'rgba(168,85,247,0.7)', label: 'Processing' },
  success: { color: '#22c55e', glow: 'rgba(34,197,94,0.65)', label: 'Success' },
  error: { color: '#ef4444', glow: 'rgba(239,68,68,0.65)', label: 'Error' },
};

export default function EnergyOrb({ state = 'ready' }) {
  const s = STATES[state] || STATES.ready;
  const processing = state === 'processing';

  return (
    <div className="pyc-orb" title={`Status: ${s.label}`} aria-label={`Compiler status: ${s.label}`}>
      <motion.div
        className="pyc-orb-core"
        style={{ background: s.color, boxShadow: `0 0 24px 4px ${s.glow}` }}
        animate={
          processing
            ? { scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }
            : { scale: 1, opacity: 1 }
        }
        transition={
          processing
            ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.4 }
        }
      />
      <motion.div
        className="pyc-orb-ring"
        style={{ borderColor: s.color }}
        animate={
          processing
            ? { scale: [1, 1.6], opacity: [0.5, 0] }
            : { scale: 1.25, opacity: 0.25 }
        }
        transition={
          processing
            ? { duration: 1.4, repeat: Infinity, ease: 'easeOut' }
            : { duration: 0.4 }
        }
      />
      <span className="pyc-orb-label" style={{ color: s.color }}>
        {s.label}
      </span>
    </div>
  );
}
