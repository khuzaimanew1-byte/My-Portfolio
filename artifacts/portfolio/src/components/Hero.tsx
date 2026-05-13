import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import heroImg from "@assets/my-img_1778584210434.png";
import { Button } from "@/components/ui/button";

const PHRASES = [
  "scalable digital systems.",
  "clean, fast web apps.",
  "full-stack products.",
  "production-grade code.",
];

const TYPE_SPEED  = 60;
const DELETE_SPEED = 35;
const PAUSE_AFTER  = 1800;
const PAUSE_BEFORE = 300;

export function Hero() {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase]   = useState<"typing" | "pausing" | "deleting" | "waiting">("typing");
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const target = PHRASES[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), TYPE_SPEED);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), PAUSE_AFTER);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 0);
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), DELETE_SPEED);
      } else {
        timeout = setTimeout(() => {
          setPhraseIdx((i) => (i + 1) % PHRASES.length);
          setPhase("waiting");
        }, PAUSE_BEFORE);
      }
    } else if (phase === "waiting") {
      setPhase("typing");
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, phraseIdx]);

  const sectionRef = useRef<HTMLElement>(null);
  const [glow, setGlow] = useState({ x: "50%", y: "40%" });
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; opacity: number }[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current!.getBoundingClientRect();
    setGlow({
      x: `${e.clientX - rect.left}px`,
      y: `${e.clientY - rect.top}px`,
    });
  }, []);

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.08,
      }))
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[88vh] flex items-center justify-center overflow-hidden py-16 lg:py-20"
    >
      {/* base gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_120%_80%_at_60%_40%,hsl(var(--primary)/0.07)_0%,transparent_65%)]" />

      {/* cursor-reactive glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-none"
        style={{
          background: `radial-gradient(520px at ${glow.x} ${glow.y}, hsl(var(--primary)/0.09), transparent 70%)`,
        }}
      />

      {/* ambient particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary"
            style={{
              left: `${p.x}%`,
              top:  `${p.y}%`,
              width:  p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -24, 0],
              opacity: [p.opacity, p.opacity * 2.2, p.opacity],
            }}
            transition={{
              duration: 5 + p.id * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.id * 0.3,
            }}
          />
        ))}
      </div>

      {/* subtle grid lines */}
      <div
        className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px,transparent 1px),linear-gradient(90deg,hsl(var(--primary)) 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* content */}
      <div className="container relative z-10 mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
        {/* text side */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5 lg:gap-6"
        >
          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <span className="w-8 h-px bg-primary" />
            <span className="text-primary text-xs font-mono tracking-widest uppercase">
              Full Stack Developer
            </span>
          </motion.div>

          {/* headline */}
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.06]"
            >
              Hi, I'm{" "}
              <span className="text-primary">Khuzaima.</span>
            </motion.h1>

            {/* typed line */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground/85 min-h-[1.2em] flex items-center gap-1"
            >
              <span>I build&nbsp;</span>
              <span className="text-primary">{displayed}</span>
              <span
                className="inline-block w-[2px] h-[0.85em] bg-primary ml-0.5 align-middle"
                style={{ animation: "blink 1.05s step-end infinite" }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-base lg:text-lg text-muted-foreground max-w-[440px] leading-relaxed mt-1"
            >
              Focused on structure, clarity, and building systems that hold up under real-world conditions.
            </motion.p>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex items-center gap-3 pt-1"
          >
            <Button
              size="lg"
              className="h-10 px-6 text-sm lg:h-11 lg:px-7 lg:text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
              onClick={() => document.getElementById("project")?.scrollIntoView({ behavior: "smooth" })}
            >
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-10 px-6 text-sm lg:h-11 lg:px-7 lg:text-base border-primary/25 hover:bg-primary/8 hover:border-primary/50 transition-all"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get In Touch
            </Button>
          </motion.div>
        </motion.div>

        {/* image side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* layered glow behind photo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-full bg-primary/12 blur-3xl" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-primary/8 blur-2xl animate-pulse" style={{ animationDuration: "3s" }} />
          </div>

          <motion.img
            src={heroImg}
            alt="Khuzaima Asif"
            className="relative z-10 w-full max-w-xs lg:max-w-sm object-contain drop-shadow-2xl"
            whileHover={{ scale: 1.025 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          />
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs tracking-[0.3em] uppercase font-mono">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </motion.div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
  );
}
