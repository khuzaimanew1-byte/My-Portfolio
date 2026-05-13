import { useEffect, useRef, useState } from "react";

type Section = "hero" | "about" | "skills" | "projects" | "contact" | "default";

interface Atmo {
  r: number; g: number; b: number;
  r2: number; g2: number; b2: number;
  strength: number;
}

/* primary teal ≈ rgb(37,208,208), warm amber, indigo, violet */
const ATMO: Record<Section, Atmo> = {
  hero:     { r: 37,  g: 208, b: 208, r2: 37,  g2: 208, b2: 208, strength: 1.00 },
  about:    { r: 245, g: 158, b: 11,  r2: 37,  g2: 208, b2: 208, strength: 0.55 },
  skills:   { r: 37,  g: 208, b: 208, r2: 99,  g2: 102, b2: 241, strength: 1.30 },
  projects: { r: 124, g: 58,  b: 237, r2: 37,  g2: 208, b2: 208, strength: 0.90 },
  contact:  { r: 37,  g: 208, b: 208, r2: 20,  g2: 184, b2: 166, strength: 0.75 },
  default:  { r: 37,  g: 208, b: 208, r2: 37,  g2: 208, b2: 208, strength: 0.85 },
};

/* section index → name (matches DOM order of <section> elements) */
const SECTION_MAP: Record<number, Section> = {
  0: "hero",
  1: "about",
  2: "skills",
  3: "default",   // philosophy
  4: "projects",
  5: "default",   // github
  6: "contact",
};

interface NNode {
  x: number; y: number;
  bx: number; by: number; /* base/natural position for sinusoidal drift */
  vx: number; vy: number;
  phase: number;
  ampX: number; ampY: number;
  freq: number;
  radius: number;
  opacity: number;
}

