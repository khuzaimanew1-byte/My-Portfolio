import { motion } from "framer-motion";
import aboutImg from "@assets/Gemini_Generated_Image_msuzvumsuzvumsuz_1778584568772.png";

export function About() {
  return (
    <section id="about" className="py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden aspect-[3/4] max-w-xs lg:max-w-sm mx-auto w-full"
          >
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
            <img
              src={aboutImg}
              alt="Khuzaima in office"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Architecture of Care</h2>

            <div className="space-y-4 text-base lg:text-lg text-muted-foreground leading-relaxed">
              <p>
                Results-driven Full Stack Developer with 1+ year of experience architecting and delivering production-grade web applications. I combine system-design thinking with clean, maintainable code — building solutions that perform reliably under real-world conditions.
              </p>
              <p>
                I'm proficient across the full MERN stack with a focus on operational efficiency, performance optimisation, and intuitive UX.
              </p>
              <div className="p-4 lg:p-5 rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <p className="text-foreground font-medium italic text-sm lg:text-base">
                  "Proactively identifies and resolves inconsistencies in logic, architecture, and user flow — consistently raising final quality before release rather than after."
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {['Detail-oriented', 'Self-directed learner', 'Analytically minded', 'Structured workflow', 'Reliable & thorough'].map((attr) => (
                <span key={attr} className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                  {attr}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
