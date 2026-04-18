import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

const contactLinks = [
  {
    id: 'email-personal',
    icon: '📧',
    label: 'Personal Email',
    value: 'mohitjmohatkar@gmail.com',
    href: 'mailto:mohitjmohatkar@gmail.com',
    color: '#6366f1',
    colorRgb: '99,102,241',
  },
  {
    id: 'email-college',
    icon: '🎓',
    label: 'College Email',
    value: 'mohatkarmj@rknec.edu',
    href: 'mailto:mohatkarmj@rknec.edu',
    color: '#22d3ee',
    colorRgb: '34,211,238',
  },
  {
    id: 'linkedin',
    icon: '🔗',
    label: 'LinkedIn',
    value: 'mohit-mohatkar',
    href: 'https://www.linkedin.com/in/mohit-mohatkar',
    color: '#0a66c2',
    colorRgb: '10,102,194',
  },
  {
    id: 'instagram',
    icon: '📸',
    label: 'Instagram',
    value: '@mohitmohatkar',
    href: 'https://www.instagram.com/mohitmohatkar/',
    color: '#e1306c',
    colorRgb: '225,48,108',
  },
];

// Magnetic Submit Button
function MagneticSubmit({ children, loading, success }) {
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

  return (
    <button
      ref={btnRef}
      type="submit"
      disabled={loading || success}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="btn-primary"
      style={{
        width: '100%',
        justifyContent: 'center',
        fontSize: '0.95rem',
        padding: '14px 28px',
        opacity: loading ? 0.7 : 1,
        background: success
          ? 'linear-gradient(135deg, #10b981, #059669)'
          : undefined,
      }}
    >
      {loading ? '⏳ Sending...' : success ? '✅ Sent Successfully!' : children}
    </button>
  );
}

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm();

  const onSubmit = async (data) => {
    try {
      await fetch('https://formspree.io/f/xwpbjrdn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    background: 'rgba(0,0,0,0.15)',
    border: `1px solid ${hasError ? 'var(--accent-pink)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  });

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  return (
    <section id="contact" style={{ paddingTop: 96, paddingBottom: 96, background: 'rgba(99,102,241,0.02)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span className="section-label">Get in Touch</span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            marginTop: '0.5rem',
          }}>
            Let's{' '}
            <span style={{
              background: 'var(--gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Connect
            </span>
          </h2>
          <div className="section-divider" style={{ margin: '1rem auto 0' }} />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {/* Contact Links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              color: 'var(--text-primary)',
            }}>
              Reach Me At
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {contactLinks.map((link, i) => (
                <motion.a
                  key={link.id}
                  id={link.id}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backdropFilter: 'blur(20px)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = link.color;
                    e.currentTarget.style.boxShadow = `0 4px 24px rgba(${link.colorRgb},0.2)`;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `rgba(${link.colorRgb},0.12)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem',
                    flexShrink: 0,
                  }}>
                    {link.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                      {link.label}
                    </div>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                    }}>
                      {link.value}
                    </div>
                  </div>
                  <span style={{
                    marginLeft: 'auto',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                  }}>
                    →
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card"
          >
            <span className="section-label">Message Me</span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 700,
              margin: '0.5rem 0 0.75rem',
            }}>
              Send a Message
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.65 }}>
              Have a question, a collaboration idea, or just want to say hi? I'll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Your Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="e.g. Rahul Sharma"
                  style={inputStyle(errors.name)}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.name ? 'var(--accent-pink)' : 'var(--border)'; }}
                />
                {errors.name && <p style={{ color: 'var(--accent-pink)', fontSize: '0.75rem', marginTop: 4 }}>{errors.name.message}</p>}
              </div>

              <div>
                <label style={labelStyle}>Your Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                  })}
                  placeholder="you@example.com"
                  style={inputStyle(errors.email)}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.email ? 'var(--accent-pink)' : 'var(--border)'; }}
                />
                {errors.email && <p style={{ color: 'var(--accent-pink)', fontSize: '0.75rem', marginTop: 4 }}>{errors.email.message}</p>}
              </div>

              <div>
                <label style={labelStyle}>Subject</label>
                <input
                  {...register('subject')}
                  placeholder="e.g. Internship Opportunity / Collaboration"
                  style={inputStyle(false)}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>

              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows={5}
                  placeholder="Write your message here..."
                  style={{ ...inputStyle(errors.message), resize: 'vertical', minHeight: 120 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.message ? 'var(--accent-pink)' : 'var(--border)'; }}
                />
                {errors.message && <p style={{ color: 'var(--accent-pink)', fontSize: '0.75rem', marginTop: 4 }}>{errors.message.message}</p>}
              </div>

              <MagneticSubmit loading={isSubmitting} success={isSubmitSuccessful}>
                Send Message ✉
              </MagneticSubmit>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
