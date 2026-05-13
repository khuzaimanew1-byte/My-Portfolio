import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type RefObject,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  SiHtml5, SiJavascript, SiNodedotjs,
  SiExpress, SiMongodb, SiGit, SiOpenai, SiCss,
} from "react-icons/si";
import { FileCode2 } from "lucide-react";

/* ─── VS Code official icon ──────────────────────────────────── */
function VSCodeIcon({ size, active }: { size: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#007ACC"
      style={{ filter: active ? "drop-shadow(0 0 5px #007ACCaa)" : "none", transition: "filter .25s" }}>
      <path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.9 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  );
}

/* ─── node definitions ───────────────────────────────────────── */
interface NodeDef {
  id: string; name: string; color: string; role: string;
  x: number; y: number;           // % of container
  entryX: number; entryY: number; // intro translation in px
  stagger: number;                // ms from sectionInView
  floatY: [number, number]; dur: number;
  renderIcon: (active: boolean) => React.ReactNode;
}

const S = 25; // icon size

const nodes: NodeDef[] = [
  {
    id: "html", name: "HTML", color: "#E34F26",
    role: "Semantic structure & accessible markup",
    x: 7, y: 50, entryX: -160, entryY: 15,
    stagger: 0, floatY: [-6, 4], dur: 4.4,
    renderIcon: (a) => (
      <SiHtml5 size={S} style={{ color: "#E34F26", filter: a ? "drop-shadow(0 0 5px #E34F26bb)" : "none", transition: "filter .25s" }} />
    ),
  },
  {
    id: "css", name: "CSS3", color: "#264DE4",
    role: "Responsive layouts, animations & design systems",
    x: 21, y: 13, entryX: -90, entryY: -110,
    stagger: 120, floatY: [-5, 8], dur: 5.1,
    renderIcon: (a) => (
      <SiCss size={S} style={{ color: "#264DE4", filter: a ? "drop-shadow(0 0 5px #264DE4bb)" : "none", transition: "filter .25s" }} />
    ),
  },
  {
    id: "ejs", name: "EJS", color: "#B9473A",
    role: "Server-side JS templating for dynamic views",
    x: 20, y: 81, entryX: -90, entryY: 110,
    stagger: 210, floatY: [-8, 4], dur: 4.7,
    renderIcon: (a) => (
      <FileCode2 size={S} style={{ color: "#B9473A", filter: a ? "drop-shadow(0 0 5px #B9473Abb)" : "none", transition: "filter .25s" }} />
    ),
  },
  {
    id: "js", name: "JavaScript", color: "#F0DB4F",
    role: "ES6+, async logic, event-driven interaction",
    x: 42, y: 47, entryX: 10, entryY: 90,
    stagger: 380, floatY: [-5, 6], dur: 3.9,
    renderIcon: (a) => (
      <SiJavascript size={S} style={{ color: "#F0DB4F", filter: a ? "drop-shadow(0 0 5px #F0DB4Fbb)" : "none", transition: "filter .25s" }} />
    ),
  },
  {
    id: "nodejs", name: "Node.js", color: "#3C873A",
    role: "Server runtime, REST APIs, event loop",
    x: 62, y: 12, entryX: 20, entryY: -130,
    stagger: 490, floatY: [-9, 3], dur: 4.6,
    renderIcon: (a) => (
      <SiNodedotjs size={S} style={{ color: "#3C873A", filter: a ? "drop-shadow(0 0 5px #3C873Abb)" : "none", transition: "filter .25s" }} />
    ),
  },
  {
    id: "git", name: "Git", color: "#F05032",
    role: "Version control, branching, collaborative code",
    x: 58, y: 81, entryX: 20, entryY: 130,
    stagger: 590, floatY: [-4, 9], dur: 5.3,
    renderIcon: (a) => (
      <SiGit size={S} style={{ color: "#F05032", filter: a ? "drop-shadow(0 0 5px #F05032bb)" : "none", transition: "filter .25s" }} />
    ),
  },
  {
    id: "express", name: "Express.js", color: "#d8d8d8",
    role: "Routing, middleware, RESTful API patterns",
    x: 75, y: 44, entryX: 130, entryY: 0,
    stagger: 740, floatY: [-5, 5], dur: 4.2,
    renderIcon: (a) => (
      <SiExpress size={S} style={{ color: "#d8d8d8", filter: a ? "drop-shadow(0 0 5px #d8d8d8bb)" : "none", transition: "filter .25s" }} />
    ),
  },
  {
    id: "mongodb", name: "MongoDB", color: "#47A248",
    role: "Document storage, aggregation, schema design",
    x: 90, y: 16, entryX: 120, entryY: -100,
    stagger: 850, floatY: [-6, 7], dur: 3.8,
    renderIcon: (a) => (
      <SiMongodb size={S} style={{ color: "#47A248", filter: a ? "drop-shadow(0 0 5px #47A248bb)" : "none", transition: "filter .25s" }} />
    ),
  },
  {
    id: "vscode", name: "VS Code", color: "#007ACC",
    role: "Primary IDE — extensions, debugging, workflow",
    x: 91, y: 51, entryX: 155, entryY: 0,
    stagger: 960, floatY: [-5, 7], dur: 5.0,
    renderIcon: (a) => <VSCodeIcon size={S} active={a} />,
  },
  {
    id: "ai", name: "AI Dev", color: "#10a37f",
    role: "AI-assisted code review, rapid prototyping",
    x: 87, y: 83, entryX: 120, entryY: 100,
    stagger: 1070, floatY: [-7, 4], dur: 4.3,
    renderIcon: (a) => (
      <SiOpenai size={S} style={{ color: "#10a37f", filter: a ? "drop-shadow(0 0 5px #10a37fbb)" : "none", transition: "filter .25s" }} />
    ),
  },
];

