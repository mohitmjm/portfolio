import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram, FiMail } from 'react-icons/fi';

// ── Particle Canvas (mouse-reactive) ─────────────────────────────────────────
function ParticleCanvas({ mouseRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const N = window.innerWidth < 768 ? 55 : 110;
    for (let i = 0; i < N; i++) {
      particles.push({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.4 + 0.3,
        dx:    (Math.random() - 0.5) * 0.28,
        dy:    (Math.random() - 0.5) * 0.28,
        alpha: Math.random() * 0.55 + 0.15,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef?.current?.x ?? -9999;
      const my = mouseRef?.current?.y ?? -9999;

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,130,246,${0.10 * (1 - dist / 110)})`;
            ctx.lineWidth   = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles + mouse repel
      particles.forEach(p => {
        const pdx   = p.x - mx;
        const pdy   = p.y - my;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pdist < 100) {
          const force   = (100 - pdist) / 100;
          p.x += (pdx / pdist) * force * 1.5;
          p.y += (pdy / pdist) * force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129,140,248,${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

// ── Magnetic Button ───────────────────────────────────────────────────────────
function MagneticButton({ children, primary, href, onClick, download }) {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      const s = (80 - dist) / 80;
      btn.style.transform = `translate(${dx * s * 0.35}px, ${dy * s * 0.35}px)`;
    }
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (btn) {
      btn.style.transform  = 'translate(0,0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      setTimeout(() => { if (btn) btn.style.transition = ''; }, 500);
    }
  };

  const Tag  = href ? 'a' : 'button';
  const props = href
    ? { href, target: download ? '_self' : '_blank', rel: 'noopener noreferrer', download }
    : { onClick };

  return (
    <Tag
      ref={btnRef}
      {...props}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={primary ? 'btn-primary' : 'btn-outline'}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
    >
      {children}
    </Tag>
  );
}

// ── Typewriter ────────────────────────────────────────────────────────────────
const roles = [
  'B.Tech CSE (AI & ML)',
  'Full Stack Developer',
  'ML Enthusiast',
  'Problem Solver',
];

function Typewriter() {
  const [display, setDisplay]   = useState('');
  const [roleIdx, setRoleIdx]   = useState(0);
  const [phase,   setPhase]     = useState('typing');

  useEffect(() => {
    const role = roles[roleIdx];
    let timeout;
    if (phase === 'typing') {
      if (display.length < role.length) {
        timeout = setTimeout(() => setDisplay(role.slice(0, display.length + 1)), 68);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), 1900);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 380);
    } else {
      if (display.length > 0) {
        timeout = setTimeout(() => setDisplay(prev => prev.slice(0, -1)), 38);
      } else {
        setRoleIdx(i => (i + 1) % roles.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(timeout);
  }, [display, phase, roleIdx]);

  return (
    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
      {display}
      <span style={{
        display: 'inline-block',
        width: 2, height: '1em',
        background: 'var(--accent-primary)',
        marginLeft: 3,
        verticalAlign: 'text-bottom',
        animation: 'blink 1s step-end infinite',
        boxShadow: '0 0 8px var(--accent-primary)',
      }} />
    </span>
  );
}

// ── Social icons ──────────────────────────────────────────────────────────────
const socials = [
  { label: 'GitHub',    href: 'https://github.com/mohitmjm',                  icon: FiGithub },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/mohit-mohatkar',   icon: FiLinkedin },
  { label: 'Instagram', href: 'https://www.instagram.com/mohitmohatkar/',     icon: FiInstagram },
  { label: 'Email',     href: 'mailto:mohitjmohatkar@gmail.com',              icon: FiMail },
];

// ── Letter animation ──────────────────────────────────────────────────────────
const letterVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: i => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero({ mouse }) {
  const heroRef  = useRef(null);
  const photoRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const hero  = heroRef.current;
    const photo = photoRef.current;
    if (!hero || !photo) return;
    const rect = hero.getBoundingClientRect();
    const dx   = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
    const dy   = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
    photo.style.transform = `perspective(800px) rotateX(${-dy * 14}deg) rotateY(${dx * 14}deg) scale(1.04)`;
    setParallax({ x: dx * -12, y: dy * -8 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const photo = photoRef.current;
    if (photo) photo.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    setParallax({ x: 0, y: 0 });
  }, []);

  const name = 'Mohit Mohatkar';

  return (
    <header
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="scanlines"
      style={{
        position:  'relative',
        minHeight: '100vh',
        display:   'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 72,
      }}
    >
      <ParticleCanvas mouseRef={mouse} />

      {/* Ambient glows — Terminal Green */}
      <div style={{
        position: 'absolute', top: '18%', left: '8%',
        width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        filter: 'blur(70px)', pointerEvents: 'none',
        animation: 'floatBlob 12s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '12%', right: '6%',
        width: 440, height: 440, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)',
        filter: 'blur(65px)', pointerEvents: 'none',
        animation: 'floatBlob 16s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', top: '55%', left: '55%',
        width: 340, height: 340, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        filter: 'blur(55px)', pointerEvents: 'none',
        animation: 'floatBlob 20s ease-in-out infinite',
      }} />

      {/* Content */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center',
          display:  'flex', flexDirection: 'column',
          alignItems: 'center', gap: '1.5rem',
          padding:  '0 24px',
          transition: 'transform 0.1s linear',
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
        }}
      >
        {/* Profile Photo with spinning ring */}
        <div style={{ position: 'relative', marginBottom: '0.25rem' }}>
          <div style={{
            position: 'absolute', inset: -6, borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #3b82f6, #818cf8, #06b6d4, #3b82f6)',
            animation: 'spin 4s linear infinite', zIndex: 0,
          }} />
          <div style={{
            position: 'absolute', inset: -3, borderRadius: '50%',
            background: 'var(--bg-primary)', zIndex: 1,
          }} />
          <div
            ref={photoRef}
            style={{
              position: 'relative', zIndex: 2,
              width: 160, height: 160,
              borderRadius: '50%', overflow: 'hidden',
              transition: 'transform 0.08s linear',
              willChange: 'transform',
              boxShadow: '0 8px 40px rgba(59,130,246,0.35)',
            }}
          >
            <img
              src="/assets/profile.png"
              alt="Mohit Mohatkar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = 'linear-gradient(135deg, #3b82f6, #818cf8)';
                e.target.parentElement.innerHTML += '<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:2.8rem;font-family:var(--font-display);font-weight:800;color:#060d0f">MM</span>';
              }}
            />
          </div>
        </div>

        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px',
            background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.25)',
            borderRadius: 20,
          }}
        >
          <span className="avail-dot" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-primary)', letterSpacing: '0.08em' }}>
            OPEN TO OPPORTUNITIES
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 8vw, 4.2rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
          initial="hidden"
          animate="visible"
        >
          {name.split('').map((ch, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              className="shimmer-text"
              style={{ display: 'inline-block' }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </motion.h1>

        {/* Typewriter role */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: 400,
            color: 'var(--text-secondary)',
          }}
        >
          <Typewriter />
        </motion.p>

        {/* Location + email */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="hero-meta"
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.83rem',
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'center',
            gap: '4px 10px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>📍 Nagpur, Maharashtra</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <a
            href="mailto:mohitjmohatkar@gmail.com"
            style={{ color: 'var(--accent-primary)', textDecoration: 'underline', textDecorationColor: 'transparent' }}
            onMouseEnter={e => e.target.style.textDecorationColor = 'var(--accent-primary)'}
            onMouseLeave={e => e.target.style.textDecorationColor = 'transparent'}
          >
            mohitjmohatkar@gmail.com
          </a>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex', gap: '12px',
            flexWrap: 'wrap', justifyContent: 'center',
            width: '100%', maxWidth: 400,
          }}
        >
          <MagneticButton
            href="/assets/resume_Mohit.pdf"
            download="Mohit_Mohatkar_Resume.pdf"
            primary
          >
            ↓ Download Resume
          </MagneticButton>
          <MagneticButton
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            ✉ Get in Touch
          </MagneticButton>
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.55, duration: 0.5 }}
          style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {socials.map(s => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              title={s.label}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 42, height: 42,
                border: '1px solid var(--border)',
                borderRadius: '50%',
                color: 'var(--text-muted)',
                transition: 'border-color 0.2s, color 0.2s, box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color       = 'var(--accent-primary)';
                e.currentTarget.style.boxShadow   = '0 0 16px rgba(59,130,246,0.25)';
                e.currentTarget.style.transform   = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color       = 'var(--text-muted)';
                e.currentTarget.style.boxShadow   = 'none';
                e.currentTarget.style.transform   = 'translateY(0)';
              }}
            >
              <s.icon size={18} />
            </a>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.8 }}
          style={{ marginTop: '0.5rem' }}
        >
          <div style={{
            width: 24, height: 40,
            border: '1.5px solid var(--border-glow)',
            borderRadius: 12,
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', padding: '5px 0',
            boxShadow: '0 0 10px rgba(59,130,246,0.2)',
          }}>
            <div style={{
              width: 3, height: 8,
              background: 'var(--accent-primary)',
              borderRadius: 2,
              animation: 'scrollDot 1.8s ease infinite',
              boxShadow: '0 0 6px var(--accent-primary)',
            }} />
          </div>
        </motion.div>
      </div>
    </header>
  );
}
