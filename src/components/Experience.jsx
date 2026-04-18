import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experience } from '../data/experience';

function ExperienceCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      whileHover={{
        borderColor: `rgba(${item.colorRgb},0.4)`,
        boxShadow: `0 8px 40px rgba(${item.colorRgb},0.15)`,
      }}
    >
      {/* Card Header — always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          cursor: 'none',
          textAlign: 'left',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-sm)',
          background: `rgba(${item.colorRgb},0.12)`,
          border: `1px solid rgba(${item.colorRgb},0.25)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          flexShrink: 0,
        }}>
          {item.icon}
        </div>

        {/* Title */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: item.color,
            lineHeight: 1.2,
          }}>
            {item.title}
          </div>
          <div style={{
            fontWeight: 600,
            fontSize: '0.9rem',
            color: 'var(--text-primary)',
            marginTop: 2,
          }}>
            {item.subtitle}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: 4,
          }}>
            {item.type}
          </div>
        </div>

        {/* Expand toggle */}
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: `rgba(${item.colorRgb},0.1)`,
          border: `1px solid rgba(${item.colorRgb},0.2)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          color: item.color,
          transition: 'transform 0.3s',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0,
        }}>
          ▼
        </div>
      </button>

      {/* Expandable bullets */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 1.25rem 1.25rem 1.25rem',
            }}>
              <ul className="exp-bullets" style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: 'calc(56px + 1.25rem)' }}>
                {item.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{
                      color: item.color,
                      flexShrink: 0,
                      marginTop: '3px',
                    }}>→</span>
                    {h}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" style={{ paddingTop: 96, paddingBottom: 96, background: 'rgba(99,102,241,0.02)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span className="section-label">Journey</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            marginTop: '0.5rem',
          }}>
            What I've{' '}
            <span style={{
              background: 'var(--gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Built & Learned
            </span>
          </h2>
          <div className="section-divider" style={{ margin: '1rem auto 0' }} />
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {experience.map((item, i) => (
            <ExperienceCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            marginTop: '2.5rem',
            padding: '2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🚀</div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            Open to Opportunities
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 480, margin: '0.5rem auto 1.25rem' }}>
            Actively looking for internships in AI/ML, Web Development, and Software Engineering. Let's build something great together!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get in Touch ✉
            </button>
            <button
              className="btn-outline"
              onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Resume
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
