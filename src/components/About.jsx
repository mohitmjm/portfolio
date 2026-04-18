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
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

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
              fontWeight: 800,
              marginTop: '0.5rem',
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
              <strong style={{ color: 'var(--text-primary)' }}>B.Tech in Computer Science & Engineering (AI & ML)</strong>{' '}
              at Shri Ramdeobaba College of Engineering and Management, Nagpur.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              I'm a quick learner who enjoys exploring new tools and technologies. Outside of tech, I love to travel, meet
              new people, and experience diverse cultures. My curiosity and enthusiasm drive me to constantly improve and
              take on challenges with confidence.
            </p>

            {/* Stats */}
            <div className="stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginTop: '1.75rem',
            }}>
              {stats.map(s => (
                <div
                  key={s.label}
                  style={{
                    background: 'rgba(99,102,241,0.07)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <div className="stat-number" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    background: 'var(--gradient-text)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {s.number}
                  </div>
                  <div className="stat-label" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills chips */}
            <div style={{ marginTop: '1.75rem' }}>
              <span className="section-label">Skills & Interests</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '0.75rem' }}>
                {skillTags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
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

            {/* Coming soon placeholder */}
            <div style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '3rem 2rem',
              textAlign: 'center',
              background: 'rgba(99,102,241,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <div style={{ fontSize: '2.8rem' }}>📄</div>
              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
              }}>
                Resume Will Be Uploaded Soon
              </h4>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.88rem',
                lineHeight: 1.65,
                maxWidth: 380,
              }}>
                I'm currently updating my resume. It will be available for download here very soon. In the meantime, feel free to reach out directly!
              </p>
              <button
                className="btn-primary"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ marginTop: '0.5rem' }}
              >
                ✉ Get in Touch
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
