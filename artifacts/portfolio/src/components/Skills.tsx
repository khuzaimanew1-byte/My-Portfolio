import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

/* ── node definitions ──────────────────────────────────────── */
// positions are in a 1000 × 420 viewBox coordinate space
const nodes = [
  {
    id: "html",
    name: "HTML",
    icon: SiHtml5,
    color: "#E34F26",
    x: 80,
    y: 210,
    tooltip: "Semantic markup, accessibility, structured web content.",
  },
  {
    id: "css",
    name: "CSS",
    icon: Palette,
    color: "#1572B6",
    x: 240,
    y: 90,
    tooltip: "Responsive layouts, animations, modern design systems.",
    isLucide: true,
  },
  {
    id: "ejs",
    name: "EJS",
    icon: FileCode2,
    color: "#B9473A",
    x: 240,
    y: 330,
    tooltip: "Embedded JS templating for server-rendered views.",
    isLucide: true,
  },
  {
    id: "js",
    name: "JavaScript",
    icon: SiJavascript,
    color: "#F7DF1E",
    x: 420,
    y: 210,
    tooltip: "ES6+, async patterns, DOM interaction, event-driven logic.",
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: SiNodedotjs,
    color: "#3C873A",
    x: 580,
    y: 80,
    tooltip: "Server-side runtime, REST APIs, event loop architecture.",
  },
  {
    id: "git",
    name: "Git",
    icon: SiGit,
    color: "#F05032",
    x: 580,
    y: 340,
    tooltip: "Version control, branching workflows, collaborative coding.",
  },
  {
    id: "express",
    name: "Express.js",
    icon: SiExpress,
    color: "#cccccc",
    x: 740,
    y: 210,
    tooltip: "Routing, middleware, RESTful API design patterns.",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: SiMongodb,
    color: "#47A248",
    x: 900,
    y: 90,
    tooltip: "Document storage, aggregation pipelines, schema design.",
  },
  {
    id: "vscode",
    name: "VS Code",
    icon: Code2,
    color: "#007ACC",
    x: 900,
    y: 210,
    tooltip: "Primary development environment, extensions, debugging.",
    isLucide: true,
  },
  {
    id: "ai",
    name: "AI Dev",
    icon: SiOpenai,
    color: "#10a37f",
    x: 900,
    y: 340,
    tooltip: "AI tooling for code review, rapid prototyping, productivity.",
  },
];

/* ── connection pairs ──────────────────────────────────────── */
const edges: [string, string][] = [
  ["html", "css"],
  ["html", "ejs"],
  ["css", "js"],
  ["ejs", "js"],
  ["js", "nodejs"],
  ["js", "git"],
  ["nodejs", "express"],
  ["express", "mongodb"],
  ["express", "vscode"],
  ["express", "ai"],
];

/* ── helpers ───────────────────────────────────────────────── */
const NODE_R = 28; // icon circle radius in SVG units

function getNode(id: string) {
  return nodes.find((n) => n.id === id)!;
}

function isEdgeActive(edgeA: string, edgeB: string, hovered: string | null) {
  if (!hovered) return false;
  return edgeA === hovered || edgeB === hovered;
}

function isConnectedTo(nodeId: string, hovered: string | null) {
  if (!hovered || hovered === nodeId) return false;
  return edges.some(
    ([a, b]) => (a === hovered && b === nodeId) || (b === hovered && a === nodeId)
  );
}

/* ── AnimatedEdge ──────────────────────────────────────────── */
function AnimatedEdge({
  a,
  b,
  active,
  colorA,
  colorB,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
  active: boolean;
  colorA: string;
  colorB: string;
}) {
  const id = `grad-${Math.random().toString(36).slice(2)}`;
  const len = Math.hypot(b.x - a.x, b.y - a.y);

  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colorA} stopOpacity={active ? 0.9 : 0.15} />
          <stop offset="100%" stopColor={colorB} stopOpacity={active ? 0.9 : 0.15} />
        </linearGradient>
      </defs>

      {/* base dim line */}
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={`url(#${id})`}
        strokeWidth={active ? 1.5 : 1}
        strokeDasharray={active ? "none" : "4 6"}
        style={{ transition: "all 0.35s ease" }}
      />

      {/* animated travelling dot when active */}
      {active && (
        <circle r={3} fill={colorA} opacity={0.9}>
          <animateMotion
            dur="1.6s"
            repeatCount="indefinite"
            path={`M${a.x},${a.y} L${b.x},${b.y}`}
          />
        </circle>
      )}

      {/* glow overlay when active */}
      {active && (
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={`url(#${id})`}
          strokeWidth={4}
          strokeOpacity={0.18}
          filter="blur(3px)"
        />
      )}
    </g>
  );
}

