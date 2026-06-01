import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { reportData } from '../data/reportData';
import { smartHRData } from '../data/smartHR';

const TEAL = '#1D9E75', PURPLE = '#7F77DD', AMBER = '#BA7517';

// ratio: css aspect-ratio string. 'auto' = use contain with max-height
const modules = [
  { data: smartHRData[0],  category: 'employee', ratio: 'portrait', title: 'Employee Portal Sidebar',        sidebarGroup: 'Employee Portal' },
  { data: smartHRData[1],  category: 'admin',    ratio: 'portrait', title: 'Admin Portal Sidebar',           sidebarGroup: 'Employee Portal' },
  { data: smartHRData[2],  category: 'employee', ratio: '16/7',     title: 'Login Page',                     sidebarGroup: 'Employee Portal' },
  { data: smartHRData[3],  category: 'employee', ratio: '16/7',     title: 'Main Employee Dashboard',        sidebarGroup: 'Employee Portal' },
  { data: smartHRData[4],  category: 'employee', ratio: '16/7',     title: 'Scrolled Dashboard View',        sidebarGroup: 'Employee Portal' },
  { data: smartHRData[5],  category: 'employee', ratio: 'contain',  title: 'Quick Actions & Voice Assistant',sidebarGroup: 'Employee Portal' },
  { data: smartHRData[6],  category: 'employee', ratio: '16/7',     title: 'Attendance',                     sidebarGroup: 'Employee Portal' },
  { data: smartHRData[7],  category: 'employee', ratio: '16/7',     title: 'Leave Balance Management',       sidebarGroup: 'Employee Portal' },
  { data: smartHRData[8],  category: 'employee', ratio: '16/7',     title: 'Profile View',                   sidebarGroup: 'Employee Portal' },
  { data: smartHRData[9],  category: 'employee', ratio: '16/7',     title: 'Employee Chat',                  sidebarGroup: 'Employee Portal' },
  { data: smartHRData[10], category: 'employee', ratio: '16/7',     title: 'HR Documents',                   sidebarGroup: 'Employee Portal' },
  { data: smartHRData[11], category: 'admin',    ratio: '16/7',     title: 'Admin Dashboard',                sidebarGroup: 'Admin Portal' },
  { data: smartHRData[12], category: 'admin',    ratio: '16/7',     title: 'Employee Management',            sidebarGroup: 'Admin Portal' },
  { data: smartHRData[13], category: 'admin',    ratio: '16/7',     title: 'Leave Management',               sidebarGroup: 'Admin Portal' },
  { data: smartHRData[14], category: 'admin',    ratio: '16/7',     title: 'Attendance Management',          sidebarGroup: 'Admin Portal' },
  { data: smartHRData[15], category: 'admin',    ratio: '16/7',     title: 'Attendance Sheet Export',        sidebarGroup: 'Admin Portal' },
  { data: smartHRData[16], category: 'admin',    ratio: '16/7',     title: 'Vacancy & Job Posting',          sidebarGroup: 'Admin Portal' },
  { data: smartHRData[17], category: 'ai',       ratio: '16/7',     title: 'AI Employee Analysis',           sidebarGroup: 'AI Analytics' },
  { data: smartHRData[18], category: 'ai',       ratio: '16/7',     title: 'AI Turnover Prediction',         sidebarGroup: 'AI Analytics' },
  { data: smartHRData[19], category: 'ai',       ratio: '16/7',     title: 'Yearly Holiday Trend',           sidebarGroup: 'AI Analytics' },
  { data: smartHRData[20], category: 'ai',       ratio: '16/7',     title: 'Monthly Holiday Trend',          sidebarGroup: 'AI Analytics' },
  { data: smartHRData[21], category: 'ai',       ratio: '16/7',     title: 'Holiday Reason Prediction',      sidebarGroup: 'AI Analytics' },
  { data: smartHRData[22], category: 'ai',       ratio: '16/7',     title: 'Risk & Mood Intelligence',       sidebarGroup: 'AI Analytics' },
  { data: smartHRData[23], category: 'ai',       ratio: '16/7',     title: 'Risk & Mood (Detailed)',         sidebarGroup: 'AI Analytics' },
  { data: smartHRData[24], category: 'ai',       ratio: '16/7',     title: 'Employee Mood Tracker',          sidebarGroup: 'AI Analytics' },
  { data: smartHRData[25], category: 'ai',       ratio: 'contain',  title: 'Mood Chatbot',                   sidebarGroup: 'AI Analytics' },
  { data: smartHRData[26], category: 'ai',       ratio: '16/7',     title: 'Priority Messages',              sidebarGroup: 'AI Analytics' },
];

