import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram, FiMail } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();
  const [views, setViews] = useState(null);

  useEffect(() => {
    // Only increment views once per session to prevent spamming
    const hasVisited = sessionStorage.getItem('portfolio-visited');
    const url = hasVisited 
      ? 'https://api.counterapi.dev/v1/mohitmohatkar/portfolio'
      : 'https://api.counterapi.dev/v1/mohitmohatkar/portfolio/up';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.value === 'number') {
          setViews(data.value);
          sessionStorage.setItem('portfolio-visited', 'true');
        }
      })
      .catch(err => console.error('Error fetching page views:', err));
  }, []);

  const socials = [
    { label: 'GitHub',    href: 'https://github.com/mohitmjm',                icon: FiGithub },
    { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/mohit-mohatkar', icon: FiLinkedin },
    { label: 'Instagram', href: 'https://www.instagram.com/mohitmohatkar/',   icon: FiInstagram },
    { label: 'Email',     href: 'mailto:mohitjmohatkar@gmail.com',            icon: FiMail },
  ];

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      padding: '3rem 0 2rem',
    }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            textAlign: 'center',
          }}
        >
          {/* Brand */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.4rem',
            background: 'var(--gradient-text)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Mohit Mohatkar
          </div>

          {/* Tagline */}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            B.Tech CSE (AI &amp; ML) · Full Stack Developer · Always building something new.
          </p>

          {/* Socials */}
          <div className="footer-socials" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                title={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-glow)';
                  e.currentTarget.style.color       = 'var(--text-primary)';
                  e.currentTarget.style.background  = 'rgba(59,130,246,0.08)';
                  e.currentTarget.style.boxShadow   = '0 0 12px rgba(59,130,246,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color       = 'var(--text-secondary)';
                  e.currentTarget.style.background  = 'var(--bg-card)';
                  e.currentTarget.style.boxShadow   = 'none';
                }}
              >
                <s.icon size={15} /> {s.label}
              </a>
            ))}
          </div>

          {/* Views Counter */}
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(59, 130, 246, 0.05)',
            padding: '4px 12px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            marginTop: '0.25rem',
          }}>
            <span style={{ 
              display: 'inline-block', 
              width: '6px', 
              height: '6px', 
              background: views !== null ? 'var(--accent-cyan)' : 'var(--text-muted)', 
              borderRadius: '50%',
              boxShadow: views !== null ? '0 0 8px var(--accent-cyan)' : 'none',
              transition: 'background 0.3s ease'
            }} />
            <span>VIEWS: {views !== null ? views.toLocaleString() : '...'}</span>
          </div>

          {/* Divider */}
          <div style={{
            width: '100%',
            height: 1,
            background: 'var(--border)',
            maxWidth: 400,
          }} />

          {/* Copyright */}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            © {year} Mohit Mohatkar · Built with React 18 + Framer Motion ·{' '}
            <a
              href="https://mohitmohatkar.in"
              style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}
            >
              mohitmohatkar.in
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
