import { useRef, useEffect } from 'react';

/*
 * NeuralBackground — a living canvas backdrop.
 *  - drifting aurora gradient mesh (4 colour blobs, additive)
 *  - a soft neural grid of oscillating nodes + connections
 *  - mouse-reactive glow
 *  - tiny energy particles trailing the cursor
 *
 * Intensity rises while code runs (read from activityRef so we never restart
 * the animation loop). DPR is capped and the loop pauses when the tab hides,
 * to stay comfortably at 60fps.
 */

const PALETTE = ['#3b82f6', '#6366f1', '#8b5cf6', '#06b6d4'];

function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export default function NeuralBackground({ activityRef, theme = 'dark' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes = [];
    const particles = [];
    const MAX_PARTICLES = 70;
    const mouse = { x: 0, y: 0, has: false };
    let spawnGate = 0;

    const blobs = PALETTE.map((color, i) => ({
      color,
      sx: 0.18 + i * 0.05,
      sy: 0.13 + i * 0.06,
      phase: (i * Math.PI) / 2,
    }));

    function buildNodes() {
      nodes = [];
      const gap = Math.max(110, Math.min(170, Math.round(w / 12)));
      for (let x = gap * 0.5; x < w + gap; x += gap) {
        for (let y = gap * 0.5; y < h + gap; y += gap) {
          nodes.push({ x0: x, y0: y, x, y, phase: Math.random() * Math.PI * 2, amp: gap * 0.18 });
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    function onMouse(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.has = true;
      const now = performance.now();
      if (!reduced && now - spawnGate > 16 && particles.length < MAX_PARTICLES) {
        spawnGate = now;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.2,
          life: 1,
          size: 1 + Math.random() * 1.6,
          color: PALETTE[(Math.random() * PALETTE.length) | 0],
        });
      }
    }

    let t = 0;
    let raf = 0;

    function draw() {
      const boost = activityRef?.current?.running ? 1.7 : 1;
      t += 0.0016 * (activityRef?.current?.running ? 2.2 : 1);
      ctx.clearRect(0, 0, w, h);

      // aurora gradient mesh (additive)
      ctx.globalCompositeOperation = 'lighter';
      const R = Math.max(w, h) * 0.55;
      for (const b of blobs) {
        const cx = w * 0.5 + Math.cos(t * b.sx * 6 + b.phase) * w * 0.32;
        const cy = h * 0.5 + Math.sin(t * b.sy * 6 + b.phase) * h * 0.34;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
        g.addColorStop(0, rgba(b.color, 0.1 * boost));
        g.addColorStop(1, rgba(b.color, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // neural grid
      ctx.globalCompositeOperation = 'source-over';
      const maxDist = 150;
      for (const n of nodes) {
        n.x = n.x0 + Math.cos(t * 6 + n.phase) * n.amp;
        n.y = n.y0 + Math.sin(t * 6 + n.phase * 1.3) * n.amp;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          if (dx > maxDist || dx < -maxDist || dy > maxDist || dy < -maxDist) continue;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.16 * boost;
            ctx.strokeStyle = rgba('#4f7bf0', alpha);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        let glow = 0;
        if (mouse.has) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d < 200) glow = (1 - d / 200) * 0.9;
        }
        ctx.fillStyle = rgba(glow > 0.05 ? '#8ab4ff' : '#3b5bdb', 0.25 + glow);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.3 + glow * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // mouse glow (additive)
      if (mouse.has) {
        ctx.globalCompositeOperation = 'lighter';
        const gr = 240;
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, gr);
        g.addColorStop(0, rgba('#22d3ee', 0.09 * boost));
        g.addColorStop(1, rgba('#22d3ee', 0));
        ctx.fillStyle = g;
        ctx.fillRect(mouse.x - gr, mouse.y - gr, gr * 2, gr * 2);
      }

      // particles (additive)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.004;
        p.life -= 0.02;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = rgba(p.color, p.life * 0.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(draw);
    }

    function start() {
      if (!raf) raf = requestAnimationFrame(draw);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    resize();
    if (reduced) {
      // single static frame
      mouse.has = false;
      draw();
      stop();
    } else {
      start();
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [activityRef, theme]);

  return <canvas ref={canvasRef} className="pyc-bg-canvas" aria-hidden="true" />;
}
