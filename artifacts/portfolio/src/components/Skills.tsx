import { useState, useRef, useCallback, useMemo } from "react";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  SiHtml5,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGit,
  SiOpenai,
  SiCss,
} from "react-icons/si";
import { FileCode2 } from "lucide-react";

function VSCodeIcon({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"
        fill="currentColor"
      />
    </svg>
  );
}

const nodes = [
  { id: "html",    name: "HTML",        icon: SiHtml5,      color: "#E34F26", role: "Semantic structure & accessible markup",               x: 9,  y: 50, floatY: [-6, 4],  dur: 4.4 },
  { id: "css",     name: "CSS3",        icon: SiCss,        color: "#264DE4", role: "Responsive layouts, animations & design systems",      x: 22, y: 16, floatY: [-5, 7],  dur: 5.1 },
  { id: "ejs",     name: "EJS",         icon: FileCode2,    color: "#B9473A", role: "Server-side JS templating for dynamic views",          x: 22, y: 79, floatY: [-7, 4],  dur: 4.7, isLucide: true },
  { id: "js",      name: "JavaScript",  icon: SiJavascript, color: "#F0DB4F", role: "ES6+, async logic, event-driven interaction",          x: 43, y: 48, floatY: [-5, 6],  dur: 3.9 },
  { id: "nodejs",  name: "Node.js",     icon: SiNodedotjs,  color: "#3C873A", role: "Server runtime, REST APIs, event loop",               x: 60, y: 15, floatY: [-8, 3],  dur: 4.6 },
  { id: "git",     name: "Git",         icon: SiGit,        color: "#F05032", role: "Version control, branching, collaborative code",       x: 60, y: 77, floatY: [-4, 8],  dur: 5.3 },
  { id: "express", name: "Express.js",  icon: SiExpress,    color: "#c0c0c0", role: "Routing, middleware, RESTful API patterns",            x: 76, y: 46, floatY: [-5, 5],  dur: 4.2 },
  { id: "mongodb", name: "MongoDB",     icon: SiMongodb,    color: "#47A248", role: "Document storage, aggregation, schema design",         x: 91, y: 17, floatY: [-6, 6],  dur: 3.8 },
  { id: "vscode",  name: "VS Code",     icon: VSCodeIcon,   color: "#007ACC", role: "Primary IDE — extensions, debugging, workflow",        x: 91, y: 52, floatY: [-5, 7],  dur: 5.0, isCustom: true },
  { id: "ai",      name: "AI Dev",      icon: SiOpenai,     color: "#10a37f", role: "AI-assisted code review, rapid prototyping",          x: 91, y: 81, floatY: [-7, 4],  dur: 4.3 },
];

const edges: { a: string; b: string; bend: number; depth?: "back" | "front" }[] = [
  { a: "html",    b: "css",     bend:  0.18,  depth: "back"  },
  { a: "html",    b: "ejs",     bend: -0.18,  depth: "back"  },
  { a: "css",     b: "js",      bend:  0.14,  depth: "front" },
  { a: "ejs",     b: "js",      bend: -0.14,  depth: "front" },
  { a: "js",      b: "nodejs",  bend:  0.16,  depth: "front" },
  { a: "js",      b: "git",     bend: -0.16,  depth: "front" },
  { a: "nodejs",  b: "express", bend:  0.13,  depth: "back"  },
  { a: "express", b: "mongodb", bend:  0.15,  depth: "front" },
  { a: "express", b: "vscode",  bend: -0.06,  depth: "front" },
  { a: "express", b: "ai",      bend: -0.15,  depth: "back"  },
];

function getNode(id: string) { return nodes.find((n) => n.id === id)!; }
function isConnected(id: string, hov: string | null) {
  if (!hov || hov === id) return false;
  return edges.some(({ a, b }) => (a === hov && b === id) || (b === hov && a === id));
}

const AR = 0.48;
const svgY = (y: number) => y * AR;

const NODE_RADIUS = 4.2;
const SAFE_RADIUS = 9.5;

