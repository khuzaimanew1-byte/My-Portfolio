import { motion } from "framer-motion";
import { GithubIcon } from "lucide-react";

export function Github() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <a 
          href="https://github.com/khuzaimanew1-byte/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block group"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 md:p-12 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/10 transition-colors" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                <GithubIcon className="w-10 h-10 text-foreground" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Explore My Code</h3>
                <p className="text-muted-foreground mb-4">
                  Check out my recent contributions, open-source projects, and technical experiments.
                </p>
                <div className="flex items-center gap-2 justify-center md:justify-start text-primary font-medium text-sm">
                  <span>github.com/khuzaimanew1-byte</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          </motion.div>
        </a>
      </div>
    </section>
  );
}
