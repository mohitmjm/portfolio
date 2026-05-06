import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experience } from '../data/experience';

function ExperienceCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
      {/* Timeline line + dot */}
      <div style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        flexShrink:    0,
      }}>
        <div style={{
          width: 14, height: 14,
          borderRadius: '50%',
          background: item.color,
          border: `2px solid ${item.color}`,
          boxShadow: `0 0 14px ${item.color}60`,
          flexShrink: 0,
          marginTop: '1.6rem',
          zIndex: 1,
        }} />
        {index < experience.length - 1 && (
          <div style={{
            width: 1, flex: 1,
            background: `linear-gradient(to bottom, ${item.color}50, transparent)`,
            marginTop: '4px',
          }} />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        style={{
          flex: 1,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backdropFilter: 'blur(24px)',
          marginBottom: '1rem',
          transition: 'border-color 0.25s, box-shadow 0.25s',
        }}
        whileHover={{
          borderColor: `rgba(${item.colorRgb},0.4)`,
          boxShadow:   `0 8px 40px rgba(${item.colorRgb},0.15)`,
        }}
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            width: '100%', background: 'none', border: 'none',
            padding: '1.5rem 1.75rem',
            display: 'flex', alignItems: 'center',
            gap: '1.25rem', cursor: 'none', textAlign: 'left',
          }}
        >
          {/* Icon */}
          <div style={{
            width: 52, height: 52,
            borderRadius: 'var(--radius-sm)',
            background: `rgba(${item.colorRgb},0.12)`,
            border: `1px solid rgba(${item.colorRgb},0.25)`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
          }}>
            {item.icon}
          </div>

          {/* Title block */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '1.05rem', color: item.color, lineHeight: 1.2,
            }}>
              {item.title}
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: 2 }}>
              {item.subtitle}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.type}</span>
              {item.date && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem', padding: '2px 8px',
                  background: `rgba(${item.colorRgb},0.1)`,
                  color: item.color,
                  border: `1px solid rgba(${item.colorRgb},0.2)`,
                  borderRadius: 12,
                }}>
                  {item.date}
                </span>
              )}
            </div>
          </div>

          {/* Chevron */}
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: `rgba(${item.colorRgb},0.1)`,
            border: `1px solid rgba(${item.colorRgb},0.2)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', color: item.color,
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
              <div style={{ padding: '0 1.25rem 1.25rem 1.25rem' }}>
                <ul
                  className="exp-bullets"
                  style={{
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    paddingLeft: 'calc(52px + 1.25rem)',
                  }}
                >
                  {item.highlights.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      style={{
                        display: 'flex', gap: '10px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem', lineHeight: 1.6,
                      }}
                    >
                      <span style={{ color: item.color, flexShrink: 0, marginTop: '3px' }}>→</span>
                      {h}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" style={{ paddingTop: 96, paddingBottom: 96, background: 'rgba(59,130,246,0.015)' }}>
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
            fontWeight: 800, marginTop: '0.5rem',
          }}>
            What I've{' '}
            <span style={{
              background: 'var(--gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Built &amp; Learned
            </span>
          </h2>
          <div className="section-divider" style={{ margin: '1rem auto 0' }} />
        </motion.div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
            marginTop: '1.5rem',
            padding: '2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            backdropFilter: 'blur(24px)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🚀</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Open to Opportunities
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: 480, margin: '0.5rem auto 1.25rem' }}>
            Actively looking for internships in AI/ML, Web Development, and Software Engineering. Let's build something great!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get in Touch ✉
            </button>
            <a
              href="/assets/Mohit_Mohatkar_Resume.pdf"
              download="Mohit_Mohatkar_Resume.pdf"
              className="btn-outline"
            >
              ↓ Resume
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
