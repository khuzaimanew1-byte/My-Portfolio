import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import aboutImg from "@assets/Gemini_Generated_Image_msuzvumsuzvumsuz_1778584568772.png";

const traits = [
  'Detail-oriented',
  'Self-directed learner',
  'Analytically minded',
  'Structured workflow',
  'Reliable & thorough',
];

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-16 lg:py-24 overflow-hidden"
    >
      {/* Ambient background atmosphere */}
      <div className="absolute inset-0 bg-secondary/20 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] gap-10 lg:gap-14 items-center">

          {/* ── Portrait Column ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Atmospheric glow behind portrait */}
              <div className="absolute inset-0 -m-6 rounded-3xl bg-primary/8 blur-2xl" />
              <div className="absolute inset-0 -m-2 rounded-2xl bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-xl" />

              {/* Environmental edge lighting */}
              <div className="absolute -right-px top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
              <div className="absolute -left-px top-16 bottom-16 w-px bg-gradient-to-b from-transparent via-primary/15 to-transparent" />

              {/* Portrait with parallax */}
              <motion.div
                style={{ y: portraitY }}
                className="relative rounded-2xl overflow-hidden aspect-[3/4] w-[200px] sm:w-[230px] lg:w-[270px]"
              >
                {/* Top vignette blend */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50 z-10 pointer-events-none" />
                {/* Colour grade overlay */}
                <div className="absolute inset-0 bg-primary/8 mix-blend-soft-light z-10 pointer-events-none" />

                <img
                  src={aboutImg}
                  alt="Khuzaima in office"
                  className="w-full h-full object-cover scale-[1.02]"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* ── Content Column ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
            className="space-y-6 lg:space-y-7"
          >
            {/* Heading */}
            <div className="space-y-1">
              <p className="text-xs tracking-[0.18em] text-primary/60 uppercase font-medium">Identity</p>
              <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-bold tracking-tight leading-[1.2]">
                The Architecture of Care
              </h2>
            </div>

            {/* Body paragraphs */}
            <div className="space-y-4 text-sm lg:text-[0.9375rem] text-muted-foreground leading-[1.75]">
              <p>
                Results-driven Full Stack Developer with 1+ year of experience architecting and
                delivering production-grade web applications. I combine system-design thinking
                with clean, maintainable code — building solutions that perform reliably under
                real-world conditions.
              </p>
              <p>
                Proficient across the full MERN stack with a focus on operational efficiency,
                performance optimisation, and intuitive UX.
              </p>
            </div>

            {/* Embedded quote — no heavy card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative pl-5"
            >
              <div className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />
              <p className="text-foreground/80 italic text-sm lg:text-[0.9375rem] leading-[1.7] font-normal">
                "Proactively identifies and resolves inconsistencies in logic, architecture, and
                user flow — consistently raising final quality before release rather than after."
              </p>
            </motion.div>

            {/* Premium trait tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {traits.map((attr, i) => (
                <motion.span
                  key={attr}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                  className="px-3 py-1 rounded-full text-[0.7rem] tracking-wide font-medium
                    text-muted-foreground/80 border border-border/50 bg-background/30
                    backdrop-blur-sm hover:border-primary/30 hover:text-foreground/90
                    transition-colors duration-300"
                >
                  {attr}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
