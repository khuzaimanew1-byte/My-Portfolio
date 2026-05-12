import { useState } from "react";
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

/* ── node layout (1000 × 420 viewBox) ─────────────────────── */
const nodes = [
  {
    id: "html",      name: "HTML",         icon: SiHtml5,    color: "#E34F26", x: 80,  y: 210,
    tooltip: "Semantic markup, accessibility, structured web content.",
  },
  {
    id: "css",       name: "CSS",          icon: Palette,    color: "#1572B6", x: 240, y: 90,
    tooltip: "Responsive layouts, animations, modern design systems.",  isLucide: true,
  },
  {
    id: "ejs",       name: "EJS",          icon: FileCode2,  color: "#B9473A", x: 240, y: 330,
    tooltip: "Embedded JS templating for server-rendered views.",       isLucide: true,
  },
  {
    id: "js",        name: "JavaScript",   icon: SiJavascript, color: "#F7DF1E", x: 420, y: 210,
    tooltip: "ES6+, async patterns, DOM interaction, event-driven logic.",
  },
  {
    id: "nodejs",    name: "Node.js",      icon: SiNodedotjs,  color: "#3C873A", x: 580, y: 80,
    tooltip: "Server-side runtime, REST APIs, event loop architecture.",
  },
  {
    id: "git",       name: "Git",          icon: SiGit,        color: "#F05032", x: 580, y: 340,
    tooltip: "Version control, branching workflows, collaborative coding.",
  },
  {
    id: "express",   name: "Express.js",   icon: SiExpress,    color: "#cccccc", x: 740, y: 210,
    tooltip: "Routing, middleware, RESTful API design patterns.",
  },
  {
    id: "mongodb",   name: "MongoDB",      icon: SiMongodb,    color: "#47A248", x: 900, y: 90,
    tooltip: "Document storage, aggregation pipelines, schema design.",
  },
  {
    id: "vscode",    name: "VS Code",      icon: Code2,        color: "#007ACC", x: 900, y: 210,
    tooltip: "Primary development environment, extensions, debugging.",   isLucide: true,
  },
  {
    id: "ai",        name: "AI Dev",       icon: SiOpenai,     color: "#10a37f", x: 900, y: 340,
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

function getNode(id: string) {
  return nodes.find((n) => n.id === id)!;
}

function isConnectedTo(nodeId: string, hovered: string | null) {
  if (!hovered || hovered === nodeId) return false;
  return edges.some(
    ([a, b]) => (a === hovered && b === nodeId) || (b === hovered && a === nodeId)
  );
}

const NODE_R = 26;

/* ── DrawEdge — invisible by default, draws in on hover ────── */
let edgeKeyCounter = 0;

function DrawEdge({
  ax, ay, bx, by,
  colorA, colorB,
  active,
}: {
  ax: number; ay: number; bx: number; by: number;
  colorA: string; colorB: string;
  active: boolean;
}) {
  const len = Math.hypot(bx - ax, by - ay);
  // unique id per mount so gradients don't collide
  const [gid] = useState(() => `eg-${edgeKeyCounter++}`);

  return (
    <g>
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse"
          x1={ax} y1={ay} x2={bx} y2={by}>
          <stop offset="0%"   stopColor={colorA} />
          <stop offset="100%" stopColor={colorB} />
        </linearGradient>
      </defs>

      {/* invisible until hover — uses strokeDashoffset to draw the line */}
      <line
        x1={ax} y1={ay} x2={bx} y2={by}
        stroke={`url(#${gid})`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={active ? 0 : len}
        strokeOpacity={active ? 0.85 : 0}
        style={{ transition: "stroke-dashoffset 0.5s ease, stroke-opacity 0.3s ease" }}
      />

      {/* glow duplicate */}
      <line
        x1={ax} y1={ay} x2={bx} y2={by}
        stroke={`url(#${gid})`}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={active ? 0 : len}
        strokeOpacity={active ? 0.15 : 0}
        filter="blur(4px)"
        style={{ transition: "stroke-dashoffset 0.5s ease, stroke-opacity 0.3s ease" }}
      />

      {/* travelling dot when active */}
      {active && (
        <circle r={2.5} fill={colorA} opacity={0.9}>
          <animateMotion
            dur="0.9s"
            begin="0s"
            repeatCount="indefinite"
            path={`M${ax},${ay} L${bx},${by}`}
          />
        </circle>
      )}
    </g>
  );
}

/* ── main component ────────────────────────────────────────── */
export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* dot-grid bg */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto"
        >
          <svg
            viewBox="20 40 960 380"
            className="w-full"
            style={{ overflow: "visible" }}
            onMouseLeave={() => setHovered(null)}
          >
            {/* ── edges (drawn only when active) ── */}
            {edges.map(([aId, bId]) => {
              const a = getNode(aId);
              const b = getNode(bId);
              const active =
                hovered === aId ||
                hovered === bId;
              return (
                <DrawEdge
                  key={`${aId}-${bId}`}
                  ax={a.x} ay={a.y}
                  bx={b.x} by={b.y}
                  colorA={a.color}
                  colorB={b.color}
                  active={active}
                />
              );
            })}

            {/* ── nodes ── */}
            {nodes.map((node, i) => {
              const Icon = node.icon;
              const isHovered  = hovered === node.id;
              const connected  = isConnectedTo(node.id, hovered);
              const dimmed     = hovered !== null && !isHovered && !connected;

              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease: "easeOut" }}
                  animate={{ opacity: dimmed ? 0.18 : 1 }}
                  style={{
                    transformOrigin: `${node.x}px ${node.y}px`,
                    cursor: "default",
                  }}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* outer glow pulse when hovered */}
                  {isHovered && (
                    <circle
                      cx={node.x} cy={node.y}
                      r={NODE_R + 16}
                      fill="none"
                      stroke={node.color}
                      strokeWidth={1}
                      strokeOpacity={0.25}
                      style={{ filter: `drop-shadow(0 0 10px ${node.color})` }}
                    />
                  )}

                  {/* ring for connected */}
                  {connected && (
                    <circle
                      cx={node.x} cy={node.y}
                      r={NODE_R + 9}
                      fill="none"
                      stroke={node.color}
                      strokeWidth={0.8}
                      strokeOpacity={0.35}
                    />
                  )}

                  {/* icon circle */}
                  <circle
                    cx={node.x} cy={node.y}
                    r={NODE_R}
                    fill={isHovered ? `${node.color}1A` : "rgba(255,255,255,0.03)"}
                    stroke={
                      isHovered  ? node.color :
                      connected  ? `${node.color}55` :
                                   "rgba(255,255,255,0.1)"
                    }
                    strokeWidth={isHovered ? 1.5 : 0.8}
                    style={{ transition: "all 0.3s ease" }}
                  />

                  {/* icon via foreignObject — always real brand color */}
                  <foreignObject
                    x={node.x - 14} y={node.y - 14}
                    width={28} height={28}
                    style={{ overflow: "visible" }}
                  >
                    <div
                      style={{
                        width: 28, height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <Icon
                        size={20}
                        style={{
                          color: node.color,
                          filter: isHovered
                            ? `drop-shadow(0 0 5px ${node.color})`
                            : "none",
                          transition: "filter 0.3s ease",
                        }}
                      />
                    </div>
                  </foreignObject>

                  {/* name label */}
                  <text
                    x={node.x} y={node.y + NODE_R + 15}
                    textAnchor="middle"
                    fontSize={10}
                    fontFamily="Inter, sans-serif"
                    fontWeight={isHovered ? 600 : 400}
                    fill={
                      isHovered  ? node.color :
                      connected  ? "rgba(255,255,255,0.75)" :
                                   "rgba(255,255,255,0.38)"
                    }
                    style={{ transition: "fill 0.3s ease", userSelect: "none" }}
                  >
                    {node.name}
                  </text>

                  {/* tooltip — only on hover, above or below node */}
                  <AnimatePresence>
                    {isHovered && (() => {
                      const above = node.y > 220;
                      const ty = above
                        ? node.y - NODE_R - 52
                        : node.y + NODE_R + 20;
                      const tw = 168;
                      const tx = Math.max(20, Math.min(node.x - tw / 2, 812));

                      return (
                        <motion.g
                          key="tip"
                          initial={{ opacity: 0, y: above ? 4 : -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          style={{ pointerEvents: "none" }}
                        >
                          <rect
                            x={tx} y={ty}
                            width={tw} height={40}
                            rx={8}
                            fill="rgba(10,15,20,0.94)"
                            stroke={node.color}
                            strokeWidth={0.8}
                            strokeOpacity={0.6}
                          />
                          <foreignObject
                            x={tx + 8} y={ty + 5}
                            width={tw - 16} height={32}
                          >
                            <p
                              style={{
                                margin: 0,
                                fontSize: 9,
                                lineHeight: 1.5,
                                color: "rgba(255,255,255,0.68)",
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
                </motion.g>
              );
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
