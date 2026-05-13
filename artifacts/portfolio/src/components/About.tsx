import { motion } from "framer-motion";
import aboutImg from "@assets/Gemini_Generated_Image_msuzvumsuzvumsuz_1778584568772.png";

const CAPABILITIES = [
  { code: "01", label: "MERN Architecture",    desc: "End-to-end system design"         },
  { code: "02", label: "System Design",         desc: "Scalable, maintainable structure"  },
  { code: "03", label: "Performance Eng.",      desc: "Optimised for real-world load"     },
  { code: "04", label: "UX Precision",          desc: "Interface built from intent"       },
  { code: "05", label: "Prod. Reliability",     desc: "Deployed. Tested. Trusted."        },
  { code: "06", label: "Operational Scale",     desc: "Built to grow, not to break"       },
];

const TRAITS = ["DETAIL-ORIENTED", "ANALYTICAL MINDSET", "STRUCTURED WORKFLOW", "SELF-DIRECTED"];

const CORNER_MARKS = [
  "-top-2.5 -left-2.5 border-t border-l",
  "-top-2.5 -right-2.5 border-t border-r",
  "-bottom-2.5 -left-2.5 border-b border-l",
  "-bottom-2.5 -right-2.5 border-b border-r",
];

export function About() {
  return (
    <section id="about" className="py-16 lg:py-20 relative overflow-hidden bg-secondary/20">

      {/* Blueprint micro-grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.028,
          backgroundImage: [
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px)",
            "linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 lg:gap-14 xl:gap-16 items-start">

          {/* ── LEFT: Portrait as Presence ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[260px] lg:max-w-none"
          >
            {/* Architectural corner marks */}
            {CORNER_MARKS.map((cls, i) => (
              <div key={i} className={`absolute w-4 h-4 border-primary/35 z-20 ${cls}`} />
            ))}

            {/* Atmospheric glow — pulsing slowly */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-6 pointer-events-none z-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 28%, hsl(var(--primary)/0.10) 0%, transparent 72%)",
              }}
            />

            {/* Image frame */}
            <div
              className="relative overflow-hidden rounded-lg aspect-[3/4]"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(37,208,208,0.07), 0 28px 80px rgba(0,0,0,0.55)",
              }}
            >
              {/* Blueprint horizontal scanlines */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(37,208,208,0.032) 1px, transparent 1px)",
                  backgroundSize: "100% 44px",
                }}
              />
              {/* Color overlay */}
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
              {/* Bottom fade into section */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(to top, rgba(4,6,10,0.50) 0%, transparent 42%)",
                }}
              />
              <img
                src={aboutImg}
                alt="Khuzaima Asif"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Architectural bottom label */}
            <div className="mt-3.5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/45 flex-shrink-0" />
              <div className="flex-1 h-px bg-primary/10" />
              <span className="font-mono text-[8px] tracking-[0.28em] text-primary/28 uppercase whitespace-nowrap">
                Full Stack / Systems
              </span>
              <div className="flex-1 h-px bg-primary/10" />
            </div>
          </motion.div>

          {/* ── RIGHT: Cognitive Identity System ── */}
          <div className="flex flex-col">

            {/* 1. Identity Signal */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mb-7"
            >
              <p className="font-mono text-[10px] tracking-[0.36em] text-primary/45 mb-3 uppercase">
                Architecture of Care — 01
              </p>
              <h2
                className="font-black text-foreground leading-[0.88]"
                style={{
                  fontSize: "clamp(2.1rem, 4.5vw, 3.2rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                SYSTEMS
                <br />
                <span className="text-primary">THINKER.</span>
                <br />
                PRECISION
                <br />
                BUILDER.
              </h2>
            </motion.div>

            {/* 2. Philosophy Centerpiece */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mb-8 flex gap-3.5"
            >
              {/* Cinematic glowing accent line */}
              <div
                className="flex-shrink-0 w-px rounded-full"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, hsl(var(--primary)/0.65) 15%, hsl(var(--primary)/0.22) 85%, transparent)",
                }}
              />
              <div style={{ maxWidth: 380 }}>
                <p
                  className="text-foreground/78 font-light leading-[1.72]"
                  style={{ fontSize: "clamp(0.91rem, 1.45vw, 1.04rem)" }}
                >
                  Proactively identifies and resolves
                  <br />
                  inconsistencies in logic, architecture,
                  <br />
                  and user flow —
                </p>
                <p
                  className="text-foreground/48 font-light italic leading-[1.72] mt-1"
                  style={{ fontSize: "clamp(0.91rem, 1.45vw, 1.04rem)" }}
                >
                  consistently raising final quality
                  <br />
                  before release, not after.
                </p>
              </div>
            </motion.div>

            {/* 3. Capability System */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[8px] tracking-[0.3em] text-muted-foreground/38 uppercase">
                  Capability System
                </span>
                <div className="flex-1 h-px bg-border/25" />
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
                {CAPABILITIES.map((cap, i) => (
                  <motion.div
                    key={cap.code}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.32 + i * 0.055 }}
                    className="group cursor-default"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono text-[7px] text-primary/32 tracking-widest">
                        {cap.code}
                      </span>
                      <div className="flex-1 h-px bg-primary/10 group-hover:bg-primary/25 transition-colors duration-300" />
                    </div>
                    <p className="text-[11px] font-semibold text-foreground/72 tracking-tight leading-snug">
                      {cap.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground/48 mt-0.5 leading-snug">
                      {cap.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 4. Behavioral Metadata */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.44 }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-5 h-px bg-primary/18" />
                <span className="font-mono text-[8px] tracking-[0.28em] text-muted-foreground/28 uppercase">
                  Behavioral Metadata
                </span>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                {TRAITS.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/38"
                  >
                    <span className="text-primary/32 mr-1">_</span>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
