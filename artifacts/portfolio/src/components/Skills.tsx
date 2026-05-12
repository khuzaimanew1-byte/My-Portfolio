import { motion } from "framer-motion";

const skills = [
  { name: 'HTML', category: 'frontend' },
  { name: 'CSS', category: 'frontend' },
  { name: 'JavaScript', category: 'frontend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'Express.js', category: 'backend' },
  { name: 'MongoDB', category: 'database' },
  { name: 'EJS', category: 'frontend' },
  { name: 'Git', category: 'tool' },
  { name: 'VS Code', category: 'tool' },
  { name: 'AI-Assisted Dev', category: 'tool' }
];

export function Skills() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Technical Arsenal</h2>
          <p className="text-muted-foreground text-lg">The tools and technologies I use to build scalable systems.</p>
        </motion.div>

        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="px-6 py-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-primary/20 flex items-center justify-center cursor-default"
            >
              <span className="font-mono text-foreground font-medium">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