function cubicBezierPoint(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

function smartBezierPath(
  x1: number, y1: number,
  x2: number, y2: number,
  baseBend: number,
  allNodePositions: Array<{ x: number; y: number; id: string }>,
  skipIds: string[]
): string {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;

  const sx = x1 + (dx / len) * NODE_RADIUS;
  const sy = y1 + (dy / len) * NODE_RADIUS;
  const ex = x2 - (dx / len) * NODE_RADIUS;
  const ey = y2 - (dy / len) * NODE_RADIUS;

  const edx = ex - sx, edy = ey - sy;
  const elen = Math.sqrt(edx * edx + edy * edy) || 1;
  const px = -edy / elen, py = edx / elen;
  const off = elen * baseBend;

  let cp1x = sx + edx * 0.33 + px * off;
  let cp1y = sy + edy * 0.33 + py * off;
  let cp2x = ex - edx * 0.33 + px * off;
  let cp2y = ey - edy * 0.33 + py * off;

  for (let iter = 0; iter < 3; iter++) {
    for (const node of allNodePositions) {
      if (skipIds.includes(node.id)) continue;
      let totalRX = 0, totalRY = 0, pushed = false;

      for (let t = 0.12; t <= 0.88; t += 0.19) {
        const pathX = cubicBezierPoint(sx, cp1x, cp2x, ex, t);
        const pathY = cubicBezierPoint(sy, cp1y, cp2y, ey, t);
        const ddx = pathX - node.x, ddy = pathY - node.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);

        if (dist < SAFE_RADIUS && dist > 0.01) {
          const strength = Math.pow((SAFE_RADIUS - dist) / SAFE_RADIUS, 1.4) * 8;
          totalRX += (ddx / dist) * strength;
          totalRY += (ddy / dist) * strength;
          pushed = true;
        }
      }

      if (pushed) {
        cp1x += totalRX * 0.45;
        cp1y += totalRY * 0.45;
        cp2x += totalRX * 0.45;
        cp2y += totalRY * 0.45;
      }
    }
  }

  return `M${sx.toFixed(3)},${sy.toFixed(3)} C${cp1x.toFixed(3)},${cp1y.toFixed(3)} ${cp2x.toFixed(3)},${cp2y.toFixed(3)} ${ex.toFixed(3)},${ey.toFixed(3)}`;
}

let egCounter = 0;

