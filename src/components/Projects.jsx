import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';

const categories = ['All', 'AI/ML', 'Web'];

// ── 3D Tilt Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onOpen }) {
  const cardRef = useRef(null);
  const shineRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(700px) rotateX(${-dy * 8}deg) rotateY(${dx * 8}deg) translateY(-4px)`;
    if (shineRef.current) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      shineRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.12), transparent 60%)`;
      shineRef.current.style.opacity = 1;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      card.style.borderColor = 'var(--border)';
      card.style.boxShadow = 'none';
      setTimeout(() => { if (card) card.style.transition = ''; }, 500);
    }
    if (shineRef.current) shineRef.current.style.opacity = 0;
  }, []);

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.borderColor = 'var(--border-glow)';
      card.style.boxShadow = 'var(--shadow-glow)';
    }
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(project)}
      style={{ cursor: 'none' }}
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
          padding: '1.75rem',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          willChange: 'transform',
          transition: 'border-color 0.25s, box-shadow 0.25s',
          height: '100%',
        }}
      >
        {/* Shine overlay */}
        <div ref={shineRef} style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          pointerEvents: 'none',
          borderRadius: 'var(--radius-lg)',
          transition: 'opacity 0.2s',
          zIndex: 1,
        }} />

        {/* Category badge */}
        <span style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: 20,
          fontSize: '0.68rem',
          fontWeight: 600,
          background: project.category === 'AI/ML' ? 'rgba(139,92,246,0.15)' : 'rgba(34,211,238,0.12)',
          color: project.category === 'AI/ML' ? 'var(--accent-violet)' : 'var(--accent-cyan)',
          border: project.category === 'AI/ML' ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(34,211,238,0.2)',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 2,
        }}>
          {project.category}
        </span>

        <div style={{ fontSize: '2.4rem', marginBottom: '0.75rem', position: 'relative', zIndex: 2 }}>
          {project.emoji}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.1rem',
          marginBottom: '0.75rem',
          color: 'var(--text-primary)',
          position: 'relative',
          zIndex: 2,
        }}>
          {project.title}
        </h3>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          lineHeight: 1.65,
          marginBottom: '1.25rem',
          position: 'relative',
          zIndex: 2,
        }}>
          {project.shortDesc}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', position: 'relative', zIndex: 2 }}>
          {project.tags.map(tag => (
            <span key={tag} className="tag" style={{ fontSize: '0.7rem' }}>{tag}</span>
          ))}
        </div>

        {/* Click hint */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          zIndex: 2,
        }}>
          Click to expand →
        </div>
      </div>
    </motion.div>
  );
}

// ── Dashed Coming Soon / GitHub Card ─────────────────────────────────────────
function ComingSoonCard() {
  const divRef = useRef(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <a
        href="https://github.com/mohitmohatkar"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', height: '100%' }}
      >
        <div
          ref={divRef}
          onMouseEnter={() => {
            if (divRef.current) {
              divRef.current.style.borderColor = 'var(--accent-primary)';
              divRef.current.style.background = 'rgba(99,102,241,0.05)';
            }
          }}
          onMouseLeave={() => {
            if (divRef.current) {
              divRef.current.style.borderColor = 'var(--border)';
              divRef.current.style.background = 'transparent';
            }
          }}
          style={{
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '0.75rem',
            height: '100%',
            minHeight: 240,
            transition: 'border-color 0.25s, background 0.25s',
          }}
        >
          <span style={{ fontSize: '2.2rem' }}>📂</span>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--text-secondary)',
          }}>
            More on GitHub
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Explore my repos for more AI/ML and web projects currently in progress.
          </p>
          <span style={{
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(99,102,241,0.1)',
            color: 'var(--accent-primary)',
            border: '1px solid rgba(99,102,241,0.2)',
            fontSize: '0.78rem',
            fontWeight: 600,
          }}>
            View GitHub →
          </span>
        </div>
      </a>
    </motion.div>
  );
}

// ── Project Modal ─────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 2000,
            }}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2001,
              width: 'min(600px, 92vw)',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glow)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                cursor: 'none',
              }}
            >
              ✕
            </button>

            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{project.emoji}</div>

            <span style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: '0.7rem',
              fontWeight: 600,
              background: project.category === 'AI/ML' ? 'rgba(139,92,246,0.15)' : 'rgba(34,211,238,0.12)',
              color: project.category === 'AI/ML' ? 'var(--accent-violet)' : 'var(--accent-cyan)',
              border: project.category === 'AI/ML' ? '1px solid rgba(139,92,246,0.25)' : '1px solid rgba(34,211,238,0.2)',
              marginBottom: '0.75rem',
            }}>
              {project.category}
            </span>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: 'var(--text-primary)',
            }}>
              {project.title}
            </h2>

            <p style={{
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
            }}>
              {project.longDesc}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.75rem' }}>
              {project.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>

            {/* Action links */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  🐙 View GitHub
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  🌐 Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Projects Section ──────────────────────────────────────────────────────────
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

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
            fontWeight: 800,
            marginTop: '0.5rem',
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

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: activeFilter === cat ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
                background: activeFilter === cat ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: activeFilter === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem',
                fontWeight: activeFilter === cat ? 600 : 400,
                cursor: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Bento Grid */}
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
              />
            ))}
            <ComingSoonCard key="coming-soon" />
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
