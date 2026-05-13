import {
  useState,
  useRef,
  useEffect,
  useCallback,
  createRef,
  type RefObject,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiHtml5, SiJavascript, SiNodedotjs,
  SiExpress, SiMongodb, SiGit, SiOpenai, SiCss,
} from "react-icons/si";
import { FileCode2 } from "lucide-react";

/* ─── VS Code official icon (Simple Icons SVG path) ─────────── */
function VSCodeIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.9 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
    </svg>
  );
}

/* ─── node definitions ───────────────────────────────────────── */
interface NodeDef {
  id: string;
  name: string;
  color: string;
  role: string;
  x: number; // % of container width
  y: number; // % of container height (paddingBottom 52%)
  floatY: [number, number]; // float range px
  dur: number;
  renderIcon: (active: boolean) => React.ReactNode;
}

const SIZE = 26;

const nodes: NodeDef[] = [
  { id: "html",    name: "HTML",        color: "#E34F26", role: "Semantic structure & accessible markup",
    x: 9,  y: 50, floatY: [-7, 5],  dur: 4.4,
    renderIcon: (a) => <SiHtml5  size={SIZE} style={{ color: "#E34F26", filter: a ? "drop-shadow(0 0 6px #E34F2699)" : "none", transition: "filter .3s" }} />,
  },
  { id: "css",     name: "CSS3",        color: "#264DE4", role: "Responsive layouts, animations & design systems",
    x: 22, y: 16, floatY: [-5, 8],  dur: 5.1,
    renderIcon: (a) => <SiCss    size={SIZE} style={{ color: "#264DE4", filter: a ? "drop-shadow(0 0 6px #264DE499)" : "none", transition: "filter .3s" }} />,
  },
  { id: "ejs",     name: "EJS",         color: "#B9473A", role: "Server-side JS templating for dynamic views",
    x: 22, y: 79, floatY: [-8, 4],  dur: 4.7,
    renderIcon: (a) => <FileCode2 size={SIZE} style={{ color: "#B9473A", filter: a ? "drop-shadow(0 0 6px #B9473A99)" : "none", transition: "filter .3s" }} />,
  },
  { id: "js",      name: "JavaScript",  color: "#F0DB4F", role: "ES6+, async logic, event-driven interaction",
    x: 43, y: 48, floatY: [-6, 6],  dur: 3.9,
    renderIcon: (a) => <SiJavascript size={SIZE} style={{ color: "#F0DB4F", filter: a ? "drop-shadow(0 0 6px #F0DB4F99)" : "none", transition: "filter .3s" }} />,
  },
  { id: "nodejs",  name: "Node.js",     color: "#3C873A", role: "Server runtime, REST APIs, event loop",
    x: 60, y: 15, floatY: [-9, 3],  dur: 4.6,
    renderIcon: (a) => <SiNodedotjs size={SIZE} style={{ color: "#3C873A", filter: a ? "drop-shadow(0 0 6px #3C873A99)" : "none", transition: "filter .3s" }} />,
  },
  { id: "git",     name: "Git",         color: "#F05032", role: "Version control, branching, collaborative code",
    x: 60, y: 77, floatY: [-4, 9],  dur: 5.3,
    renderIcon: (a) => <SiGit   size={SIZE} style={{ color: "#F05032", filter: a ? "drop-shadow(0 0 6px #F0503299)" : "none", transition: "filter .3s" }} />,
  },
  { id: "express", name: "Express.js",  color: "#d4d4d4", role: "Routing, middleware, RESTful API patterns",
    x: 76, y: 46, floatY: [-6, 5],  dur: 4.2,
    renderIcon: (a) => <SiExpress size={SIZE} style={{ color: "#d4d4d4", filter: a ? "drop-shadow(0 0 6px #d4d4d499)" : "none", transition: "filter .3s" }} />,
  },
  { id: "mongodb", name: "MongoDB",     color: "#47A248", role: "Document storage, aggregation, schema design",
    x: 91, y: 17, floatY: [-7, 7],  dur: 3.8,
    renderIcon: (a) => <SiMongodb size={SIZE} style={{ color: "#47A248", filter: a ? "drop-shadow(0 0 6px #47A24899)" : "none", transition: "filter .3s" }} />,
  },
  { id: "vscode",  name: "VS Code",     color: "#007ACC", role: "Primary IDE — extensions, debugging, workflow",
    x: 91, y: 52, floatY: [-5, 8],  dur: 5.0,
    renderIcon: (a) => <VSCodeIcon size={SIZE} color={a ? "#007ACC" : "#007ACC"} />,
  },
  { id: "ai",      name: "AI Dev",      color: "#10a37f", role: "AI-assisted code review, rapid prototyping",
    x: 91, y: 81, floatY: [-8, 4],  dur: 4.3,
    renderIcon: (a) => <SiOpenai size={SIZE} style={{ color: "#10a37f", filter: a ? "drop-shadow(0 0 6px #10a37f99)" : "none", transition: "filter .3s" }} />,
  },
];

