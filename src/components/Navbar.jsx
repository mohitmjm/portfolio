import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoMM from './LogoMM';

const navLinks = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Education',  href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Contact',    href: '#contact' },
];

/* ── Animated Theme Toggle ───────────────────────────────────────────────── */
function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      style={{
        width: 44, height: 44,
        borderRadius: '50%',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'none',
        transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
        marginRight: '12px',
        overflow: 'hidden',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-glow)';
        e.currentTarget.style.boxShadow   = 'var(--shadow-glow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow   = 'none';
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0,   opacity: 1, rotate: 0 }}
          exit={{   y:  20,  opacity: 0, rotate:  90 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontSize: '1.1rem', lineHeight: 1 }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default function Navbar({ theme, toggleTheme, activeSection }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 1000,
          height: '72px',
          display: 'flex', alignItems: 'center',
          padding: '0 32px',
          backdropFilter:       scrolled ? 'blur(28px) saturate(1.4)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(28px) saturate(1.4)' : 'blur(0px)',
          background:    scrolled ? 'var(--bg-card)' : 'transparent',
          borderBottom:  scrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow:     scrolled ? '0 4px 32px rgba(0,0,0,0.35)' : 'none',
          transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s, box-shadow 0.4s',
        }}
      >
        {/* Brand */}
        <a
          href="https://mohitmohatkar.in"
          className="navbar-logo"
          style={{ textDecoration: 'none' }}
        >
          <LogoMM size={36} />
          <span className="navbar-logo-text">
            <span className="logo-name">Mohit Mohatkar</span>
            <span className="logo-domain">mohitmohatkar.in</span>
          </span>
        </a>

        {/* Desktop Links */}
        <ul
          style={{ display: 'flex', gap: '4px', marginLeft: 'auto', marginRight: '20px', position: 'relative' }}
          className="nav-desktop-links"
        >
          {navLinks.map(link => {
            const sectionId = link.href.replace('#', '');
            const isActive  = activeSection === sectionId;
            return (
              <li key={link.label} style={{ position: 'relative' }}>
                <button
                  onClick={() => scrollTo(link.href)}
                  style={{
                    background: 'transparent',
                    color:      isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    border:     'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'none',
                    transition: 'color 0.2s',
                    position: 'relative',
                    zIndex: 1,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {link.label}
                </button>
                {/* Sliding active pill */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(59,130,246,0.12)',
                      border: '1px solid rgba(59,130,246,0.28)',
                      borderRadius: 8,
                      boxShadow: '0 0 14px rgba(59,130,246,0.12)',
                      zIndex: 0,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <ThemeToggle theme={theme} onToggle={toggleTheme} />

        {/* Hamburger — morphing X */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          className="hamburger-btn"
          style={{
            display: 'none', flexDirection: 'column',
            gap: '5px', background: 'none',
            border: 'none', padding: '8px', cursor: 'none',
          }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                width: 22, height: 1.5,
                background: menuOpen ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderRadius: 2,
                transition: 'transform 0.32s cubic-bezier(0.23,1,0.32,1), opacity 0.25s, background 0.25s',
                transform: menuOpen
                  ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
                  : i === 1 ? 'scaleX(0)'
                  : 'translateY(-6.5px) rotate(-45deg)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(4px)',
                zIndex: 998,
              }}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 280,
                background: 'rgba(8,22,28,0.95)',
                backdropFilter: 'blur(32px)',
                borderLeft: '1px solid var(--border)',
                boxShadow: '-8px 0 48px rgba(0,0,0,0.5)',
                zIndex: 999,
                padding: '88px 24px 32px',
                display: 'flex', flexDirection: 'column', gap: '4px',
              }}
            >
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0,  opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    background: activeSection === link.href.replace('#', '')
                      ? 'rgba(59,130,246,0.1)' : 'transparent',
                    border: '1px solid',
                    borderColor: activeSection === link.href.replace('#', '')
                      ? 'rgba(59,130,246,0.25)' : 'transparent',
                    color: activeSection === link.href.replace('#', '')
                      ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    padding: '12px 14px',
                    textAlign: 'left',
                    cursor: 'none',
                    borderRadius: 10,
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
              <button
                onClick={toggleTheme}
                style={{
                  marginTop: '24px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '12px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'none',
                }}
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .hamburger-btn     { display: flex !important; }
        }
      `}</style>
    </>
  );
}
