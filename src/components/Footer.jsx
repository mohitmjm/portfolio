import { motion } from 'framer-motion';

export default function Footer() {
  const year = new Date().getFullYear();

  const socials = [
    { label: 'GitHub', href: 'https://github.com/mohitmohatkar', icon: '🐙' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mohit-mohatkar', icon: '🔗' },
    { label: 'Instagram', href: 'https://www.instagram.com/mohitmohatkar/', icon: '📸' },
    { label: 'Email', href: 'mailto:mohitjmohatkar@gmail.com', icon: '📧' },
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
            B.Tech CSE (AI & ML) · Full Stack Developer · Always building something new.
          </p>

          {/* Socials */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-glow)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
              >
                {s.icon} {s.label}
              </a>
            ))}
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