const accent = { employee: TEAL, admin: PURPLE, ai: AMBER };
const badgeLabel = { employee: 'Employee', admin: 'Admin', ai: 'AI Analytics' };

export default function SmartHRPortal() {
  const [activeId, setActiveId] = useState('report');
  const [scrollPct, setScrollPct] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mainRef = useRef(null);

  // Monitor screen size and reset custom scroll on mount
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Monitor scrolling in main container
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      const pct = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
      setScrollPct(Math.min(100, pct * 100));

      const sections = el.querySelectorAll('section[data-id]');
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        // Section is active if it crosses top 40% of viewport
        if (rect.top < window.innerHeight * 0.4 && rect.bottom > 0) {
          setActiveId(s.getAttribute('data-id'));
        }
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Smooth scroll that stays inside the container (doesn't scroll window)
  const scrollTo = (id) => {
    const target = document.getElementById(id);
    const container = mainRef.current;
    if (target && container) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
      container.scrollTo({
        top: relativeTop - 24, // 24px spacing from top
        behavior: 'smooth'
      });
    }
    setSidebarOpen(false);
  };

  const C = accent;

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden', 
      fontFamily: "var(--font-sans)", 
      background: 'var(--bg-primary)', 
      color: 'var(--text-primary)',
      transition: 'background 0.4s ease, color 0.4s ease'
    }}>
      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 100, background: 'var(--border)' }}>
        <div style={{ height: '100%', width: `${scrollPct}%`, background: `linear-gradient(90deg, ${TEAL}, ${PURPLE}, ${AMBER})`, transition: 'width 0.1s' }} />
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 39, backdropFilter: 'blur(4px)' }} 
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 260, 
        minWidth: 260, 
        background: 'var(--bg-secondary)', 
        borderRight: '1px solid var(--border)',
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        overflow: 'hidden',
        position: isMobile ? 'fixed' : 'relative',
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        transition: 'transform 0.3s ease', 
        zIndex: 40, 
        top: 0, 
        left: 0,
        boxShadow: isMobile ? '4px 0 16px rgba(0,0,0,0.25)' : 'none'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700 }}>HR</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Smart HR Portal</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Project Documentation</div>
            </div>
          </Link>
        </div>

        {/* Nav list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {/* Quick jumps */}
          <div style={{ padding: '4px 12px', marginBottom: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', padding: '0 8px 6px' }}>Quick Jump</div>
            {[{ id: 'report', label: '📄 Project Report' }, { id: 'modules', label: '🖥️ Module Demos' }].map(j => (
              <button key={j.id} onClick={() => scrollTo(j.id)} style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: activeId === j.id ? 600 : 400,
                background: activeId === j.id ? 'rgba(29, 158, 117, 0.12)' : 'transparent',
                color: activeId === j.id ? TEAL : 'var(--text-secondary)', marginBottom: 2,
                transition: 'all 0.2s'
              }}>{j.label}</button>
            ))}
          </div>

          <div style={{ margin: '8px 12px', borderTop: '1px solid var(--border)' }} />

          {/* Module groups */}
          {['Employee Portal', 'Admin Portal', 'AI Analytics'].map(group => {
            const cat = group === 'Employee Portal' ? 'employee' : group === 'Admin Portal' ? 'admin' : 'ai';
            const groupModules = modules.filter(m => m.sidebarGroup === group);
            return (
              <div key={group} style={{ padding: '4px 12px', marginBottom: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: C[cat], padding: '0 8px 6px' }}>{group}</div>
                {groupModules.map((mod, i) => {
                  const id = `module-${modules.indexOf(mod)}`;
                  const isActive = activeId === id;
                  return (
                    <button key={i} onClick={() => scrollTo(id)} style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '7px 12px', borderRadius: 8,
                      border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                      background: isActive ? `${C[cat]}16` : 'transparent',
                      color: isActive ? C[cat] : 'var(--text-secondary)', 
                      borderLeft: isActive ? `3px solid ${C[cat]}` : '3px solid transparent',
                      marginBottom: 1, transition: 'all 0.15s'
                    }}>{mod.title}</button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <Link to="/" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            ← Back to Portfolio
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Mobile topbar */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 30, 
          background: 'var(--bg-secondary)', 
          borderBottom: '1px solid var(--border)', 
          padding: '12px 20px', 
          display: isMobile ? 'flex' : 'none', 
          alignItems: 'center', 
          gap: 12 
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-primary)' }}>☰</button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Smart HR Portal</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>— Project Documentation</span>
          </div>
          <Link to="/" style={{ fontSize: 13, color: TEAL, textDecoration: 'none', fontWeight: 500 }}>← Portfolio</Link>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%', padding: '48px 32px 80px' }}>

          {/* ═══════════════════════════════════════════
              SECTION 1: PROJECT REPORT
          ═══════════════════════════════════════════ */}
          <section data-id="report" id="report">
            {/* Hero */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, background: `${TEAL}18`, color: TEAL, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase', border: `1px solid ${TEAL}25` }}>
                Full-Stack HR Platform
              </div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px', lineHeight: 1.15, fontFamily: 'var(--font-display)' }}>
                {reportData.title}
              </h1>
              <p style={{ fontSize: 18, color: 'var(--text-secondary)', fontWeight: 400, margin: '0 0 28px', lineHeight: 1.5 }}>
                {reportData.subtitle}
              </p>
              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
                <a
                  href={reportData.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                >
                  <span style={{ fontSize: 16 }}>🚀</span> View Live Project
                </a>
                <a
                  href={reportData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ pointerEvents: 'none' }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                  GitHub Repo
                </a>
              </div>
              {/* Tech badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Next.js 14','TypeScript','Supabase','Clerk Auth','Gemini AI','Recharts','LangGraph','Framer Motion'].map(t => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>

            {/* Overview cards */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 40 }}>
              <InfoCard title="🎯 Project Aim" color={TEAL} text={reportData.aim} />
              <InfoCard title="💡 Solution" color={PURPLE} text={reportData.solution} />
            </div>

            {/* Objectives */}
            <ReportBlock title="📋 Objectives">
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px 24px' }}>
                {reportData.objectives.map((o, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <span style={{ color: TEAL, fontWeight: 700, marginTop: 2 }}>✓</span>{o}
                  </li>
                ))}
              </ul>
            </ReportBlock>

            {/* Methodology */}
            <ReportBlock title="🔬 Methodology">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reportData.methodology.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: TEAL, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{m.step}</div>
                      <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{m.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ReportBlock>

            {/* Key Highlights */}
            <ReportBlock title="⚡ Key Highlights">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                {reportData.keyHighlights.map((h, i) => (
                  <div key={i} style={{ padding: '16px 20px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg-secondary)', transition: 'border-color 0.2s, box-shadow 0.2s' }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{h.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{h.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{h.desc}</div>
                  </div>
                ))}
              </div>
            </ReportBlock>

            {/* Tech Stack */}
            <ReportBlock title="🛠️ Technology Stack">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {reportData.techStack.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: TEAL, minWidth: isMobile ? 120 : 200, flexShrink: 0 }}>{t.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>— {t.purpose}</span>
                  </div>
                ))}
              </div>
            </ReportBlock>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 2: MODULE DEMOS
          ═══════════════════════════════════════════ */}
          <section data-id="modules" id="modules" style={{ marginTop: 72 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 6 }}>Live Screenshots</div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-display)' }}>Module Demonstrations</h2>
              </div>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
              {modules.map((mod, idx) => {
                const cat = mod.category;
                const ac = C[cat];
                const id = `module-${idx}`;
                const techItems = (mod.data.technology || '').split(',').map(t => t.trim()).filter(Boolean);

                return (
                  <section key={idx} data-id={id} id={id} style={{ scrollMarginTop: 80 }}>
                    {/* Heading row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: ac, marginBottom: 6 }}>{badgeLabel[cat]} Portal</div>
                        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>{mod.title}</h2>
                      </div>
                      <span style={{ padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: ac, background: `${ac}16`, border: `1px solid ${ac}30`, flexShrink: 0, marginTop: 4 }}>{badgeLabel[cat]}</span>
                    </div>

                    {/* Screenshot — ratio-aware display */}
                    {mod.ratio === 'portrait' ? (
                      /* Portrait sidebars: show side-by-side with description */
                      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 24, alignItems: 'flex-start', marginBottom: 24, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ width: 220, margin: isMobile ? '0 auto' : '0', flexShrink: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                          <img src={mod.data.image} alt={mod.title} style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{mod.data.description}</div>
                          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>This is a mobile sidebar screenshot — shown in its native portrait orientation.</div>
                        </div>
                      </div>
                    ) : mod.ratio === 'contain' ? (
                      /* Contain: show image at natural size centered */
                      <div style={{ width: '100%', maxHeight: 480, overflow: 'hidden', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={mod.data.image} alt={mod.title} style={{ maxWidth: '100%', maxHeight: 480, objectFit: 'contain', display: 'block' }} loading="lazy" />
                      </div>
                    ) : (
                      /* Standard 16:7 landscape */
                      <div style={{ width: '100%', aspectRatio: '16/7', overflow: 'hidden', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
                        <img src={mod.data.image} alt={mod.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }} loading="lazy" />
                      </div>
                    )}

                    {/* Description & specs Card */}
                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: isMobile ? '20px 24px' : '28px 32px', boxShadow: 'var(--shadow-sm)' }}>
                      {/* Description */}
                      <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, margin: '0 0 20px', borderBottom: '1px solid var(--border)', paddingBottom: 20 }}>
                        {mod.data.description}
                      </p>

                      {/* Features */}
                      <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>Capabilities</div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {(mod.data.features || []).map((f, i) => (
                          <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: ac, flexShrink: 0, marginTop: 7 }} />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* Tech */}
                      {techItems.length > 0 && (
                        <>
                          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>Technology Used</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {techItems.map((tech, i) => {
                                const [name, ...rest] = tech.split('(');
                                const note = rest.length ? '(' + rest.join('(') : '';
                                return (
                                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)' }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: ac, flexShrink: 0, marginTop: 6 }} />
                                    <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                                      <strong style={{ color: 'var(--text-primary)' }}>{name.trim()}</strong>
                                      {note && <span style={{ color: 'var(--text-muted)' }}> ({note.replace(/^\(/, '').replace(/\)$/, '')})</span>}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Divider */}
                    {idx < modules.length - 1 && (
                      <div style={{ marginTop: 64, height: 1, background: 'linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent)' }} />
                    )}
                  </section>
                );
              })}
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              SECTION 3: CONTACT FORM
          ═══════════════════════════════════════════ */}
          <ContactSection isMobile={isMobile} />

        </div>
      </main>
    </div>
  );
}

// ── Small helper components ──────────────────────────────────────────────────
function InfoCard({ title, color, text }) {
  return (
    <div style={{ padding: '24px 28px', border: `1px solid ${color}25`, borderRadius: 14, background: `${color}08`, borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 10 }}>{title}</div>
      <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{text}</p>
    </div>
  );
}

function ReportBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 32, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 32px', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px', fontFamily: 'var(--font-display)' }}>{title}</h3>
      {children}
    </div>
  );
}

// ── Contact Section ─────────────────────────────────────────────
const contactLinks = [
  { icon: '✉', label: 'Personal Email', value: 'mohitjmohatkar@gmail.com', href: 'mailto:mohitjmohatkar@gmail.com', color: '#3b82f6' },
  { icon: '🎓', label: 'College Email',  value: 'mohatkarmj@rknec.edu',     href: 'mailto:mohatkarmj@rknec.edu',    color: '#06b6d4' },
  { icon: '💼', label: 'LinkedIn',       value: 'mohit-mohatkar',           href: 'https://www.linkedin.com/in/mohit-mohatkar', color: '#0a66c2' },
  { icon: '🐱', label: 'GitHub',         value: 'mohitmjm',                 href: 'https://github.com/mohitmjm',   color: '#374151' },
  { icon: '📸', label: 'Instagram',      value: '@mohitmohatkar',           href: 'https://www.instagram.com/mohitmohatkar/', color: '#e1306c' },
];

function ThemeAwareInput({ id, label, type = 'text', register, error, rows }) {
  const [focused, setFocused] = useState(false);
  const [hasVal, setHasVal] = useState(false);
  const floating = focused || hasVal;
  const isTA = Boolean(rows);
  const border = error ? '#ef4444' : focused ? '#1D9E75' : 'var(--border)';
  const base = {
    width: '100%', 
    border: `1.5px solid ${border}`, 
    borderRadius: 10,
    padding: isTA ? '22px 14px 10px' : '20px 14px 6px',
    fontSize: 14, 
    color: 'var(--text-primary)', 
    outline: 'none', 
    background: 'var(--bg-secondary)',
    fontFamily: 'inherit', 
    resize: isTA ? 'vertical' : 'none',
    minHeight: isTA ? 120 : 'auto',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    boxShadow: focused ? '0 0 0 3px rgba(29,158,117,0.15)' : 'none',
    boxSizing: 'border-box',
  };
  const regObj = register(id, { onChange: e => setHasVal(e.target.value.length > 0) });
  return (
    <div style={{ position: 'relative' }}>
      <label htmlFor={id} style={{
        position: 'absolute', 
        left: 14,
        top: floating ? 6 : isTA ? 14 : '50%',
        transform: (!isTA && !floating) ? 'translateY(-50%)' : 'none',
        fontSize: floating ? 10 : 14, 
        fontWeight: floating ? 600 : 400,
        color: floating ? '#1D9E75' : 'var(--text-muted)',
        letterSpacing: floating ? '0.06em' : 0,
        textTransform: floating ? 'uppercase' : 'none',
        transition: 'all 0.2s', 
        pointerEvents: 'none', 
        zIndex: 1,
      }}>{label}</label>
      {isTA
        ? <textarea id={id} rows={rows} {...regObj} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={base} />
        : <input   id={id} type={type}  {...regObj} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={base} />}
      {error && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>⚠ {error.message}</p>}
    </div>
  );
}

function ContactSection({ isMobile }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm();
  const onSubmit = async (data) => {
    try {
      await fetch('https://formspree.io/f/xwpbjrdn', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data),
      });
      reset();
    } catch (e) { 
      console.error(e); 
    }
  };
  const TEAL = '#1D9E75';
  return (
    <div style={{ marginTop: 80, paddingTop: 64, borderTop: '2px solid var(--border)' }}>
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 8 }}>Get in Touch</div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>Let's <span style={{ color: TEAL }}>Connect</span></h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0 }}>Have a question or collaboration idea? I'd love to hear from you.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* Contact links */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Reach Me At</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {contactLinks.map((link, i) => (
              <a key={i} href={link.href} target={link.href.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 14, 
                  padding: '12px 16px', 
                  borderRadius: 12,
                  background: 'var(--bg-card)', 
                  border: '1.5px solid var(--border)', 
                  textDecoration: 'none', 
                  transition: 'all 0.18s' 
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.borderColor = link.color; 
                  e.currentTarget.style.transform = 'translateX(4px)'; 
                  e.currentTarget.style.boxShadow = `0 4px 16px ${link.color}22`; 
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.borderColor = 'var(--border)'; 
                  e.currentTarget.style.transform = 'translateX(0)'; 
                  e.currentTarget.style.boxShadow = 'none'; 
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 9, background: `${link.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{link.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{link.label}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 600 }}>{link.value}</div>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>Send a Message</h3>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>Have a question, collaboration idea, or just want to say hi? I'll get back to you ASAP.</p>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ThemeAwareInput id="name2"    label="Your Name"  register={id => register(id, { required: 'Name required' })}   error={errors.name2} />
            <ThemeAwareInput id="email2"   label="Your Email" type="email" register={id => register(id, { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} error={errors.email2} />
            <ThemeAwareInput id="subject2" label="Subject"    register={id => register(id)} error={null} />
            <ThemeAwareInput id="message2" label="Message"    rows={5} register={id => register(id, { required: 'Message required' })} error={errors.message2} />
            <button type="submit" disabled={isSubmitting || isSubmitSuccessful}
              style={{ 
                padding: '13px 24px', 
                borderRadius: 10, 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: 14, 
                fontWeight: 700,
                background: isSubmitSuccessful ? 'rgba(29, 158, 117, 0.1)' : TEAL,
                color: isSubmitSuccessful ? TEAL : '#fff',
                boxShadow: isSubmitSuccessful ? 'none' : `0 4px 14px ${TEAL}40`,
                transition: 'all 0.2s', 
                opacity: isSubmitting ? 0.7 : 1,
              }}
              onMouseEnter={e => { if(!isSubmitSuccessful) e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              {isSubmitting ? '⏳ Sending...' : isSubmitSuccessful ? '✅ Message Sent!' : 'Send Message ✉'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
