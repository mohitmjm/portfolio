import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'AI/ML', 'Web'];

/* ── 3D Tilt Card ─────────────────────────────────────────────────────────── */
function ProjectCard({ project, onOpen, onOpenReport, featured }) {
  const cardRef  = useRef(null);
  const shineRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(700px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) translateY(-4px)`;
    if (shineRef.current) {
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      shineRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(129,140,248,0.12), transparent 60%)`;
      shineRef.current.style.opacity    = 1;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.transform  = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      card.style.borderColor = 'var(--border)';
      card.style.boxShadow   = 'none';
      setTimeout(() => { if (card) card.style.transition = ''; }, 500);
    }
    if (shineRef.current) shineRef.current.style.opacity = 0;
  }, []);

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.borderColor = 'var(--border-glow)';
      card.style.boxShadow   = 'var(--shadow-glow)';
    }
  }, []);

  const catColor  = project.category === 'AI/ML'
    ? { bg: 'rgba(167,139,250,0.14)', color: 'var(--accent-violet)', border: 'rgba(167,139,250,0.28)' }
    : { bg: 'rgba(6,182,212,0.12)',   color: 'var(--accent-cyan)',   border: 'rgba(6,182,212,0.22)'   };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(project)}
      style={{ cursor: 'none', gridColumn: featured ? 'span 2' : 'span 1' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: featured ? '2.25rem' : '1.75rem',
          backdropFilter: 'blur(24px)',
          position: 'relative', overflow: 'hidden',
          willChange: 'transform',
          transition: 'border-color 0.25s, box-shadow 0.25s',
          height: '100%',
          display: 'flex',
          flexDirection: featured ? 'row' : 'column',
          gap: featured ? '2rem' : 0,
          alignItems: featured ? 'center' : 'stretch',
        }}
      >
        {/* Shine */}
        <div ref={shineRef} style={{
          position: 'absolute', inset: 0, opacity: 0,
          pointerEvents: 'none', borderRadius: 'var(--radius-lg)',
          transition: 'opacity 0.2s', zIndex: 1,
        }} />

        {/* "NEW" badge */}
        {project.id === Math.max(...projects.map(p => p.id)) && (
          <span style={{
            position: 'absolute', top: 16, right: 16,
            padding: '2px 10px', borderRadius: 20,
            fontSize: '0.62rem', fontWeight: 700,
            background: 'rgba(59,130,246,0.18)',
            color: 'var(--accent-primary)',
            border: '1px solid rgba(59,130,246,0.35)',
            fontFamily: 'var(--font-mono)',
            zIndex: 2,
            boxShadow: '0 0 10px rgba(59,130,246,0.2)',
          }}>NEW</span>
        )}

        {/* Featured big emoji */}
        <div style={{
          fontSize: featured ? '4rem' : '2.4rem',
          marginBottom: featured ? 0 : '0.75rem',
          position: 'relative', zIndex: 2,
          flexShrink: 0,
        }}>
          {project.emoji}
        </div>

        <div style={{ flex: 1, position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column' }}>
          {/* Category badge */}
          <span style={{
            display: 'inline-block',
            padding: '3px 10px', borderRadius: 20,
            fontSize: '0.68rem', fontWeight: 600,
            background: catColor.bg, color: catColor.color,
            border: `1px solid ${catColor.border}`,
            marginBottom: '0.75rem',
            fontFamily: 'var(--font-mono)',
          }}>
            {project.category}
          </span>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: featured ? '1.4rem' : '1.1rem',
            marginBottom: '0.75rem',
            color: 'var(--text-primary)',
          }}>
            {project.title}
          </h3>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.85rem', lineHeight: 1.65,
            marginBottom: '1.25rem',
          }}>
            {project.shortDesc}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.tags.map(tag => (
              <span key={tag} className="tag" style={{ fontSize: '0.7rem' }}>{tag}</span>
            ))}
          </div>

          <div style={{
            marginTop: 'auto',
            paddingTop: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>[click to expand →]</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {project.report && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onOpenReport(project.report); }}
                  style={{
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    padding: '6px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 'inherit'
                  }}
                >
                  📄 Report
                </button>
              )}
              {project.demo && (
                <a 
                  href={project.demo} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    color: '#fff',
                    fontWeight: 800,
                    textDecoration: 'none',
                    padding: '6px 14px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'var(--accent-primary)',
                    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
                    letterSpacing: '0.5px'
                  }}
                >
                  🔥 OPEN LIVE APP
                </a>
              )}
              {project.detailsPage && (
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(project.detailsPage); }}
                  style={{
                    color: '#fff',
                    fontWeight: 800,
                    textDecoration: 'none',
                    padding: '6px 14px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'var(--accent-primary)',
                    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 'inherit'
                  }}
                >
                  🔥 VIEW DETAILS
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Coming Soon / GitHub Card ────────────────────────────────────────────── */
function ComingSoonCard() {
  const divRef = useRef(null);
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
      <a href="https://github.com/mohitmjm" target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: '100%' }}>
        <div
          ref={divRef}
          onMouseEnter={() => {
            if (divRef.current) {
              divRef.current.style.borderColor = 'var(--accent-primary)';
              divRef.current.style.background  = 'rgba(59,130,246,0.05)';
              divRef.current.style.boxShadow   = 'var(--shadow-glow)';
            }
          }}
          onMouseLeave={() => {
            if (divRef.current) {
              divRef.current.style.borderColor = 'var(--border)';
              divRef.current.style.background  = 'transparent';
              divRef.current.style.boxShadow   = 'none';
            }
          }}
          style={{
            border: '1.5px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 1.75rem',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', gap: '0.75rem',
            height: '100%', minHeight: 240,
            transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
          }}
        >
          <span style={{ fontSize: '2.2rem' }}>📂</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-secondary)' }}>
            More on GitHub
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Explore repos for more AI/ML and web projects currently in progress.
          </p>
          <span style={{
            padding: '6px 16px', borderRadius: 20,
            background: 'rgba(59,130,246,0.1)', color: 'var(--accent-primary)',
            border: '1px solid rgba(59,130,246,0.2)',
            fontSize: '0.78rem', fontWeight: 600,
            fontFamily: 'var(--font-mono)',
          }}>
            View GitHub →
          </span>
        </div>
      </a>
    </motion.div>
  );
}