interface EdgeDef { a: string; b: string; bend: number; }
const edges: EdgeDef[] = [
  { a: "html",    b: "css",     bend:  0.12 },
  { a: "html",    b: "ejs",     bend: -0.12 },
  { a: "css",     b: "js",      bend:  0.09 },
  { a: "ejs",     b: "js",      bend: -0.09 },
  { a: "js",      b: "nodejs",  bend:  0.11 },
  { a: "js",      b: "git",     bend: -0.11 },
  { a: "nodejs",  b: "express", bend:  0.09 },
  { a: "express", b: "mongodb", bend:  0.10 },
  { a: "express", b: "vscode",  bend: -0.07 },
  { a: "express", b: "ai",      bend: -0.10 },
];

// Edge reveal timings (ms) — fires just after both nodes have settled
const edgeRevealAt: Record<string, number> = {
  "html::css":          220,
  "html::ejs":          310,
  "css::js":            480,
  "ejs::js":            490,
  "js::nodejs":         580,
  "js::git":            680,
  "nodejs::express":    830,
  "express::mongodb":   940,
  "express::vscode":   1050,
  "express::ai":       1160,
};

const ek = (e: EdgeDef) => `${e.a}::${e.b}`;

/* ─── bezier path (pixel coords, edge-attached, not center) ──── */
const ICON_R = 16;

function buildPath(ax: number, ay: number, bx: number, by: number, bend: number): string {
  const dx = bx - ax, dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  if (len < ICON_R * 2 + 2) return "";
  const nx = dx / len, ny = dy / len;
  const px = -ny, py = nx;
  const sx = ax + nx * ICON_R, sy = ay + ny * ICON_R;
  const ex = bx - nx * ICON_R, ey = by - ny * ICON_R;
  const edLen = len - ICON_R * 2;
  const off = edLen * bend;
  const cp1x = sx + (ex - sx) * 0.3 + px * off, cp1y = sy + (ey - sy) * 0.3 + py * off;
  const cp2x = sx + (ex - sx) * 0.7 + px * off, cp2y = sy + (ey - sy) * 0.7 + py * off;
  const f = (n: number) => n.toFixed(1);
  return `M${f(sx)},${f(sy)} C${f(cp1x)},${f(cp1y)} ${f(cp2x)},${f(cp2y)} ${f(ex)},${f(ey)}`;
}

