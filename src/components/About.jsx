import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { number: '3rd', label: 'Year B.Tech' },
  { number: 'AI/ML', label: 'Specialization' },
  { number: '∞', label: 'Curiosity' },
];

const skillTags = [
  '🐍 Python', '⚛️ React', '🌐 JavaScript', '🤖 Machine Learning',
  '🧠 Artificial Intelligence', '💻 Web Development',
  '📊 Data Science', '☁️ Cloud & DevOps', '📱 Next.js', '🔧 Problem Solving',
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Animated Counter ─────────────────────────────────────────────────────── */
function AnimatedStat({ value, label }) {
  const ref    = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSeen(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: 'rgba(59,130,246,0.06)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        textAlign: 'center',
        transition: 'border-color 0.25s, box-shadow 0.25s',
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
      <motion.div
        className="stat-number"
        initial={{ opacity: 0, y: 10 }}
        animate={seen ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.6rem',
          fontWeight: 800,
          background: 'var(--gradient-text)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          backgroundClip: 'text',
        }}
      >
        {value}
      </motion.div>
      <div className="stat-label" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} style={{ textAlign: 'center' }}>

            <span className="section-label">About Me</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 800, marginTop: '0.5rem',
            }}>
              Hello, I'm{' '}
              <span style={{
                background: 'var(--gradient-text)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Mohit 👋
              </span>
            </h2>
            <div className="section-divider" style={{ margin: '1rem auto 0' }} />
          </motion.div>

          {/* Bio */}
          <motion.div variants={itemVariants} className="card">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.9rem', lineHeight: 1.75 }}>
              A passionate and driven individual pursuing{' '}
              <strong style={{ color: 'var(--text-primary)' }}>B.Tech in Computer Science &amp; Engineering (AI &amp; ML)</strong>{' '}
              at Shri Ramdeobaba College of Engineering and Management, Nagpur.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              I'm a quick learner who enjoys exploring new tools and technologies. Outside of tech, I love to travel
              and experience diverse cultures. My curiosity and enthusiasm drive me to constantly improve and
              take on challenges with confidence.
            </p>

            {/* Stats */}
            <div className="stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem', marginTop: '1.75rem',
            }}>
              {stats.map(s => (
                <AnimatedStat key={s.label} value={s.number} label={s.label} />
              ))}
            </div>

            {/* Skills chips */}
            <div style={{ marginTop: '1.75rem' }}>
              <span className="section-label">Skills &amp; Interests</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '0.75rem' }}>
                {skillTags.map(tag => (
                  <span
                    key={tag}
                    className="tag"
                    style={{ transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--border-glow)';
                      e.currentTarget.style.boxShadow   = '0 0 12px rgba(59,130,246,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)';
                      e.currentTarget.style.boxShadow   = 'none';
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Resume */}
          <motion.div variants={itemVariants} className="card">
            <span className="section-label">Resume</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0.5rem 0 0.75rem' }}>
              My Resume
            </h3>
            <div style={{
              border: '1.5px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              background: 'rgba(59,130,246,0.025)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '0.75rem',
            }}>
              <div style={{ fontSize: '2.8rem' }}>📄</div>
              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700, fontSize: '1.1rem',
                color: 'var(--text-primary)',
              }}>
                Download My Resume
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, maxWidth: 380 }}>
                Get a copy of my latest resume — or reach out directly if you'd like to connect.
              </p>
              <a
                href="/assets/resume_Mohit.pdf"
                download="Mohit_Mohatkar_Resume.pdf"
                className="btn-primary"
                style={{ marginTop: '0.5rem' }}
              >
                ↓ Download Resume
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
