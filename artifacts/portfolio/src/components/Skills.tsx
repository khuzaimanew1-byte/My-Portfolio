import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  SiHtml5,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiGit,
  SiOpenai,
} from "react-icons/si";
import { FileCode2, Palette, Code2 } from "lucide-react";

/* ─── node definitions (positions are % of container 0–100) ──── */
const nodes = [
  {
    id: "html",    name: "HTML",        icon: SiHtml5,    color: "#E34F26",
    role: "Semantic structure & accessible markup",
    x: 9,  y: 50, floatY: [-7, 5],  dur: 4.4,
  },
  {
    id: "css",     name: "CSS3",        icon: Palette,    color: "#264DE4",
    role: "Responsive layouts, animations & design systems",
    x: 22, y: 16, floatY: [-5, 8],  dur: 5.1,  isLucide: true,
  },
  {
    id: "ejs",     name: "EJS",         icon: FileCode2,  color: "#B9473A",
    role: "Server-side JS templating for dynamic views",
    x: 22, y: 79, floatY: [-8, 4],  dur: 4.7,  isLucide: true,
  },
  {
    id: "js",      name: "JavaScript",  icon: SiJavascript, color: "#F0DB4F",
    role: "ES6+, async logic, event-driven interaction",
    x: 43, y: 48, floatY: [-6, 6],  dur: 3.9,
  },
  {
    id: "nodejs",  name: "Node.js",     icon: SiNodedotjs,  color: "#3C873A",
    role: "Server runtime, REST APIs, event loop",
    x: 60, y: 15, floatY: [-9, 3],  dur: 4.6,
  },
  {
    id: "git",     name: "Git",         icon: SiGit,        color: "#F05032",
    role: "Version control, branching, collaborative code",
    x: 60, y: 77, floatY: [-4, 9],  dur: 5.3,
  },
  {
    id: "express", name: "Express.js",  icon: SiExpress,    color: "#c0c0c0",
    role: "Routing, middleware, RESTful API patterns",
    x: 76, y: 46, floatY: [-6, 5],  dur: 4.2,
  },
  {
    id: "mongodb", name: "MongoDB",     icon: SiMongodb,    color: "#47A248",
    role: "Document storage, aggregation, schema design",
    x: 91, y: 17, floatY: [-7, 7],  dur: 3.8,
  },
  {
    id: "vscode",  name: "VS Code",     icon: Code2,        color: "#007ACC",
    role: "Primary IDE — extensions, debugging, workflow",
    x: 91, y: 52, floatY: [-5, 8],  dur: 5.0,  isLucide: true,
  },
  {
    id: "ai",      name: "AI Dev",      icon: SiOpenai,     color: "#10a37f",
    role: "AI-assisted code review, rapid prototyping",
    x: 91, y: 81, floatY: [-8, 4],  dur: 4.3,
  },
];

/* ─── edges with organic bend direction ───────────────────────── */
const edges: { a: string; b: string; bend: number }[] = [
  { a: "html",    b: "css",     bend:  0.18 },
  { a: "html",    b: "ejs",     bend: -0.18 },
  { a: "css",     b: "js",      bend:  0.14 },
  { a: "ejs",     b: "js",      bend: -0.14 },
  { a: "js",      b: "nodejs",  bend:  0.16 },
  { a: "js",      b: "git",     bend: -0.16 },
  { a: "nodejs",  b: "express", bend:  0.13 },
  { a: "express", b: "mongodb", bend:  0.15 },
  { a: "express", b: "vscode",  bend: -0.10 },
  { a: "express", b: "ai",      bend: -0.15 },
];

function getNode(id: string) {
  return nodes.find((n) => n.id === id)!;
}

function isConnected(nodeId: string, hovered: string | null) {
  if (!hovered || hovered === nodeId) return false;
  return edges.some(({ a, b }) => (a === hovered && b === nodeId) || (b === hovered && a === nodeId));
}

