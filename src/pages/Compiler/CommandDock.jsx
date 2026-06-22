import { motion } from 'framer-motion';
import { FiGrid, FiCopy, FiDownload, FiZap, FiSun, FiMoon, FiCommand } from 'react-icons/fi';

/*
 * CommandDock — a floating VisionOS-style dock at the bottom of the workspace.
 * Rests slightly lowered + dimmed, then lifts and brightens on hover.
 */

function DockButton({ icon, label, onClick, active }) {
  return (
    <button type="button" className={`pyc-dock-btn ${active ? 'active' : ''}`} onClick={onClick} title={label} aria-label={label}>
      {icon}
      <span className="pyc-dock-tip">{label}</span>
    </button>
  );
}

export default function CommandDock({
  theme,
  aiOpen,
  onTemplates,
  onCopy,
  onDownload,
  onToggleAI,
  onToggleTheme,
  onShortcuts,
}) {
  return (
    <motion.div
      className="pyc-dock"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pyc-dock-inner">
        <DockButton icon={<FiGrid />} label="Templates" onClick={onTemplates} />
        <DockButton icon={<FiCopy />} label="Copy code" onClick={onCopy} />
        <DockButton icon={<FiDownload />} label="Download .py" onClick={onDownload} />
        <span className="pyc-dock-sep" />
        <DockButton icon={<FiZap />} label="AI Mentor" onClick={onToggleAI} active={aiOpen} />
        <DockButton
          icon={theme === 'light' ? <FiMoon /> : <FiSun />}
          label="Toggle theme"
          onClick={onToggleTheme}
        />
        <DockButton icon={<FiCommand />} label="Shortcuts" onClick={onShortcuts} />
      </div>
    </motion.div>
  );
}