function getNode(id: string) { return nodes.find((n) => n.id === id)!; }

/* ─── hover state type ───────────────────────────────────────── */
interface HoverState { id: string | null; phase: 0 | 1 | 2 | 3 | 4; }
// phase 0 = none
// phase 1 = incoming edges activate
// phase 2 = self energizes
// phase 3 = outgoing edges activate
// phase 4 = connected nodes secondary + tooltip

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export function Skills() {
  /* ── refs ─── */
  const sectionRef   = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.22 });

  // Stable refs created once
  const nodeIconRefs = useRef<Record<string, { current: HTMLDivElement | null }>>(
    Object.fromEntries(nodes.map((n) => [n.id, { current: null }]))
  );
  const mainPathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const glowPathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const pulseRefs    = useRef<Record<string, HTMLDivElement | null>>({});
  const revealedRef  = useRef<Set<string>>(new Set());

  /* ── state ─── */
  const [nodesVisible, setNodesVisible] = useState<boolean[]>(() => nodes.map(() => false));
  const [hover, setHover] = useState<HoverState>({ id: null, phase: 0 });
  const hoverRef   = useRef<HoverState>(hover);
  hoverRef.current = hover;
  const hoverTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* ── section-inView: stagger node reveal + edge reveal ─── */
  useEffect(() => {
    if (!sectionInView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    nodes.forEach((node, i) => {
      timers.push(
        setTimeout(() => {
          setNodesVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, node.stagger)
      );
    });

    edges.forEach((edge) => {
      const key = ek(edge);
      const delay = edgeRevealAt[key] ?? 1200;
      timers.push(setTimeout(() => { revealedRef.current.add(key); }, delay));
    });

    return () => timers.forEach(clearTimeout);
  }, [sectionInView]);

  /* ── hover handlers ─── */
  const handleEnter = useCallback((id: string) => {
    hoverTimers.current.forEach(clearTimeout);
    hoverTimers.current = [];
    setHover({ id, phase: 1 });
    hoverTimers.current.push(setTimeout(() => setHover({ id, phase: 2 }), 70));
    hoverTimers.current.push(setTimeout(() => setHover({ id, phase: 3 }), 170));
    hoverTimers.current.push(setTimeout(() => setHover({ id, phase: 4 }), 280));
  }, []);

  const handleLeave = useCallback(() => {
    hoverTimers.current.forEach(clearTimeout);
    hoverTimers.current = [];
    setHover({ id: null, phase: 0 });
  }, []);

  /* ── rAF loop: read DOM, update SVG + pulses imperatively ─── */
  useEffect(() => {
    let raf: number;

    const loop = () => {
      const container = containerRef.current;
      if (!container) { raf = requestAnimationFrame(loop); return; }
      const cr = container.getBoundingClientRect();

      // read all node pixel centers (includes floating motion)
      const coords: Record<string, { x: number; y: number }> = {};
      for (const node of nodes) {
        const el = nodeIconRefs.current[node.id]?.current;
        if (!el) continue;
        const r = el.getBoundingClientRect();
        coords[node.id] = {
          x: r.left - cr.left + r.width / 2,
          y: r.top  - cr.top  + r.height / 2,
        };
      }

      const { id: hovId, phase } = hoverRef.current;

      for (const edge of edges) {
        const key = ek(edge);
        const ca = coords[edge.a], cb = coords[edge.b];
        if (!ca || !cb) continue;

        const d = buildPath(ca.x, ca.y, cb.x, cb.y, edge.bend);
        const isIncoming = edge.b === hovId; // target is hovered node
        const isOutgoing = edge.a === hovId; // source is hovered node
        const edgeActive =
          hovId !== null &&
          ((isIncoming && phase >= 1) || (isOutgoing && phase >= 3));
        const revealed = revealedRef.current.has(key);

        const activeNode = hovId ? getNode(hovId) : null;
        const lineColor  = activeNode?.color ?? "#2dd4bf";

        /* main path */
        const main = mainPathRefs.current[key];
        if (main && d) {
          main.setAttribute("d", d);
          main.style.stroke        = edgeActive ? lineColor : revealed ? "rgba(255,255,255,0.058)" : "transparent";
          main.style.strokeWidth   = edgeActive ? "0.85" : "0.42";
          main.style.strokeOpacity = "1";
        }

        /* glow path */
        const glow = glowPathRefs.current[key];
        if (glow && d) {
          glow.setAttribute("d", d);
          glow.style.stroke        = edgeActive ? lineColor : "transparent";
          glow.style.strokeWidth   = edgeActive ? "3.5" : "0";
          glow.style.strokeOpacity = edgeActive ? "0.10" : "0";
        }

        /* CSS motion-path pulse */
        const pulse = pulseRefs.current[key];
        if (pulse && d) {
          pulse.style.offsetPath = `path("${d}")`;
          if (edgeActive) {
            pulse.style.opacity    = "1";
            pulse.style.background = lineColor;
            pulse.style.boxShadow  = `0 0 5px 2px ${lineColor}55`;
            if (pulse.style.animationPlayState !== "running") {
              pulse.style.animation = `pulse-travel ${isIncoming ? "0.95s" : "1.2s"} linear infinite`;
            }
          } else {
            pulse.style.opacity           = "0";
            pulse.style.animationPlayState = "paused";
            pulse.style.animation         = "none";
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── render ─── */
  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden">
      {/* atmospheric depth */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 65% at 50% 50%, transparent 36%, rgba(4,8,14,0.65) 100%)",
      }} />

      <div className="container mx-auto px-6 relative z-10">

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Technical Arsenal
          </h2>
          <p className="text-muted-foreground text-lg">
            The tools and technologies powering every system I build.
          </p>
        </motion.div>

        {/* ── network stage ── */}
        <div
          ref={containerRef}
          className="relative max-w-5xl mx-auto select-none"
          style={{ paddingBottom: "52%" }}
          onMouseLeave={handleLeave}
        >
          {/* Layer 1 — SVG lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            {edges.map((edge) => {
              const key = ek(edge);
              return (
                <g key={key}>
                  <path ref={(el) => { glowPathRefs.current[key] = el; }}
                    fill="none" stroke="transparent" strokeWidth={0} strokeLinecap="round" />
                  <path ref={(el) => { mainPathRefs.current[key] = el; }}
                    fill="none" stroke="transparent" strokeWidth={0.42} strokeLinecap="round" />
                </g>
              );
            })}
          </svg>

          {/* Layer 2 — CSS motion-path pulses */}
          <div className="absolute inset-0 pointer-events-none" style={{ overflow: "hidden" }}>
            {edges.map((edge) => {
              const key = ek(edge);
              return (
                <div
                  key={key}
                  ref={(el) => { pulseRefs.current[key] = el; }}
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#2dd4bf", opacity: 0,
                    offsetDistance: "0%",
                  }}
                />
              );
            })}
          </div>

          {/* Layer 3 — nodes */}
          {nodes.map((node, i) => {
            const { id: hovId, phase } = hover;
            const isSelf        = hovId === node.id && phase >= 2;
            const isIncoming    = edges.some((e) => e.b === node.id && e.a === hovId) && phase >= 4;
            const isOutgoing    = edges.some((e) => e.a === node.id && e.b === hovId) && phase >= 4;
            const isConnected   = isIncoming || isOutgoing;
            const isDimmed      = hovId !== null && !isSelf && !isConnected;
            const tooltipReady  = hovId === node.id && phase >= 4;

            return (
              <NodeCard
                key={node.id}
                node={node}
                index={i}
                visible={nodesVisible[i]}
                isSelf={isSelf}
                isConnected={isConnected}
                isDimmed={isDimmed}
                tooltipReady={tooltipReady}
                iconRef={nodeIconRefs.current[node.id] as RefObject<HTMLDivElement>}
                onEnter={() => handleEnter(node.id)}
                onLeave={handleLeave}
              />
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse-travel {
          from { offset-distance: 0%; }
          to   { offset-distance: 100%; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NODE CARD
══════════════════════════════════════════════════════════════════ */
function NodeCard({
  node, index, visible,
  isSelf, isConnected, isDimmed, tooltipReady,
  iconRef, onEnter, onLeave,
}: {
  node: NodeDef; index: number; visible: boolean;
  isSelf: boolean; isConnected: boolean; isDimmed: boolean; tooltipReady: boolean;
  iconRef: RefObject<HTMLDivElement>;
  onEnter: () => void; onLeave: () => void;
}) {
  return (
    <div style={{
      position: "absolute",
      left: `${node.x}%`, top: `${node.y}%`,
      transform: "translate(-50%, -50%)",
      zIndex: isSelf ? 20 : isConnected ? 15 : 10,
    }}>
      {/* Entry animation + opacity dimming (one-shot spring) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.15, x: node.entryX, y: node.entryY }}
        animate={
          visible
            ? { opacity: isDimmed ? 0.12 : 1, scale: 1, x: 0, y: 0 }
            : { opacity: 0, scale: 0.15, x: node.entryX, y: node.entryY }
        }
        transition={{
          type: "spring", stiffness: 130, damping: 22, mass: 1.3,
          opacity: { duration: 0.28 },
        }}
      >
        {/* Continuous float (nodeIconRef tracks this element's real position) */}
        <motion.div
          ref={iconRef}
          animate={{ y: node.floatY }}
          transition={{
            duration: node.dur,
            repeat: Infinity, repeatType: "mirror",
            ease: "easeInOut", delay: index * 0.33,
          }}
          className="flex flex-col items-center gap-1.5 cursor-default"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {/* Hover scale */}
          <motion.div
            animate={{ scale: isSelf ? 1.28 : isConnected ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 340, damping: 24 }}
          >
            {node.renderIcon(isSelf || isConnected)}
          </motion.div>

          {/* Label */}
          <span style={{
            fontSize: 9, fontFamily: "Inter, sans-serif",
            fontWeight: isSelf ? 700 : 400,
            color: isSelf
              ? node.color
              : isConnected
              ? "rgba(255,255,255,0.72)"
              : "rgba(255,255,255,0.27)",
            letterSpacing: "0.05em", whiteSpace: "nowrap",
            lineHeight: 1, transition: "color 0.26s ease",
          }}>
            {node.name}
          </span>

          {/* Tooltip — child of float wrapper → moves in sync */}
          <AnimatePresence>
            {tooltipReady && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, y: -10, scale: 0.86 }}
                animate={{ opacity: 1,  y: 0,   scale: 1 }}
                exit={{ opacity: 0,    y: -6,   scale: 0.92 }}
                transition={{ type: "spring", stiffness: 460, damping: 32 }}
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 13px)",
                  left: "50%", x: "-50%",
                  pointerEvents: "none", zIndex: 50,
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{
                  background: "rgba(6,9,15,0.97)",
                  border: `1px solid ${node.color}40`,
                  borderRadius: 10,
                  padding: "8px 14px",
                  backdropFilter: "blur(18px)",
                  boxShadow: `0 10px 36px rgba(0,0,0,0.65), 0 0 0 1px ${node.color}18`,
                  maxWidth: 185, textAlign: "center",
                }}>
                  <p style={{
                    margin: 0, marginBottom: 4,
                    fontSize: 10.5, fontWeight: 700,
                    color: node.color, fontFamily: "Inter, sans-serif",
                    letterSpacing: "0.02em",
                  }}>
                    {node.name}
                  </p>
                  <p style={{
                    margin: 0, fontSize: 9.5,
                    color: "rgba(255,255,255,0.54)",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.55, whiteSpace: "normal",
                  }}>
                    {node.role}
                  </p>
                </div>
                <div style={{
                  position: "absolute", top: "100%", left: "50%",
                  transform: "translateX(-50%)", width: 0, height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: `5px solid ${node.color}40`,
                }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
