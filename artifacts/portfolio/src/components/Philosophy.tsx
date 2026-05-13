import { motion } from "framer-motion";

const pillars = [
  {
    title: "Design First",
    desc: "I start from the user's perspective. Every system begins with clarity of purpose."
  },
  {
    title: "Structure Everything",
    desc: "Clean architecture isn't optional. Scalable code is the only code worth writing."
  },
  {
    title: "Experimental Mindset",
    desc: "I iterate fast, fail small, and learn from every build."
  },
  {
    title: "Built to Last",
    desc: "I optimize for maintainability. The best systems are the ones that grow with you."
  }
];

export function Philosophy() {
  return (
    <section className="py-10 lg:py-14 bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-7">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Core Philosophy</h2>
          <p className="text-muted-foreground text-sm lg:text-base max-w-2xl">The principles that guide my engineering process.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-4 lg:p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors group"
            >
              <div className="text-primary font-mono text-xs mb-2 opacity-50 group-hover:opacity-100 transition-opacity">0{index + 1}</div>
              <h3 className="text-base font-bold mb-1.5 text-foreground">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
