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

/* ── skills ────────────────────────────────────────────────── */
const skills = [
  { id: "html",    name: "HTML",        Icon: SiHtml5,      color: "#E34F26", left: 3,   top: 36, size: 52, dur: 3.2, delay: 0.0 },
  { id: "css",     name: "CSS",         Icon: Palette,      color: "#1572B6", left: 17,  top: 8,  size: 48, dur: 2.7, delay: 0.8, isLucide: true },
  { id: "ejs",     name: "EJS",         Icon: FileCode2,    color: "#B9473A", left: 15,  top: 68, size: 34, dur: 3.7, delay: 1.4, isLucide: true },
  { id: "js",      name: "JavaScript",  Icon: SiJavascript, color: "#F7DF1E", left: 33,  top: 38, size: 58, dur: 2.5, delay: 0.4 },
  { id: "nodejs",  name: "Node.js",     Icon: SiNodedotjs,  color: "#3C873A", left: 51,  top: 6,  size: 50, dur: 3.1, delay: 0.2 },
  { id: "git",     name: "Git",         Icon: SiGit,        color: "#F05032", left: 49,  top: 70, size: 40, dur: 3.9, delay: 1.6 },
  { id: "express", name: "Express.js",  Icon: SiExpress,    color: "#cccccc", left: 64,  top: 40, size: 46, dur: 2.9, delay: 1.0 },
  { id: "mongodb", name: "MongoDB",     Icon: SiMongodb,    color: "#47A248", left: 78,  top: 6,  size: 50, dur: 3.4, delay: 0.6 },
  { id: "vscode",  name: "VS Code",     Icon: Code2,        color: "#007ACC", left: 80,  top: 62, size: 40, dur: 2.6, delay: 1.2, isLucide: true },
  { id: "ai",      name: "AI Dev",      Icon: SiOpenai,     color: "#10a37f", left: 91,  top: 34, size: 42, dur: 3.0, delay: 0.6 },
] as const;

export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Technical Arsenal
          </h2>
          <p className="text-muted-foreground text-lg">
            The tools and technologies I use to build scalable systems.
          </p>
        </motion.div>

        {/* floating field */}
        <div
          className="relative mx-auto"
          style={{ height: 420, maxWidth: 960 }}
        >
          {skills.map((skill, i) => {
            const { Icon } = skill;
            const isHov = hovered === skill.id;
            const dimmed = hovered !== null && !isHov;

            return (
              /* outer: entrance only */
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.3 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: `${skill.left}%`,
                  top: `${skill.top}%`,
                  /* CSS float animation — fully independent of framer */
                  animation: `skillFloat ${skill.dur}s ease-in-out ${skill.delay}s infinite`,
                  willChange: "transform",
                }}
              >
                {/* inner: hover scale + tooltip */}
                <motion.div
                  whileHover={{ scale: 1.35 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  onHoverStart={() => setHovered(skill.id)}
                  onHoverEnd={() => setHovered(null)}
                  className="relative flex items-center justify-center cursor-default select-none"
                  style={{ width: skill.size, height: skill.size }}
                >
                  <Icon
                    size={skill.size}
                    style={{
                      color: skill.color,
                      opacity: dimmed ? 0.15 : 1,
                      filter: isHov
                        ? `drop-shadow(0 0 12px ${skill.color}) drop-shadow(0 0 24px ${skill.color}77)`
                        : `drop-shadow(0 2px 8px ${skill.color}55)`,
                      transition: "opacity 0.3s ease, filter 0.3s ease",
                    }}
                  />

                  {/* tooltip — name only */}
                  <AnimatePresence>
                    {isHov && (
                      <motion.div
                        key="tip"
                        initial={{ opacity: 0, y: 8, scale: 0.88 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.88 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute pointer-events-none z-40"
                        style={{
                          bottom: `calc(100% + 12px)`,
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <div
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap tracking-wide"
                          style={{
                            background: "rgba(6,10,16,0.95)",
                            border: `1px solid ${skill.color}66`,
                            color: skill.color,
                            boxShadow: `0 4px 20px ${skill.color}33`,
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          {skill.name}
                        </div>
                        {/* caret */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: -4,
                            left: "50%",
                            transform: "translateX(-50%) rotate(45deg)",
                            width: 8,
                            height: 8,
                            background: "rgba(6,10,16,0.95)",
                            borderRight: `1px solid ${skill.color}55`,
                            borderBottom: `1px solid ${skill.color}55`,
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
