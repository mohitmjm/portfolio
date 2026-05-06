import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiLinkedin, FiGithub, FiInstagram } from 'react-icons/fi';
import { FiBookOpen } from 'react-icons/fi';

const contactLinks = [
  {
    id: 'email-personal',
    icon: FiMail,
    label: 'Personal Email',
    value: 'mohitjmohatkar@gmail.com',
    href:  'mailto:mohitjmohatkar@gmail.com',
    color: 'var(--accent-primary)', colorRgb: '59,130,246',
  },
  {
    id: 'email-college',
    icon: FiBookOpen,
    label: 'College Email',
    value: 'mohatkarmj@rknec.edu',
    href:  'mailto:mohatkarmj@rknec.edu',
    color: 'var(--accent-cyan)', colorRgb: '6,182,212',
  },
  {
    id: 'linkedin',
    icon: FiLinkedin,
    label: 'LinkedIn',
    value: 'mohit-mohatkar',
    href:  'https://www.linkedin.com/in/mohit-mohatkar',
    color: '#0a66c2', colorRgb: '10,102,194',
  },
  {
    id: 'github',
    icon: FiGithub,
    label: 'GitHub',
    value: 'mohitmjm',
    href:  'https://github.com/mohitmjm',
    color: 'var(--text-secondary)', colorRgb: '139,163,194',
  },
  {
    id: 'instagram',
    icon: FiInstagram,
    label: 'Instagram',
    value: '@mohitmohatkar',
    href:  'https://www.instagram.com/mohitmohatkar/',
    color: '#e1306c', colorRgb: '225,48,108',
  },
];

/* ── Floating Label Input ─────────────────────────────────────────────────── */
function FloatingInput({ id, label, type = 'text', register, error, rows }) {
  const [focused,   setFocused]   = useState(false);
  const [hasValue,  setHasValue]  = useState(false);
  const [charCount, setCharCount] = useState(0);
  const isTextarea  = Boolean(rows);
  const isFloating  = focused || hasValue;

  const sharedStyle = {
    width: '100%',
    background: 'rgba(0,0,0,0.18)',
    border: `1px solid ${error ? 'var(--accent-pink)' : focused ? 'var(--accent-primary)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    padding: isTextarea ? '24px 16px 10px' : '22px 16px 8px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    outline: 'none',
    resize: isTextarea ? 'vertical' : 'none',
    minHeight: isTextarea ? 130 : 'auto',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused ? '0 0 14px rgba(59,130,246,0.15)' : 'none',
  };

  const regObj = register(id, {
    onChange: e => {
      setHasValue(e.target.value.length > 0);
      if (isTextarea) setCharCount(e.target.value.length);
    },
  });

  return (
    <div style={{ position: 'relative' }}>
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: 16,
          top: isFloating ? '7px' : '50%',
          transform: isTextarea
            ? 'none'
            : isFloating ? 'none' : 'translateY(-50%)',
          fontSize: isFloating ? '0.65rem' : '0.85rem',
          color:    isFloating ? 'var(--accent-primary)' : 'var(--text-muted)',
          fontWeight: isFloating ? 600 : 400,
          letterSpacing: isFloating ? '0.06em' : 0,
          textTransform: isFloating ? 'uppercase' : 'none',
          transition: 'all 0.22s ease',
          pointerEvents: 'none',
          zIndex: 1,
          fontFamily: 'var(--font-sans)',
        }}
      >
        {label}
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          rows={rows}
          {...regObj}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      ) : (
        <input
          id={id}
          type={type}
          {...regObj}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      )}

      {isTextarea && (
        <span style={{
          position: 'absolute', bottom: 8, right: 12,
          fontSize: '0.65rem', color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          {charCount}
        </span>
      )}
      {error && (
        <p style={{ color: 'var(--accent-pink)', fontSize: '0.72rem', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          // {error.message}
        </p>
      )}
    </div>
  );
}

/* ── Magnetic Submit ──────────────────────────────────────────────────────── */
function MagneticSubmit({ children, loading, success }) {
  const btnRef = useRef(null);

  const onMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width  / 2);
    const dy = e.clientY - (rect.top  + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      const s = (80 - dist) / 80;
      btn.style.transform = `translate(${dx * s * 0.35}px, ${dy * s * 0.35}px)`;
    }
  };

  const onLeave = () => {
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
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="btn-primary"
      style={{
        width: '100%', justifyContent: 'center',
        fontSize: '0.95rem', padding: '14px 28px',
        opacity: loading ? 0.7 : 1,
        background: success
          ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
          : undefined,
      }}
    >
      {loading ? '⏳ Sending...' : success ? '✅ Message Sent!' : children}
    </button>
  );
}

/* ── Contact Section ──────────────────────────────────────────────────────── */
export default function Contact() {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();

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

  return (
    <section id="contact" style={{ paddingTop: 96, paddingBottom: 96, background: 'rgba(59,130,246,0.015)' }}>
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
            fontWeight: 800, marginTop: '0.5rem',
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
          gap: '2rem', alignItems: 'start',
        }}>
          {/* Contact Links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-links-col"
          >
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem', fontWeight: 700,
              marginBottom: '1.25rem', color: 'var(--text-primary)',
            }}>
              Reach Me At
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {contactLinks.map((link, i) => (
                <motion.a
                  key={link.id} id={link.id}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: '1rem', padding: '0.9rem 1.25rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backdropFilter: 'blur(24px)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = link.color;
                    e.currentTarget.style.boxShadow   = `0 4px 24px rgba(${link.colorRgb},0.2)`;
                    e.currentTarget.style.transform   = 'translateX(5px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow   = 'none';
                    e.currentTarget.style.transform   = 'translateX(0)';
                  }}
                >
                  <div style={{
                    width: 42, height: 42,
                    borderRadius: 10,
                    background: `rgba(${link.colorRgb},0.12)`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                    color: link.color,
                  }}>
                    <link.icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>{link.label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{link.value}</div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
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
            className="card contact-form-col"
          >
            <span className="section-label">Message Me</span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem', fontWeight: 700,
              margin: '0.5rem 0 0.75rem',
            }}>
              Send a Message
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.65 }}>
              Have a question, a collaboration idea, or just want to say hi? I'll get back to you ASAP.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <FloatingInput
                id="name"
                label="Your Name"
                register={(id) => register(id, { required: 'Name is required' })}
                error={errors.name}
              />
              <FloatingInput
                id="email"
                label="Your Email"
                type="email"
                register={(id) => register(id, {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
                error={errors.email}
              />
              <FloatingInput
                id="subject"
                label="Subject"
                register={(id) => register(id)}
                error={null}
              />
              <FloatingInput
                id="message"
                label="Message"
                rows={5}
                register={(id) => register(id, { required: 'Message is required' })}
                error={errors.message}
              />
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
