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

const skills = [
  {
    name: "HTML",
    icon: SiHtml5,
    color: "#E34F26",
    category: "Frontend",
    description: "Semantic markup, accessibility, structured web content.",
  },
  {
    name: "CSS",
    icon: Palette,
    color: "#1572B6",
    category: "Frontend",
    description: "Responsive layouts, animations, modern design systems.",
    isLucide: true,
  },
  {
    name: "JavaScript",
    icon: SiJavascript,
    color: "#F7DF1E",
    category: "Frontend",
    description: "ES6+, async patterns, DOM interaction, event-driven logic.",
  },
  {
    name: "Node.js",
    icon: SiNodedotjs,
    color: "#339933",
    category: "Backend",
    description: "Server-side runtime, REST APIs, event loop architecture.",
  },
  {
    name: "Express.js",
    icon: SiExpress,
    color: "#ffffff",
    category: "Backend",
    description: "Routing, middleware, RESTful API design patterns.",
  },
  {
    name: "MongoDB",
    icon: SiMongodb,
    color: "#47A248",
    category: "Database",
    description: "Document storage, aggregation pipelines, schema design.",
  },
  {
    name: "EJS",
    icon: FileCode2,
    color: "#A9225C",
    category: "Frontend",
    description: "Embedded JavaScript templating for server-rendered views.",
    isLucide: true,
  },
  {
    name: "Git",
    icon: SiGit,
    color: "#F05032",
    category: "Tools",
    description: "Version control, branching workflows, collaborative coding.",
  },
  {
    name: "VS Code",
    icon: Code2,
    color: "#007ACC",
    category: "Tools",
    description: "Primary development environment, extensions, debugging.",
    isLucide: true,
  },
  {
    name: "AI-Assisted Dev",
    icon: SiOpenai,
    color: "#10a37f",
    category: "Tools",
    description: "AI tooling for code review, rapid prototyping, productivity.",
  },
];

const categories = ["All", "Frontend", "Backend", "Database", "Tools"];

const connections: [string, string][] = [
  ["HTML", "CSS"],
  ["CSS", "JavaScript"],
  ["JavaScript", "Node.js"],
  ["Node.js", "Express.js"],
  ["Express.js", "MongoDB"],
  ["JavaScript", "EJS"],
  ["Node.js", "Git"],
];

export function Skills() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filtered =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const isConnected = (skillName: string) => {
    if (!hoveredSkill) return false;
    return connections.some(
      ([a, b]) =>
        (a === hoveredSkill && b === skillName) ||
        (b === hoveredSkill && a === skillName)
    );
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Technical Arsenal
          </h2>
          <p className="text-muted-foreground text-lg">
            The tools and technologies I use to build scalable systems.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-testid={`filter-${cat.toLowerCase()}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                  : "bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill cards grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((skill, index) => {
              const Icon = skill.icon;
              const connected = isConnected(skill.name);
              const dimmed =
                hoveredSkill &&
                hoveredSkill !== skill.name &&
                !connected;

              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: dimmed ? 0.3 : 1,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  whileHover={{ scale: 1.08, y: -6 }}
                  onHoverStart={() => setHoveredSkill(skill.name)}
                  onHoverEnd={() => setHoveredSkill(null)}
                  data-testid={`skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  className="relative group flex flex-col items-center gap-3 p-5 rounded-2xl bg-card border border-border cursor-default select-none"
                  style={{
                    boxShadow:
                      hoveredSkill === skill.name
                        ? `0 0 24px 4px ${skill.color}30, 0 4px 16px rgba(0,0,0,0.4)`
                        : connected
                        ? `0 0 14px 2px ${skill.color}20`
                        : undefined,
                    borderColor:
                      hoveredSkill === skill.name
                        ? `${skill.color}60`
                        : connected
                        ? `${skill.color}30`
                        : undefined,
                    transition:
                      "box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.25s ease",
                  }}
                >
                  {/* Connected indicator */}
                  {connected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-primary"
                      style={{ boxShadow: "0 0 8px hsl(var(--primary))" }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300"
                    style={{
                      background:
                        hoveredSkill === skill.name
                          ? `${skill.color}18`
                          : "transparent",
                    }}
                  >
                    {skill.isLucide ? (
                      <Icon
                        size={28}
                        style={{
                          color:
                            hoveredSkill === skill.name
                              ? skill.color
                              : "hsl(var(--muted-foreground))",
                          transition: "color 0.3s ease",
                        }}
                      />
                    ) : (
                      <Icon
                        size={28}
                        style={{
                          color:
                            hoveredSkill === skill.name
                              ? skill.color
                              : "hsl(var(--muted-foreground))",
                          transition: "color 0.3s ease",
                        }}
                      />
                    )}
                  </div>

                  {/* Name */}
                  <span className="text-sm font-medium text-foreground text-center leading-tight">
                    {skill.name}
                  </span>

                  {/* Category badge */}
                  <span className="text-[10px] text-muted-foreground font-mono tracking-wide">
                    {skill.category}
                  </span>

                  {/* Hover tooltip description */}
                  <AnimatePresence>
                    {hoveredSkill === skill.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full z-20 w-52 pointer-events-none"
                      >
                        <div className="mt-2 bg-card border border-border rounded-xl px-3 py-2.5 shadow-xl text-center">
                          <p className="text-xs text-muted-foreground leading-snug">
                            {skill.description}
                          </p>
                        </div>
                        <div
                          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-l border-t border-border rotate-45"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Connection legend */}
        {hoveredSkill && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs text-muted-foreground mt-10 font-mono"
          >
            Related technologies highlighted
          </motion.p>
        )}
      </div>
    </section>
  );
}
