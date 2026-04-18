import { motion } from 'framer-motion';
import { education, certifications } from '../data/education';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Education() {
  return (
    <section id="education" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span className="section-label">Academic Journey</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            marginTop: '0.5rem',
          }}>
            Where I{' '}
            <span style={{
              background: 'var(--gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Studied
            </span>
          </h2>
          <div className="section-divider" style={{ margin: '1rem auto 0' }} />
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            position: 'relative',
            paddingLeft: 40,
          }}
        >
          {/* Timeline vertical line */}
          <div style={{
            position: 'absolute',
            left: 16,
            top: 24,
            bottom: 24,
            width: 2,
            background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-violet), var(--accent-green))',
            borderRadius: 2,
            opacity: 0.35,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {education.map((edu, i) => (
              <motion.div key={edu.id} variants={itemVariants} style={{ position: 'relative' }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: -30,
                  top: 28,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: edu.color,
                  border: '2px solid var(--bg-primary)',
                  boxShadow: `0 0 12px ${edu.color}80`,
                  zIndex: 1,
                }} />

                {/* Card */}
                <motion.div
                  whileHover={{
                    borderColor: edu.color,
                    boxShadow: `0 0 30px ${edu.color}30, var(--shadow-sm)`,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    gap: '1.25rem',
                    alignItems: 'center',
                    minHeight: 110,
                    transition: 'border-color 0.25s, box-shadow 0.25s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Left accent bar */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: edu.status === 'active'
                      ? `linear-gradient(to bottom, ${edu.color}, ${edu.color}80)`
                      : `${edu.color}50`,
                    borderRadius: '3px 0 0 3px',
                    transition: 'opacity 0.25s',
                  }} />

                  {/* Logo */}
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 'var(--radius-sm)',
                    background: `${edu.color}18`,
                    border: `1px solid ${edu.color}30`,
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                  }}>
                    <img
                      src={edu.logo}
                      alt={edu.shortName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '🎓';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                      lineHeight: 1.3,
                    }}>
                      {edu.institution}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '6px' }}>
                      {edu.degree}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      📅 {edu.period} &nbsp;|&nbsp; {edu.location}
                    </p>
                  </div>

                  {/* Badge */}
                  <span style={{
                    flexShrink: 0,
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: edu.status === 'active' ? `${edu.color}20` : 'rgba(16,185,129,0.12)',
                    color: edu.status === 'active' ? edu.color : 'var(--accent-green)',
                    border: `1px solid ${edu.status === 'active' ? `${edu.color}40` : 'rgba(16,185,129,0.3)'}`,
                    animation: edu.status === 'active' ? 'pulseBadge 2s ease infinite' : 'none',
                    alignSelf: 'flex-start',
                  }}>
                    {edu.status === 'active' ? '● ' : '✓ '}
                    {edu.statusLabel}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card"
          style={{ marginTop: '2.5rem', textAlign: 'center' }}
        >
          <span className="section-label">Learning</span>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            fontWeight: 700,
            margin: '0.5rem 0 0.75rem',
          }}>
            Courses & Certifications
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Currently completing online courses — certifications will be updated here soon.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {certifications.map(cert => (
              <span key={cert.name} className="tag">
                {cert.icon} {cert.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulseBadge {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
      `}</style>
    </section>
  );
}