interface EdgeDef {
  a: string; b: string; bend: number;
}
const edges: EdgeDef[] = [
  { a: "html",    b: "css",     bend:  0.13 },
  { a: "html",    b: "ejs",     bend: -0.13 },
  { a: "css",     b: "js",      bend:  0.10 },
  { a: "ejs",     b: "js",      bend: -0.10 },
  { a: "js",      b: "nodejs",  bend:  0.12 },
  { a: "js",      b: "git",     bend: -0.12 },
  { a: "nodejs",  b: "express", bend:  0.10 },
  { a: "express", b: "mongodb", bend:  0.11 },
  { a: "express", b: "vscode",  bend: -0.08 },
  { a: "express", b: "ai",      bend: -0.11 },
];

const EDGE_KEYS = edges.map((e) => `${e.a}::${e.b}`);

function edgeKey(e: EdgeDef) { return `${e.a}::${e.b}`; }

function isConnected(nodeId: string, hov: string | null) {
  if (!hov || hov === nodeId) return false;
  return edges.some(({ a, b }) => (a === hov && b === nodeId) || (b === hov && a === nodeId));
}

/* ─── compute bezier path between two pixel centers ─────────── */
const ICON_RADIUS = 17; // px — start/end lines near icon edge

function buildPath(
  ax: number, ay: number,
  bx: number, by: number,
  bend: number,
): string {
  const dx = bx - ax, dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  if (len < ICON_RADIUS * 2 + 4) return "";
  const nx = dx / len, ny = dy / len;
  const px = -ny, py = nx;

  const sx = ax + nx * ICON_RADIUS, sy = ay + ny * ICON_RADIUS;
  const ex = bx - nx * ICON_RADIUS, ey = by - ny * ICON_RADIUS;

  const edgeLen = len - ICON_RADIUS * 2;
  const off = edgeLen * bend;
  const cp1x = sx + (ex - sx) * 0.3 + px * off;
  const cp1y = sy + (ey - sy) * 0.3 + py * off;
  const cp2x = sx + (ex - sx) * 0.7 + px * off;
  const cp2y = sy + (ey - sy) * 0.7 + py * off;

  return `M${f(sx)},${f(sy)} C${f(cp1x)},${f(cp1y)} ${f(cp2x)},${f(cp2y)} ${f(ex)},${f(ey)}`;
}
const f = (n: number) => n.toFixed(1);

