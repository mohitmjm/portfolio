import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './hooks/useTheme';
import './styles/globals.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Education from './components/Education';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';

/* ── Custom Cursor ─────────────────────────────────────────────────────────── */
function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top  = e.clientY + 'px';
      }
    };

    const lerp = (a, b, t) => a + (b - a) * t;
    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px';
        ringRef.current.style.top  = ringPos.current.y + 'px';
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);

    document.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${hovering ? 'hovering' : ''}`} />
    </>
  );
}

/* ── Scroll Progress Bar ───────────────────────────────────────────────────── */
function ScrollProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setWidth(Math.min(pct, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
}

/* ── Page Load Overlay ─────────────────────────────────────────────────────── */
function PageLoadOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1300);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="page-load-overlay"
          key="overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-4%' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="page-load-logo">MM_</div>
          <div className="page-load-bar">
            <div className="page-load-bar-fill" />
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
          }}>
            INITIALIZING...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SmartHRPortal from './pages/SmartHRPortal';

// Lazy-loaded so Monaco + Pyodide only load when /compiler is visited.
const Compiler = lazy(() => import('./pages/Compiler'));

function CompilerFallback() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#09090b',
        color: '#a1a1aa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.9rem',
        letterSpacing: '0.06em',
      }}
    >
      Loading Python Studio…
    </div>
  );
}

/* ── Route Wrapper for Navbar / Active Section Logic ─────────────────────── */
function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const isCompiler = location.pathname === '/compiler';

  return (
    <>
      {!isCompiler && <PageLoadOverlay />}
      {!isCompiler && <ScrollProgressBar />}
      {!isCompiler && <CustomCursor />}

      {/* Only show the main Navbar on the Home page, or we could pass location down */}
      {location.pathname === '/' && (
        <Navbar theme={theme} toggleTheme={toggleTheme} activeSection={activeSection} />
      )}

      <Routes>
        <Route path="/" element={<Home setActiveSection={setActiveSection} />} />
        <Route path="/smart-hr-portal" element={<SmartHRPortal theme={theme} toggleTheme={toggleTheme} />} />
        <Route
          path="/compiler"
          element={
            <Suspense fallback={<CompilerFallback />}>
              <Compiler />
            </Suspense>
          }
        />
      </Routes>

      {location.pathname !== '/smart-hr-portal' && !isCompiler && <Footer />}
      {!isCompiler && <ChatBot />}
    </>
  );
}

/* ── App ───────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
