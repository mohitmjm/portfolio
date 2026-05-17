import { useRef, useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Education from '../components/Education';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Contact from '../components/Contact';

export default function Home({ setActiveSection }) {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useEffect(() => {
    if (setActiveSection) {
      const sections = document.querySelectorAll('section[id], header[id]');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) setActiveSection(entry.target.id);
          });
        },
        { threshold: 0.35 }
      );
      sections.forEach(s => observer.observe(s));
      return () => observer.disconnect();
    }
  }, [setActiveSection]);

  return (
    <main>
      <Hero mouse={mouse} />
      <About />
      <Skills />
      <Education />
      <Experience />
      <Projects />
      <Contact />
    </main>
  );
}