/* ─── main component ─────────────────────────────────────────── */
export function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Stable ref objects for each node's icon wrapper (the floating element)
  const nodeIconRefs = useRef<Record<string, RefObject<HTMLDivElement>>>({});
  nodes.forEach((n) => {
    if (!nodeIconRefs.current[n.id])
      nodeIconRefs.current[n.id] = createRef<HTMLDivElement>();
  });

  // SVG path refs: main + glow per edge
  const mainPathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const glowPathRefs = useRef<Record<string, SVGPathElement | null>>({});

  // CSS offset-path pulse refs
  const pulseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Latest coords for tooltip rendering
  const coordsRef = useRef<Record<string, { x: number; y: number }>>({});

  // ─── rAF loop — reads DOM, updates paths imperatively ────────
  const hoveredRef = useRef<string | null>(null);
  hoveredRef.current = hovered;

  useEffect(() => {
    let raf: number;
    const loop = () => {
      const container = containerRef.current;
      if (!container) { raf = requestAnimationFrame(loop); return; }
      const cr = container.getBoundingClientRect();

      // read all node centers
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
      coordsRef.current = coords;

      const hov = hoveredRef.current;

      for (const edge of edges) {
        const key = edgeKey(edge);
        const ca = coords[edge.a], cb = coords[edge.b];
        if (!ca || !cb) continue;
        const d = buildPath(ca.x, ca.y, cb.x, cb.y, edge.bend);
        const active = hov === edge.a || hov === edge.b;

        // update main path
        const main = mainPathRefs.current[key];
        if (main) {
          if (d) main.setAttribute("d", d);
          main.style.stroke = active
            ? (hov === edge.a ? getNode(edge.a).color : getNode(edge.b).color)
            : "rgba(255,255,255,0.055)";
          main.style.strokeWidth = active ? "0.8" : "0.45";
          main.style.strokeOpacity = active ? "1" : "1";
        }

        // update glow path
        const glow = glowPathRefs.current[key];
        if (glow) {
          if (d) glow.setAttribute("d", d);
          glow.style.stroke = active
            ? (hov === edge.a ? getNode(edge.a).color : getNode(edge.b).color)
            : "transparent";
          glow.style.strokeWidth = active ? "3" : "0";
          glow.style.strokeOpacity = "0.12";
        }

        // update pulse offset-path
        const pulse = pulseRefs.current[key];
        if (pulse && d) {
          pulse.style.offsetPath = `path("${d}")`;
          pulse.style.opacity = active ? "1" : "0";
          if (active && pulse.style.animationName !== "pulse-travel") {
            pulse.style.animation = "pulse-travel 1.15s linear infinite";
          } else if (!active) {
            pulse.style.animation = "none";
          }
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const hoveredNode = hovered ? getNode(hovered) : null;

  return (
    <section className="py-28 relative overflow-hidden">
      {/* atmospheric depth fog */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 38%, rgba(5,10,16,0.6) 100%)",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* section header */}
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

        {/* ─── network stage ───────────────────────────────── */}
        <div
          ref={containerRef}
          className="relative max-w-5xl mx-auto select-none"
          style={{ paddingBottom: "52%" }}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Layer 1 — SVG connection lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            {edges.map((edge) => {
              const key = edgeKey(edge);
              return (
                <g key={key}>
                  {/* soft glow (wider, low opacity) */}
                  <path
                    ref={(el) => { glowPathRefs.current[key] = el; }}
                    fill="none"
                    stroke="transparent"
                    strokeLinecap="round"
                    strokeWidth={0}
                  />
                  {/* main sharp line */}
                  <path
                    ref={(el) => { mainPathRefs.current[key] = el; }}
                    fill="none"
                    stroke="rgba(255,255,255,0.055)"
                    strokeWidth={0.45}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
          </svg>

          {/* Layer 2 — CSS motion-path energy pulses */}
          <div className="absolute inset-0 pointer-events-none" style={{ overflow: "hidden" }}>
            {EDGE_KEYS.map((key, i) => (
              <div
                key={key}
                ref={(el) => { pulseRefs.current[key] = el; }}
                style={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: 5, height: 5,
                  borderRadius: "50%",
                  background: "#2dd4bf",
                  boxShadow: "0 0 6px 2px rgba(45,212,191,0.45)",
                  opacity: 0,
                  offsetDistance: "0%",
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>

          {/* Layer 3 — nodes */}
          {nodes.map((node, i) => {
            const isHov     = hovered === node.id;
            const connected = isConnected(node.id, hovered);
            const dimmed    = hovered !== null && !isHov && !connected;

            return (
              <NodeCard
                key={node.id}
                node={node}
                index={i}
                isHovered={isHov}
                connected={connected}
                dimmed={dimmed}
                iconRef={nodeIconRefs.current[node.id]}
                onEnter={() => setHovered(node.id)}
                onLeave={() => setHovered(null)}
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

/* ─── helper ─────────────────────────────────────────────────── */
function getNode(id: string) { return nodes.find((n) => n.id === id)!; }

/* ─── NodeCard ───────────────────────────────────────────────── */
interface NodeCardProps {
  node: NodeDef;
  index: number;
  isHovered: boolean;
  connected: boolean;
  dimmed: boolean;
  iconRef: RefObject<HTMLDivElement>;
  onEnter: () => void;
  onLeave: () => void;
}

function NodeCard({
  node, index, isHovered, connected, dimmed,
  iconRef, onEnter, onLeave,
}: NodeCardProps) {
  return (
    /* Outer wrapper: static position + entrance + dimming */
    <motion.div
      initial={{ opacity: 0, scale: 0.25 }}
      whileInView={{ opacity: dimmed ? 0.15 : 1, scale: 1 }}
      viewport={{ once: true }}
      animate={{ opacity: dimmed ? 0.15 : 1 }}
      transition={
        dimmed
          ? { duration: 0.28 }
          : { delay: index * 0.07, type: "spring", stiffness: 180, damping: 22 }
      }
      style={{
        position: "absolute",
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: isHovered ? 20 : connected ? 15 : 10,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Inner wrapper: floating animation — this is what nodeIconRef tracks */}
      <motion.div
        ref={iconRef}
        animate={{ y: node.floatY }}
        transition={{
          duration: node.dur,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: index * 0.38,
        }}
        className="flex flex-col items-center gap-1.5 cursor-default"
      >
        {/* scale on hover */}
        <motion.div
          animate={{ scale: isHovered ? 1.22 : connected ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          {node.renderIcon(isHovered || connected)}
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
              : "rgba(255,255,255,0.28)",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            transition: "color 0.28s ease",
            lineHeight: 1,
          }}
        >
          {node.name}
        </span>

        {/* tooltip — child of floating wrapper → moves with icon */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.88 }}
              animate={{ opacity: 1,  y: 0,   scale: 1 }}
              exit={{ opacity: 0,    y: -6,   scale: 0.93 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 11px)",
                left: "50%",
                x: "-50%",
                pointerEvents: "none",
                zIndex: 40,
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  background: "rgba(7,10,16,0.97)",
                  border: `1px solid ${node.color}44`,
                  borderRadius: 10,
                  padding: "8px 14px",
                  backdropFilter: "blur(16px)",
                  boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${node.color}18`,
                  maxWidth: 180,
                  textAlign: "center",
                }}
              >
                <p style={{ margin: 0, marginBottom: 4, fontSize: 10.5, fontWeight: 700, color: node.color, fontFamily: "Inter, sans-serif", letterSpacing: "0.02em" }}>
                  {node.name}
                </p>
                <p style={{ margin: 0, fontSize: 9.5, color: "rgba(255,255,255,0.55)", fontFamily: "Inter, sans-serif", lineHeight: 1.5, whiteSpace: "normal" }}>
                  {node.role}
                </p>
              </div>
              <div style={{
                position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                width: 0, height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `5px solid ${node.color}44`,
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