/* ── Project Modal ────────────────────────────────────────────────────────── */
function ProjectModal({ project, onClose, onOpenReport }) {
  const navigate = useNavigate();
  const catColor = project?.category === 'AI/ML'
    ? { bg: 'rgba(167,139,250,0.14)', color: 'var(--accent-violet)', border: 'rgba(167,139,250,0.28)' }
    : { bg: 'rgba(6,182,212,0.12)',   color: 'var(--accent-cyan)',   border: 'rgba(6,182,212,0.22)'   };

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 2000,
            }}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "calc(-50% + 40px)" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.85, x: "-50%", y: "calc(-50% + 40px)" }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'fixed', top: '50%', left: '50%',
              zIndex: 2001,
              width: 'min(600px, 92vw)',
              maxHeight: '85vh', overflowY: 'auto',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glow)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.1)',
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '1.25rem', right: '1.25rem',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid var(--border)',
                borderRadius: '8px', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', fontSize: '1rem', cursor: 'none',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-glow)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              ✕
            </button>

            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{project.emoji}</div>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: 20,
              fontSize: '0.7rem', fontWeight: 600,
              background: catColor.bg, color: catColor.color,
              border: `1px solid ${catColor.border}`,
              marginBottom: '0.75rem', fontFamily: 'var(--font-mono)',
            }}>
              {project.category}
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800, fontSize: '1.5rem',
              marginBottom: '1rem', color: 'var(--text-primary)',
            }}>
              {project.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {project.longDesc}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.75rem' }}>
              {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  ⌥ View GitHub
                </a>
              )}
              {project.report && (
                <button onClick={() => onOpenReport(project.report)} className="btn-outline" style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  📄 View Report
                </button>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  🌐 Live Demo
                </a>
              )}
              {project.detailsPage && (
                <button 
                  onClick={() => navigate(project.detailsPage)} 
                  className="btn-primary" 
                  style={{ cursor: 'pointer', fontFamily: 'inherit', border: 'none' }}
                >
                  🔥 View Full Details
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Projects Section ─────────────────────────────────────────────────────── */
export default function Projects() {
  const [activeFilter,     setActiveFilter]     = useState('All');
  const [selectedProject,  setSelectedProject]  = useState(null);
  const [activeReport,     setActiveReport]     = useState(null);

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  // First featured project spans 2 columns
  const firstFeaturedId = filtered.find(p => p.featured)?.id;

  return (
    <section id="projects" style={{ paddingTop: 96, paddingBottom: 96 }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >

          <span className="section-label">Portfolio</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800, marginTop: '0.5rem',
          }}>
            Featured{' '}
            <span style={{
              background: 'var(--gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Projects
            </span>
          </h2>
          <div className="section-divider" style={{ margin: '1rem auto 0' }} />
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '8px 20px', borderRadius: '20px',
                border: activeFilter === cat ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
                background: activeFilter === cat ? 'rgba(59,130,246,0.18)' : 'transparent',
                color: activeFilter === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem', fontWeight: activeFilter === cat ? 600 : 400,
                cursor: 'none', transition: 'all 0.2s ease',
                boxShadow: activeFilter === cat ? '0 0 14px rgba(59,130,246,0.15)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid — featured card spans 2 cols */}
        <motion.div
          layout
          className="projects-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={setSelectedProject}
                onOpenReport={setActiveReport}
                featured={false}
              />
            ))}
            <ComingSoonCard key="coming-soon" />
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} onOpenReport={setActiveReport} />
      <ReportModal report={activeReport} onClose={() => setActiveReport(null)} />
    </section>
  );
}

/* ── Report Modal ─────────────────────────────────────────────────────────── */
function ReportModal({ report, onClose }) {
  return (
    <AnimatePresence>
      {report && (
        <>
          <motion.div
            key="backdrop-report"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            }}
          />
          <motion.div
            key="modal-report"
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "calc(-50% + 20px)" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "calc(-50% + 20px)" }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              width: '90%', maxWidth: '1000px', height: '90vh',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              zIndex: 10000,
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-dark)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                📄 Document Viewer
              </h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}>✕</button>
            </div>
            <iframe src={`${report}#view=FitH&toolbar=0`} style={{ flex: 1, width: '100%', height: '100%', border: 'none', background: '#e5e7eb' }} title="Report Viewer" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