export function CinematicBackground() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const mouseRef     = useRef<{ x: number; y: number } | null>(null);
  const nodesRef     = useRef<NNode[]>([]);
  const targetRef    = useRef<Atmo>({ ...ATMO.hero });
  const currRef      = useRef<Atmo>({ ...ATMO.hero });
  const ratioMapRef  = useRef<Record<number, number>>({});
  const [section, setSection] = useState<Section>("hero");

  /* ── IntersectionObserver: track which section is most visible ── */
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Array.from(sections).indexOf(entry.target as HTMLElement);
          ratioMapRef.current[idx] = entry.intersectionRatio;
        }
        let bestIdx = 0, bestRatio = 0;
        for (const [idxStr, ratio] of Object.entries(ratioMapRef.current)) {
          if (ratio > bestRatio) { bestRatio = ratio; bestIdx = parseInt(idxStr); }
        }
        const s = SECTION_MAP[bestIdx] ?? "default";
        setSection(s);
        targetRef.current = ATMO[s];
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  /* ── Seed neural nodes ── */
  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    nodesRef.current = Array.from({ length: 22 }, () => {
      const x = Math.random() * W;
      const y = Math.random() * H;
      return {
        x, y, bx: x, by: y,
        vx: 0, vy: 0,
        phase:  Math.random() * Math.PI * 2,
        ampX:   22 + Math.random() * 55,
        ampY:   18 + Math.random() * 48,
        freq:   0.00022 + Math.random() * 0.00032,
        radius: 1.1 + Math.random() * 2.3,
        opacity: 0.09 + Math.random() * 0.19,
      };
    });
  }, []);

  /* ── rAF canvas loop ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const EDGE_DIST    = 195;
    const MOUSE_RADIUS = 145;
    const COLOR_LERP   = 0.016;

    let raf: number;

    const loop = (t: number) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* smooth atmosphere color interpolation */
      const tgt = targetRef.current;
      const cur = currRef.current;
      cur.r        += (tgt.r        - cur.r)        * COLOR_LERP;
      cur.g        += (tgt.g        - cur.g)        * COLOR_LERP;
      cur.b        += (tgt.b        - cur.b)        * COLOR_LERP;
      cur.r2       += (tgt.r2       - cur.r2)       * COLOR_LERP;
      cur.g2       += (tgt.g2       - cur.g2)       * COLOR_LERP;
      cur.b2       += (tgt.b2       - cur.b2)       * COLOR_LERP;
      cur.strength += (tgt.strength - cur.strength) * COLOR_LERP;

      const { r, g, b, strength } = cur;
      const ri = r | 0, gi = g | 0, bi = b | 0;

      const nodes = nodesRef.current;
      const m = mouseRef.current;

      /* update node physics */
      for (const n of nodes) {
        const natX = n.bx + Math.sin(t * n.freq + n.phase) * n.ampX;
        const natY = n.by + Math.cos(t * n.freq * 0.71 + n.phase) * n.ampY;
        let tx = natX, ty = natY;

        if (m) {
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 1) {
            const frac = 1 - dist / MOUSE_RADIUS;
            const push = frac * frac * 34;
            tx += (dx / dist) * push;
            ty += (dy / dist) * push;
          }
        }

        const ax = (tx - n.x) * 0.036;
        const ay = (ty - n.y) * 0.036;
        n.vx = (n.vx + ax) * 0.91;
        n.vy = (n.vy + ay) * 0.91;
        n.x += n.vx;
        n.y += n.vy;
      }

      /* draw edges */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b2 = nodes[j];
          const dx = a.x - b2.x;
          const dy = a.y - b2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < EDGE_DIST) {
            const alpha = (1 - dist / EDGE_DIST) * 0.075 * strength;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.strokeStyle = `rgba(${ri},${gi},${bi},${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      /* draw nodes */
      for (const n of nodes) {
        const alpha = n.opacity * strength;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ri},${gi},${bi},${alpha.toFixed(3)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  /* ── Global mouse tracking ── */
  useEffect(() => {
    const onMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouseRef.current = null; };
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const atmo = ATMO[section];

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>

      {/* Layer 1 — deep cinematic gradient atmosphere (section-aware) */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(ellipse 130% 70% at 65% 28%, rgba(${atmo.r},${atmo.g},${atmo.b},0.10) 0%, transparent 55%)`,
            `radial-gradient(ellipse 80% 80% at 18% 78%, rgba(${atmo.r2},${atmo.g2},${atmo.b2},0.07) 0%, transparent 60%)`,
          ].join(","),
          transition: "background 3s ease",
        }}
      />

      {/* Layer 2 — slow drifting ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div style={{
          position: "absolute", borderRadius: "50%",
          width: 660, height: 660,
          top: "-22%", left: "42%",
          background: `radial-gradient(circle, rgba(${atmo.r},${atmo.g},${atmo.b},0.075) 0%, transparent 70%)`,
          filter: "blur(72px)",
          animation: "cinOrb1 25s ease-in-out infinite alternate",
          transition: "background 3s ease",
          willChange: "transform",
        }} />
        <div style={{
          position: "absolute", borderRadius: "50%",
          width: 540, height: 540,
          bottom: "-16%", left: "4%",
          background: `radial-gradient(circle, rgba(${atmo.r2},${atmo.g2},${atmo.b2},0.065) 0%, transparent 70%)`,
          filter: "blur(82px)",
          animation: "cinOrb2 31s ease-in-out infinite alternate",
          transition: "background 3s ease",
          willChange: "transform",
        }} />
        <div style={{
          position: "absolute", borderRadius: "50%",
          width: 400, height: 400,
          top: "42%", right: "2%",
          background: `radial-gradient(circle, rgba(${atmo.r},${atmo.g},${atmo.b},0.052) 0%, transparent 70%)`,
          filter: "blur(58px)",
          animation: "cinOrb3 20s ease-in-out infinite alternate",
          transition: "background 3s ease",
          willChange: "transform",
        }} />
      </div>

      {/* Layer 3 — ultra-subtle neural dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(${atmo.r},${atmo.g},${atmo.b},0.20) 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
          opacity: 0.20,
          transition: "background-image 3s ease",
        }}
      />

      {/* Layer 4 — floating transparent depth panels */}
      <div className="absolute inset-0 overflow-hidden">
        <div style={{
          position: "absolute",
          width: 255, height: 165,
          top: "13%", left: "1.5%",
          background: `rgba(${atmo.r},${atmo.g},${atmo.b},0.015)`,
          border: `1px solid rgba(${atmo.r},${atmo.g},${atmo.b},0.042)`,
          borderRadius: 14,
          animation: "cinPanel1 27s ease-in-out infinite alternate",
          transform: "rotate(-9deg)",
          transition: "background 3s ease, border-color 3s ease",
        }} />
        <div style={{
          position: "absolute",
          width: 188, height: 126,
          bottom: "17%", right: "2.5%",
          background: `rgba(${atmo.r2},${atmo.g2},${atmo.b2},0.012)`,
          border: `1px solid rgba(${atmo.r2},${atmo.g2},${atmo.b2},0.032)`,
          borderRadius: 11,
          animation: "cinPanel2 34s ease-in-out infinite alternate",
          transform: "rotate(6deg)",
          transition: "background 3s ease, border-color 3s ease",
        }} />
        <div style={{
          position: "absolute",
          width: 148, height: 92,
          top: "61%", left: "17%",
          background: `rgba(${atmo.r},${atmo.g},${atmo.b},0.010)`,
          border: `1px solid rgba(${atmo.r},${atmo.g},${atmo.b},0.027)`,
          borderRadius: 9,
          animation: "cinPanel3 22s ease-in-out infinite alternate",
          transform: "rotate(-3deg)",
          transition: "background 3s ease, border-color 3s ease",
        }} />
        {/* HUD accent line — top right */}
        <div style={{
          position: "absolute",
          width: 120, height: 1,
          top: "8%", right: "8%",
          background: `linear-gradient(90deg, transparent, rgba(${atmo.r},${atmo.g},${atmo.b},0.25), transparent)`,
          animation: "cinLine1 16s ease-in-out infinite alternate",
          transition: "background 3s ease",
        }} />
        {/* HUD accent line — bottom left */}
        <div style={{
          position: "absolute",
          width: 88, height: 1,
          bottom: "12%", left: "6%",
          background: `linear-gradient(90deg, transparent, rgba(${atmo.r2},${atmo.g2},${atmo.b2},0.20), transparent)`,
          animation: "cinLine2 20s ease-in-out infinite alternate",
          transition: "background 3s ease",
        }} />
      </div>

      {/* Layer 5 — neural canvas (nodes + edges + cursor interaction) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Layer 6 — atmospheric vignette / pulse */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 22%, rgba(4,6,10,0.74) 100%)",
        }}
      />

      <style>{`
        @keyframes cinOrb1 {
          0%   { transform: translate(0px,0px) scale(1); }
          100% { transform: translate(-75px,58px) scale(1.13); }
        }
        @keyframes cinOrb2 {
          0%   { transform: translate(0px,0px) scale(1.07); }
          100% { transform: translate(58px,-48px) scale(0.92); }
        }
        @keyframes cinOrb3 {
          0%   { transform: translate(0px,0px); }
          100% { transform: translate(-38px,70px) scale(1.10); }
        }
        @keyframes cinPanel1 {
          0%   { transform: rotate(-9deg) translate(0px,0px); opacity:0.55; }
          100% { transform: rotate(-7deg) translate(11px,17px); opacity:1; }
        }
        @keyframes cinPanel2 {
          0%   { transform: rotate(6deg) translate(0px,0px); opacity:0.45; }
          100% { transform: rotate(8deg) translate(-14px,10px); opacity:0.9; }
        }
        @keyframes cinPanel3 {
          0%   { transform: rotate(-3deg) translate(0px,0px); opacity:0.5; }
          100% { transform: rotate(-5deg) translate(8px,-12px); opacity:1; }
        }
        @keyframes cinLine1 {
          0%   { transform: scaleX(0.6) translateX(-10px); opacity:0.5; }
          100% { transform: scaleX(1.2) translateX(10px); opacity:1; }
        }
        @keyframes cinLine2 {
          0%   { transform: scaleX(1.1) translateX(5px); opacity:0.6; }
          100% { transform: scaleX(0.7) translateX(-8px); opacity:1; }
        }
      `}</style>
    </div>
  );
}