/* ─── bezier path string ──────────────────────────────────────── */
function bezierPath(x1: number, y1: number, x2: number, y2: number, bend: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const px = -dy / len;
  const py =  dx / len;
  const off = len * bend;
  const cp1x = (x1 + dx * 0.35 + px * off).toFixed(2);
  const cp1y = (y1 + dy * 0.35 + py * off).toFixed(2);
  const cp2x = (x2 - dx * 0.35 + px * off).toFixed(2);
  const cp2y = (y2 - dy * 0.35 + py * off).toFixed(2);
  return `M${x1},${y1} C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
}

/* ─── ambient particle definitions ───────────────────────────── */
const particles = [
  { x: 15, y: 35, r: 0.6, dur: 6 },
  { x: 35, y: 65, r: 0.5, dur: 8 },
  { x: 50, y: 25, r: 0.7, dur: 5 },
  { x: 68, y: 60, r: 0.4, dur: 9 },
  { x: 80, y: 30, r: 0.5, dur: 7 },
];

/* ─── edge component ─────────────────────────────────────────── */
function Edge({
  edge,
  active,
  activeColor,
}: {
  edge: { a: string; b: string; bend: number };
  active: boolean;
  activeColor: string;
}) {
  const na = getNode(edge.a);
  const nb = getNode(edge.b);
  const d = bezierPath(na.x, na.y, nb.x, nb.y, edge.bend);
  const [uid] = useState(() => `eg-${Math.random().toString(36).slice(2, 8)}`);

  return (
    <g>
      <defs>
        <linearGradient id={uid} gradientUnits="userSpaceOnUse"
          x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}>
          <stop offset="0%"   stopColor={activeColor} />
          <stop offset="100%" stopColor={activeColor} stopOpacity={0.4} />
        </linearGradient>
      </defs>

      {/* main line — draws in on hover */}
      <path
        d={d}
        fill="none"
        stroke={active ? `url(#${uid})` : "transparent"}
        strokeWidth={0.6}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={active ? 0 : 1}
        style={{ transition: "stroke-dashoffset 0.55s cubic-bezier(0.4,0,0.2,1), stroke 0.2s" }}
      />

      {/* soft glow */}
      <path
        d={d}
        fill="none"
        stroke={active ? activeColor : "transparent"}
        strokeWidth={2.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={active ? 0 : 1}
        strokeOpacity={0.12}
        style={{ filter: "blur(2px)", transition: "stroke-dashoffset 0.55s cubic-bezier(0.4,0,0.2,1), stroke 0.2s" }}
      />

      {/* energy pulse — travels along the curve */}
      {active && (
        <circle r={0.9} fill={activeColor} opacity={0.9}>
          <animateMotion dur="1.2s" repeatCount="indefinite" begin="0s">
            <mpath href={`#path-${uid}`} />
          </animateMotion>
        </circle>
      )}

      {/* hidden path for mpath reference */}
      {active && <path id={`path-${uid}`} d={d} fill="none" stroke="none" />}
    </g>
  );
}

/* ─── main component ─────────────────────────────────────────── */
export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useRef(50);
  const rawY = useRef(50);

  const springX = useSpring(50, { stiffness: 60, damping: 18 });
  const springY = useSpring(50, { stiffness: 60, damping: 18 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    rawX.current = ((e.clientX - rect.left) / rect.width) * 100;
    rawY.current = ((e.clientY - rect.top) / rect.height) * 100;
    springX.set(rawX.current);
    springY.set(rawY.current);
  }, [springX, springY]);

  const hoveredNode = hovered ? getNode(hovered) : null;
  const activeColor = hoveredNode?.color ?? "#2dd4bf";

  return (
    <section className="py-28 relative overflow-hidden">
      {/* depth fog */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(5,10,16,0.6) 100%)",
          }}
        />
        <div className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 40% 50% at 20% 50%, rgba(45,212,191,0.03) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
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

        {/* network container */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto select-none"
          style={{ paddingBottom: "48%" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { setHovered(null); springX.set(50); springY.set(50); }}
        >
          {/* SVG layer — connections & particles */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none", overflow: "visible" }}
          >
            {/* ambient particles */}
            {particles.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="rgba(45,212,191,0.25)">
                <animate
                  attributeName="opacity"
                  values="0.1;0.5;0.1"
                  dur={`${p.dur}s`}
                  repeatCount="indefinite"
                  begin={`${i * 1.3}s`}
                />
                <animate
                  attributeName="cy"
                  values={`${p.y};${p.y - 2};${p.y}`}
                  dur={`${p.dur}s`}
                  repeatCount="indefinite"
                  begin={`${i * 1.3}s`}
                />
              </circle>
            ))}

            {/* edges */}
            {edges.map((edge) => {
              const active = hovered === edge.a || hovered === edge.b;
              return (
                <Edge
                  key={`${edge.a}-${edge.b}`}
                  edge={edge}
                  active={active}
                  activeColor={activeColor}
                />
              );
            })}
          </svg>

          {/* icon nodes */}
          {nodes.map((node, i) => {
            const Icon = node.icon;
            const isHovered  = hovered === node.id;
            const connected  = isConnected(node.id, hovered);
            const dimmed     = hovered !== null && !isHovered && !connected;

            return (
              <NodeIcon
                key={node.id}
                node={node}
                index={i}
                isHovered={isHovered}
                connected={connected}
                dimmed={dimmed}
                springMouseX={springX}
                springMouseY={springY}
                onEnter={() => setHovered(node.id)}
                onLeave={() => setHovered(null)}
              >
                <Icon
                  size={node.isLucide ? 22 : 24}
                  style={{
                    color: node.color,
                    filter: isHovered ? `drop-shadow(0 0 6px ${node.color})` : "none",
                    transition: "filter 0.3s ease",
                    flexShrink: 0,
                  }}
                />
              </NodeIcon>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── NodeIcon ───────────────────────────────────────────────── */
function NodeIcon({
  node,
  index,
  isHovered,
  connected,
  dimmed,
  springMouseX,
  springMouseY,
  onEnter,
  onLeave,
  children,
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
  // proximity repulsion — node drifts softly away from cursor
  const dx = useTransform(springMouseX, (mx) => {
    const dist = Math.sqrt((mx - node.x) ** 2 + (springMouseY.get() - node.y) ** 2);
    const strength = Math.max(0, 1 - dist / 18) * 3;
    return (node.x - mx) / Math.max(dist, 1) * strength;
  });
  const dy = useTransform(springMouseY, (my) => {
    const dist = Math.sqrt((springMouseX.get() - node.x) ** 2 + (my - node.y) ** 2);
    const strength = Math.max(0, 1 - dist / 18) * 3;
    return (node.y - my) / Math.max(dist, 1) * strength;
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      animate={{ opacity: dimmed ? 0.15 : 1 }}
      style={{
        position: "absolute",
        left: `${node.x}%`,
        top:  `${node.y}%`,
        transform: "translate(-50%, -50%)",
        x: dx,
        y: dy,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* float animation wrapper */}
      <motion.div
        animate={{ y: node.floatY }}
        transition={{
          duration: node.dur,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: index * 0.4,
        }}
        className="relative flex flex-col items-center gap-1.5 cursor-default"
      >
        {/* icon */}
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            filter: isHovered
              ? `drop-shadow(0 0 10px ${node.color}88)`
              : connected
              ? `drop-shadow(0 0 5px ${node.color}44)`
              : "none",
            transition: "filter 0.35s ease",
          }}
        >
          {children}
        </motion.div>

        {/* label */}
        <span
          style={{
            fontSize: 9,
            fontFamily: "Inter, sans-serif",
            fontWeight: isHovered ? 600 : 400,
            color: isHovered
              ? node.color
              : connected
              ? "rgba(255,255,255,0.7)"
              : "rgba(255,255,255,0.32)",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            transition: "color 0.3s ease",
            lineHeight: 1,
          }}
        >
          {node.name}
        </span>

        {/* tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
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
              <div
                style={{
                  background: "rgba(8,12,18,0.95)",
                  border: `1px solid ${node.color}55`,
                  borderRadius: 10,
                  padding: "7px 12px",
                  backdropFilter: "blur(12px)",
                  boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 12px ${node.color}22`,
                  maxWidth: 180,
                  textAlign: "center",
                }}
              >
                <p style={{
                  margin: 0,
                  fontSize: 10,
                  fontWeight: 600,
                  color: node.color,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.3,
                  marginBottom: 3,
                }}>
                  {node.name}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: 9,
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.5,
                  whiteSpace: "normal",
                }}>
                  {node.role}
                </p>
              </div>
              {/* tooltip arrow */}
              <div style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0, height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `5px solid ${node.color}55`,
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