function Edge({
  edge,
  active,
  activeColor,
  allNodePositions,
}: {
  edge: { a: string; b: string; bend: number; depth?: "back" | "front" };
  active: boolean;
  activeColor: string;
  allNodePositions: Array<{ x: number; y: number; id: string }>;
}) {
  const na = getNode(edge.a), nb = getNode(edge.b);
  const ax = na.x, ay = svgY(na.y);
  const bx = nb.x, by = svgY(nb.y);

  const d = useMemo(() => smartBezierPath(
    ax, ay, bx, by, edge.bend, allNodePositions, [edge.a, edge.b]
  ), [ax, ay, bx, by, edge.bend, allNodePositions, edge.a, edge.b]);

  const [uid] = useState(() => `eg-${egCounter++}`);
  const gradId = `grad-${uid}`;
  const pathRefId = `path-ref-${uid}`;

  const pulseColor = activeColor;

  return (
    <g>
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={ax} y1={ay} x2={bx} y2={by}>
          <stop offset="0%"   stopColor={pulseColor} stopOpacity={active ? 0.92 : 0} />
          <stop offset="45%"  stopColor={pulseColor} stopOpacity={active ? 1    : 0} />
          <stop offset="100%" stopColor={pulseColor} stopOpacity={active ? 0.38 : 0} />
        </linearGradient>
        <filter id={`blur-halo-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <filter id={`blur-glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <path id={pathRefId} d={d} />
      </defs>

      {/* ── atmospheric outer halo ─────────────────────────────── */}
      <path
        d={d}
        fill="none"
        stroke={pulseColor}
        strokeWidth={active ? 3.5 : 1.8}
        strokeLinecap="round"
        strokeOpacity={active ? 0.07 : 0.025}
        filter={`url(#blur-halo-${uid})`}
        style={{ transition: "stroke-width 0.5s ease, stroke-opacity 0.5s ease" }}
      />

      {/* ── mid glow ──────────────────────────────────────────── */}
      <path
        d={d}
        fill="none"
        stroke={pulseColor}
        strokeWidth={active ? 1.6 : 0.6}
        strokeLinecap="round"
        strokeOpacity={active ? 0.22 : 0.045}
        filter={`url(#blur-glow-${uid})`}
        style={{ transition: "stroke-width 0.45s ease, stroke-opacity 0.45s ease" }}
      />

      {/* ── idle breath core (always on, very low opacity) ─────── */}
      {!active && (
        <path
          d={d}
          fill="none"
          stroke="rgba(120,140,160,0.9)"
          strokeWidth={0.18}
          strokeLinecap="round"
          strokeOpacity={1}
          style={{
            animation: `idleBreathe-${uid} 3.8s ease-in-out infinite`,
          }}
        />
      )}
      <style>{`
        @keyframes idleBreathe-${uid} {
          0%, 100% { opacity: 0.055; }
          50%       { opacity: 0.14; }
        }
      `}</style>

      {/* ── core signal line (active) ──────────────────────────── */}
      <path
        d={d}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={active ? 0.38 : 0}
        strokeLinecap="round"
        strokeOpacity={active ? 1 : 0}
        style={{ transition: "stroke-width 0.4s ease, stroke-opacity 0.4s ease" }}
      />

      {/* ── energy pulse ──────────────────────────────────────── */}
      {active && (
        <>
          <circle r={0.55} fill={pulseColor} opacity={0.9}>
            <animateMotion dur="1.4s" repeatCount="indefinite" begin="0s">
              <mpath href={`#${pathRefId}`} />
            </animateMotion>
          </circle>
          <circle r={1.1} fill={pulseColor} opacity={0.18} filter={`url(#blur-glow-${uid})`}>
            <animateMotion dur="1.4s" repeatCount="indefinite" begin="0s">
              <mpath href={`#${pathRefId}`} />
            </animateMotion>
          </circle>
        </>
      )}
    </g>
  );
}

export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const springX = useSpring(50, { stiffness: 55, damping: 16 });
  const springY = useSpring(50, { stiffness: 55, damping: 16 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = containerRef.current!.getBoundingClientRect();
    springX.set(((e.clientX - r.left) / r.width) * 100);
    springY.set(((e.clientY - r.top) / r.height) * 100);
  }, [springX, springY]);

  const hNode = hovered ? getNode(hovered) : null;
  const activeColor = hNode?.color ?? "#2dd4bf";

  const allNodePositions = useMemo(() =>
    nodes.map(n => ({ id: n.id, x: n.x, y: svgY(n.y) })),
    []
  );

  const backEdges  = edges.filter(e => e.depth === "back");
  const frontEdges = edges.filter(e => e.depth !== "back");

  return (
    <section className="py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(5,10,16,0.55) 100%)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Technical Arsenal</h2>
          <p className="text-muted-foreground text-lg">
            The tools and technologies powering every system I build.
          </p>
        </motion.div>

        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto select-none"
          style={{ paddingBottom: "48%" }}
          onMouseMove={onMouseMove}
          onMouseLeave={() => { setHovered(null); springX.set(50); springY.set(50); }}
        >
          {/* ── Back-depth SVG (behind icons) ──────────────────── */}
          <svg
            viewBox={`0 0 100 ${100 * AR}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none", overflow: "visible", zIndex: 1 }}
          >
            {backEdges.map((edge) => (
              <Edge
                key={`back-${edge.a}-${edge.b}`}
                edge={edge}
                active={hovered === edge.a || hovered === edge.b}
                activeColor={activeColor}
                allNodePositions={allNodePositions}
              />
            ))}
          </svg>

          {/* ── Nodes (z:10) ────────────────────────────────────── */}
          {nodes.map((node, i) => {
            const Icon = node.icon as React.ElementType;
            const isHov     = hovered === node.id;
            const connected = isConnected(node.id, hovered);
            const dimmed    = hovered !== null && !isHov && !connected;

            return (
              <NodeIcon
                key={node.id}
                node={node}
                index={i}
                isHovered={isHov}
                connected={connected}
                dimmed={dimmed}
                springMouseX={springX}
                springMouseY={springY}
                onEnter={() => setHovered(node.id)}
                onLeave={() => setHovered(null)}
              >
                <Icon
                  size={node.isCustom ? 20 : node.isLucide ? 21 : 23}
                  style={{
                    color: node.color,
                    filter: isHov ? `drop-shadow(0 0 5px ${node.color})` : "none",
                    transition: "filter 0.3s ease",
                  }}
                />
              </NodeIcon>
            );
          })}

          {/* ── Front-depth SVG (also behind divs but drawn last in SVG stack) */}
          <svg
            viewBox={`0 0 100 ${100 * AR}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none", overflow: "visible", zIndex: 2 }}
          >
            {frontEdges.map((edge) => (
              <Edge
                key={`front-${edge.a}-${edge.b}`}
                edge={edge}
                active={hovered === edge.a || hovered === edge.b}
                activeColor={activeColor}
                allNodePositions={allNodePositions}
              />
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

function NodeIcon({
  node, index, isHovered, connected, dimmed,
  springMouseX, springMouseY, onEnter, onLeave, children,
}: {
  node: (typeof nodes)[0];
  index: number;
  isHovered: boolean;
  connected: boolean;
  dimmed: boolean;
  springMouseX: ReturnType<typeof useSpring>;
  springMouseY: ReturnType<typeof useSpring>;
  onEnter: () => void;
  onLeave: () => void;
  children: React.ReactNode;
}) {
  const dx = useTransform(springMouseX, (mx) => {
    const my = springMouseY.get();
    const dist = Math.sqrt((mx - node.x) ** 2 + (my - node.y) ** 2);
    const strength = Math.max(0, 1 - dist / 16) * 2.5;
    return (node.x - mx) / Math.max(dist, 1) * strength;
  });
  const dy = useTransform(springMouseY, (my) => {
    const mx = springMouseX.get();
    const dist = Math.sqrt((mx - node.x) ** 2 + (my - node.y) ** 2);
    const strength = Math.max(0, 1 - dist / 16) * 2.5;
    return (node.y - my) / Math.max(dist, 1) * strength;
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      animate={{ opacity: dimmed ? 0.12 : 1 }}
      style={{
        position: "absolute",
        left: `${node.x}%`,
        top:  `${node.y}%`,
        transform: "translate(-50%, -50%)",
        x: dx, y: dy,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <motion.div
        animate={{ y: node.floatY }}
        transition={{ duration: node.dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: index * 0.38 }}
        className="relative flex flex-col items-center gap-1.5 cursor-default"
      >
        <motion.div
          whileHover={{ scale: 1.25 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          style={{
            filter: isHovered
              ? `drop-shadow(0 0 9px ${node.color}99)`
              : connected
              ? `drop-shadow(0 0 4px ${node.color}44)`
              : "none",
            transition: "filter 0.3s ease",
          }}
        >
          {children}
        </motion.div>

        <span style={{
          fontSize: 9,
          fontFamily: "Inter, sans-serif",
          fontWeight: isHovered ? 600 : 400,
          color: isHovered ? node.color : connected ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.28)",
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
          transition: "color 0.3s ease",
          lineHeight: 1,
        }}>
          {node.name}
        </span>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 10px)",
                left: "50%",
                transform: "translateX(-50%)",
                pointerEvents: "none",
                zIndex: 30,
                whiteSpace: "nowrap",
              }}
            >
              <div style={{
                background: "rgba(8,12,18,0.96)",
                border: `1px solid ${node.color}50`,
                borderRadius: 10,
                padding: "7px 13px",
                backdropFilter: "blur(14px)",
                boxShadow: `0 6px 28px rgba(0,0,0,0.55), 0 0 14px ${node.color}1A`,
                maxWidth: 175,
                textAlign: "center",
              }}>
                <p style={{ margin: 0, fontSize: 10.5, fontWeight: 600, color: node.color, fontFamily: "Inter, sans-serif", lineHeight: 1.3, marginBottom: 4 }}>
                  {node.name}
                </p>
                <p style={{ margin: 0, fontSize: 9, color: "rgba(255,255,255,0.58)", fontFamily: "Inter, sans-serif", lineHeight: 1.5, whiteSpace: "normal" }}>
                  {node.role}
                </p>
              </div>
              <div style={{
                position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                width: 0, height: 0,
                borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
                borderTop: `5px solid ${node.color}50`,
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
