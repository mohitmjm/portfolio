import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoMM from './LogoMM';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ theme, toggleTheme, activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          backdropFilter: scrolled ? 'blur(24px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(0px)',
          background: scrolled
            ? 'var(--bg-card)'
            : 'transparent',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
        }}
      >
        {/* Brand */}
        <button
          onClick={() => scrollTo('#hero')}
          className="navbar-logo"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <LogoMM size={36} />
          <span className="navbar-logo-text">
            <span className="logo-name">Mohit M.</span>
            <span className="logo-domain">mohitmohatkar.in</span>
          </span>
        </button>

        {/* Desktop Links */}
        <ul
          style={{
            display: 'flex',
            gap: '8px',
            marginLeft: 'auto',
            marginRight: '24px',
          }}
          className="nav-desktop-links"
        >
          {navLinks.map(link => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <li key={link.label}>
                <button
                  onClick={() => scrollTo(link.href)}
                  style={{
                    background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.background = 'rgba(99,102,241,0.07)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            border: '1px solid var(--border)',
            background: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            cursor: 'none',
            transition: 'border-color 0.2s, background 0.2s',
            marginRight: '12px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--border-glow)';
            e.currentTarget.style.background = 'var(--bg-card-hover)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.background = 'var(--bg-card)';
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          className="hamburger-btn"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'none',
          }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block',
                width: 24,
                height: 2,
                background: 'var(--text-primary)',
                borderRadius: 2,
                transition: 'transform 0.3s, opacity 0.3s',
                transform: menuOpen
                  ? i === 0 ? 'translateY(7px) rotate(45deg)'
                  : i === 1 ? 'scaleX(0)'
                  : 'translateY(-7px) rotate(-45deg)'
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                zIndex: 998,
              }}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 280,
                background: 'var(--bg-secondary)',
                borderLeft: '1px solid var(--border)',
                zIndex: 999,
                padding: '88px 24px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    padding: '12px 0',
                    textAlign: 'left',
                    cursor: 'none',
                    borderBottom: '1px solid var(--border)',
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
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
