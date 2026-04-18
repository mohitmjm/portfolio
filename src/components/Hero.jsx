import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// ── Particle canvas background ──────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const N = window.innerWidth < 768 ? 60 : 120;
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

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

// ── Magnetic Button ──────────────────────────────────────────────────────────
function MagneticButton({ children, primary, href, onClick, download }) {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      const strength = (80 - dist) / 80;
      btn.style.transform = `translate(${dx * strength * 0.35}px, ${dy * strength * 0.35}px)`;
    }
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (btn) {
      btn.style.transform = 'translate(0,0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      setTimeout(() => { if (btn) btn.style.transition = ''; }, 500);
    }
  };

  const Tag = href ? 'a' : 'button';
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

// ── Typewriter ───────────────────────────────────────────────────────────────
const roles = [
  'B.Tech CSE (AI & ML)',
  'Full Stack Developer',
  'ML Enthusiast',
  'Problem Solver',
];

function Typewriter() {
  const [display, setDisplay] = useState('');
  const [roleIdx, setRoleIdx] = useState(0);
  const [phase, setPhase] = useState('typing'); // typing | pausing | deleting

  useEffect(() => {
    const role = roles[roleIdx];
    let timeout;

    if (phase === 'typing') {
      if (display.length < role.length) {
        timeout = setTimeout(() => setDisplay(role.slice(0, display.length + 1)), 70);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), 1800);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 400);
    } else {
      if (display.length > 0) {
        timeout = setTimeout(() => setDisplay(prev => prev.slice(0, -1)), 40);
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
      <span
        style={{
          display: 'inline-block',
          width: 2,
          height: '1em',
          background: 'var(--accent-cyan)',
          marginLeft: 2,
          verticalAlign: 'text-bottom',
          animation: 'blink 1s step-end infinite',
        }}
      />
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </span>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  const heroRef = useRef(null);
  const photoRef = useRef(null);
  const nameRef = useRef(null);
  // parallax state
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const hero = heroRef.current;
    const photo = photoRef.current;
    if (!hero || !photo) return;

    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);   // -1 to 1
    const dy = (e.clientY - cy) / (rect.height / 2);  // -1 to 1

    // Photo tilt
    const rotX = -dy * 14;
    const rotY = dx * 14;
    photo.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;

    // Parallax on text
    setParallax({ x: dx * -12, y: dy * -8 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const photo = photoRef.current;
    if (photo) {
      photo.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
    setParallax({ x: 0, y: 0 });
  }, []);

  const name = 'Mohit Mohatkar';

  return (
    <header
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 72,
      }}
    >
      <ParticleCanvas />

      {/* Ambient glows */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '0 24px',
          transition: 'transform 0.1s linear',
          transform: `translate(${parallax.x}px, ${parallax.y}px)`,
        }}
      >
        {/* Profile Photo */}
        <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
          {/* Rotating ring */}
          <div style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #22d3ee, #6366f1)',
            animation: 'spin 4s linear infinite',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: 'var(--bg-primary)',
            zIndex: 1,
          }} />
          <div
            ref={photoRef}
            style={{
              position: 'relative',
              zIndex: 2,
              width: 160,
              height: 160,
              borderRadius: '50%',
              overflow: 'hidden',
              transition: 'transform 0.08s linear',
              willChange: 'transform',
              boxShadow: '0 8px 40px rgba(99,102,241,0.35)',
            }}
          >
            <img
              src="/assets/profile_p.jpeg"
              alt="Mohit Mohatkar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentElement.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
                e.target.parentElement.innerHTML += '<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:3rem;">MM</span>';
              }}
            />
          </div>
        </div>

        {/* Name */}
        <motion.h1
          ref={nameRef}
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
              style={{
                display: 'inline-block',
                background: 'var(--gradient-text)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </motion.h1>

        {/* Typewriter */}
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

        {/* Location */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="hero-meta"
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px 8px',
          }}
        >
          <span>📍 Nagpur, Maharashtra</span>
          <span style={{ opacity: 0.4 }}>·</span>
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
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 380 }}
        >
          <MagneticButton
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            primary
          >
            📄 View Resume
          </MagneticButton>
          <MagneticButton
            onClick={() => {
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            ✉ Get in Touch
          </MagneticButton>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          style={{ marginTop: '1rem' }}
        >
          <div style={{
            width: 24,
            height: 40,
            border: '2px solid var(--border-glow)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '5px 0',
          }}>
            <div style={{
              width: 4,
              height: 8,
              background: 'var(--accent-primary)',
              borderRadius: 2,
              animation: 'scrollDot 1.8s ease infinite',
            }} />
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(14px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
      `}</style>
    </header>
  );
}