/* ── main component ────────────────────────────────────────── */
export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // reset tooltip on outside click
  useEffect(() => {
    const handler = () => setHovered(null);
    window.addEventListener("blur", handler);
    return () => window.removeEventListener("blur", handler);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

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
            The tools and technologies I use to build scalable systems.
          </p>
        </motion.div>

        {/* node graph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto"
        >
          <svg
            ref={svgRef}
            viewBox="20 40 960 370"
            className="w-full"
            style={{ overflow: "visible" }}
            onMouseLeave={() => {
              setHovered(null);
              setTooltip(null);
            }}
          >
            {/* edges */}
            {edges.map(([aId, bId]) => {
              const a = getNode(aId);
              const b = getNode(bId);
              const active = isEdgeActive(aId, bId, hovered);
              return (
                <AnimatedEdge
                  key={`${aId}-${bId}`}
                  a={{ x: a.x, y: a.y }}
                  b={{ x: b.x, y: b.y }}
                  active={active}
                  colorA={a.color}
                  colorB={b.color}
                />
              );
            })}

            {/* nodes */}
            {nodes.map((node, i) => {
              const Icon = node.icon;
              const isHovered = hovered === node.id;
              const connected = isConnectedTo(node.id, hovered);
              const dimmed = hovered && !isHovered && !connected;
              const showColor = isHovered || connected;

              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: dimmed ? 0.2 : 1,
                    scale: isHovered ? 1.18 : 1,
                  }}
                  whileInView={{ opacity: dimmed ? 0.2 : 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px`, cursor: "default" }}
                  onMouseEnter={() => {
                    setHovered(node.id);
                    setTooltip({ id: node.id, x: node.x, y: node.y });
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                    setTooltip(null);
                  }}
                >
                  {/* outer glow ring when hovered */}
                  {isHovered && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={NODE_R + 14}
                      fill="none"
                      stroke={node.color}
                      strokeWidth={1}
                      strokeOpacity={0.3}
                      style={{
                        filter: `drop-shadow(0 0 8px ${node.color})`,
                      }}
                    />
                  )}

                  {/* inner ring for connected */}
                  {connected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={NODE_R + 8}
                      fill="none"
                      stroke={node.color}
                      strokeWidth={0.8}
                      strokeOpacity={0.4}
                    />
                  )}

                  {/* icon background circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_R}
                    fill={isHovered ? `${node.color}18` : "rgba(255,255,255,0.03)"}
                    stroke={
                      isHovered
                        ? node.color
                        : connected
                        ? `${node.color}60`
                        : "rgba(255,255,255,0.1)"
                    }
                    strokeWidth={isHovered ? 1.5 : 1}
                    style={{ transition: "all 0.3s ease" }}
                  />

                  {/* icon (via foreignObject) */}
                  <foreignObject
                    x={node.x - 16}
                    y={node.y - 16}
                    width={32}
                    height={32}
                    style={{ overflow: "visible" }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <Icon
                        size={22}
                        style={{
                          color: showColor
                            ? node.color
                            : "rgba(255,255,255,0.55)",
                          transition: "color 0.3s ease",
                          filter: isHovered
                            ? `drop-shadow(0 0 6px ${node.color})`
                            : "none",
                        }}
                      />
                    </div>
                  </foreignObject>

                  {/* label below node */}
                  <text
                    x={node.x}
                    y={node.y + NODE_R + 16}
                    textAnchor="middle"
                    fontSize={10.5}
                    fontFamily="Inter, sans-serif"
                    fontWeight={isHovered ? 600 : 400}
                    fill={
                      isHovered
                        ? node.color
                        : connected
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(255,255,255,0.4)"
                    }
                    style={{ transition: "fill 0.3s ease", userSelect: "none" }}
                  >
                    {node.name}
                  </text>
                </motion.g>
              );
            })}

            {/* tooltip rendered in SVG space */}
            <AnimatePresence>
              {tooltip && hovered && (() => {
                const node = getNode(hovered);
                const above = node.y > 220;
                const ty = above ? node.y - NODE_R - 48 : node.y + NODE_R + 34;
                const tw = 160;
                const tx = Math.max(20, Math.min(node.x - tw / 2, 820));
                return (
                  <motion.g
                    key={hovered + "-tooltip"}
                    initial={{ opacity: 0, y: above ? 4 : -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                    style={{ pointerEvents: "none" }}
                  >
                    <rect
                      x={tx}
                      y={ty}
                      width={tw}
                      height={38}
                      rx={8}
                      fill="rgba(15,20,25,0.92)"
                      stroke={node.color}
                      strokeWidth={0.8}
                      strokeOpacity={0.5}
                    />
                    <foreignObject x={tx + 8} y={ty + 4} width={tw - 16} height={32}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 9.5,
                          lineHeight: 1.4,
                          color: "rgba(255,255,255,0.72)",
                          fontFamily: "Inter, sans-serif",
                          textAlign: "center",
                        }}
                      >
                        {node.tooltip}
                      </p>
                    </foreignObject>
                  </motion.g>
                );
              })()}
            </AnimatePresence>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
