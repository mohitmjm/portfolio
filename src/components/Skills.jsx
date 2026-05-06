import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skills, skillCategories } from '../data/skills';

/* ── Progress Bar (used on card back) ────────────────────────────────────── */
const proficiencyMap = { Advanced: 90, Intermediate: 60, Beginner: 30 };
const proficiencyColor = {
  Advanced:     'var(--accent-primary)',
  Intermediate: 'var(--accent-cyan)',
  Beginner:     'var(--accent-warm)',
};

function ProgressBar({ value, color }) {
  return (
    <div style={{
      width: '80%', height: 4,
      background: 'rgba(255,255,255,0.08)',
      borderRadius: 4, overflow: 'hidden',
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        style={{ height: '100%', background: color, borderRadius: 4, boxShadow: `0 0 8px ${color}` }}
      />
    </div>
  );
}

/* ── 3D Flip Card ─────────────────────────────────────────────────────────── */
function SkillCard({ skill, index }) {
  const cardRef  = useRef(null);
  const shineRef = useRef(null);
  const [flipped, setFlipped] = useState(false);

  const pcol = proficiencyColor[skill.proficiency] || 'var(--accent-primary)';
  const pval = proficiencyMap[skill.proficiency]   || 50;

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    card.style.setProperty('--rotX', `${-dy * 10}deg`);
    card.style.setProperty('--rotY', `${dx  * 10}deg`);
    if (shineRef.current) {
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      shineRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(129,140,248,0.14), transparent 60%)`;
      shineRef.current.style.opacity    = 1;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.setProperty('--rotX', '0deg');
      card.style.setProperty('--rotY', '0deg');
    }
    if (shineRef.current) shineRef.current.style.opacity = 0;
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '600px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setFlipped(f => !f)}
        style={{
          position: 'relative',
          width: '100%', aspectRatio: '1.1',
          transformStyle: 'preserve-3d',
          transform: `perspective(600px) rotateX(var(--rotX, 0deg)) rotateY(${flipped ? '180deg' : 'var(--rotY, 0deg)'})`,
          transition: flipped ? 'transform 0.55s cubic-bezier(0.23,1,0.32,1)' : 'transform 0.08s linear',
          cursor: 'none',
          '--rotX': '0deg', '--rotY': '0deg',
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '10px', padding: '1rem',
          backdropFilter: 'blur(24px)',
          overflow: 'hidden',
          transition: 'border-color 0.25s, box-shadow 0.25s',
        }}>
          <div ref={shineRef} style={{
            position: 'absolute', inset: 0, opacity: 0,
            pointerEvents: 'none', borderRadius: 'var(--radius-md)',
            transition: 'opacity 0.2s',
          }} />
          <div style={{ fontSize: '2.2rem', lineHeight: 1 }}>{skill.icon}</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: '0.9rem',
            color: 'var(--text-primary)', textAlign: 'center',
          }}>
            {skill.name}
          </div>
          <span style={{
            fontSize: '0.65rem', padding: '2px 8px',
            borderRadius: 10,
            background: 'rgba(59,130,246,0.1)',
            color: 'var(--accent-primary)',
            border: '1px solid rgba(59,130,246,0.2)',
            fontFamily: 'var(--font-mono)',
          }}>
            {skill.category}
          </span>
          <span style={{
            position: 'absolute', bottom: 8,
            fontSize: '0.58rem', color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}>
            [click to flip]
          </span>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.16), rgba(129,140,248,0.08))',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '10px', padding: '1rem', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            Proficiency
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800, fontSize: '1.1rem',
            color: pcol,
          }}>
            {skill.proficiency}
          </div>
          <ProgressBar value={pval} color={pcol} />
          <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {skill.note}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Skills Section ───────────────────────────────────────────────────────── */
export default function Skills() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? skills
    : skills.filter(s => s.category === activeFilter);

  // Category summary counts
  const counts = {};
  skills.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });

  return (
    <section id="skills" style={{ paddingTop: 96, paddingBottom: 96, background: 'rgba(59,130,246,0.015)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >

          <span className="section-label">Tech Stack</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800, marginTop: '0.5rem',
          }}>
            Skills &amp;{' '}
            <span style={{
              background: 'var(--gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Technologies
            </span>
          </h2>
          <div className="section-divider" style={{ margin: '1rem auto 0' }} />
        </motion.div>

        {/* Category summary row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center', gap: '8px',
            marginBottom: '1.75rem',
          }}
        >
          {Object.entries(counts).map(([cat, n]) => (
            <span key={cat} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              padding: '3px 10px',
              border: '1px solid var(--border)',
              borderRadius: 20,
            }}>
              {n} {cat}
            </span>
          ))}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'flex', gap: '8px',
            flexWrap: 'wrap', justifyContent: 'center',
            marginBottom: '2.5rem',
          }}
        >
          {skillCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '8px 20px', borderRadius: '20px',
                border: activeFilter === cat
                  ? '1px solid var(--accent-primary)'
                  : '1px solid var(--border)',
                background: activeFilter === cat
                  ? 'rgba(59,130,246,0.18)' : 'transparent',
                color: activeFilter === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                fontWeight: activeFilter === cat ? 600 : 400,
                cursor: 'none',
                transition: 'all 0.2s ease',
                boxShadow: activeFilter === cat ? '0 0 14px rgba(59,130,246,0.15)' : 'none',
              }}
              onMouseEnter={e => {
                if (activeFilter !== cat) {
                  e.currentTarget.style.borderColor = 'var(--border-glow)';
                  e.currentTarget.style.color       = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (activeFilter !== cat) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color       = 'var(--text-secondary)';
                }
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Card Grid */}
        <motion.div
          layout
          className="skills-card-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '1rem',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((skill, i) => (
              <SkillCard key={skill.id} skill={skill} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>


      </div>
    </section>
  );
}
