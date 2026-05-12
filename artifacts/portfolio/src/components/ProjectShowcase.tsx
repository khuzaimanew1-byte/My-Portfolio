import { motion } from "framer-motion";
import pos1 from "@/assets/nexus-pos-1.png";
import pos2 from "@/assets/nexus-pos-2.png";
import pos3 from "@/assets/nexus-pos-3.png";
import pos4 from "@/assets/nexus-pos-4.png";

export function ProjectShowcase() {
  return (
    <section id="project" className="py-32 relative bg-secondary/20 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Flagship Project
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Nexus POS</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A fully functional, web-based Point of Sale application for modern small businesses. 
            Focused on three principles: speed, clarity, and professional UX.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold">The Problem</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-destructive font-mono shrink-0">SLOW:</span>
                <span className="text-muted-foreground">Too many clicks to complete a single sale</span>
              </li>
              <li className="flex gap-4">
                <span className="text-destructive font-mono shrink-0">COMPLEX:</span>
                <span className="text-muted-foreground">Features buried in nested menus, hours of staff training</span>
              </li>
              <li className="flex gap-4">
                <span className="text-destructive font-mono shrink-0">NO DATA:</span>
                <span className="text-muted-foreground">No visibility into product performance or revenue trends</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold">The Stack</h3>
            <div className="flex flex-wrap gap-3">
              {['React', 'Node.js', 'Express.js', 'MongoDB'].map(tech => (
                <span key={tech} className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium">
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 border border-border rounded-xl bg-card">
                <div className="text-3xl font-bold text-primary mb-1">1-Click</div>
                <div className="text-sm text-muted-foreground">Cart Checkout Flow</div>
              </div>
              <div className="p-4 border border-border rounded-xl bg-card">
                <div className="text-3xl font-bold text-primary mb-1">9+</div>
                <div className="text-sm text-muted-foreground">Configurable Shortcuts</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-32">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-12 items-center"
          >
            <div className="w-full lg:w-[60%] aspect-video bg-card border border-border rounded-2xl overflow-hidden relative shadow-2xl">
              <img src={pos1} alt="Nexus POS Selling Screen" className="w-full h-full object-cover" />
            </div>
            <div className="w-full lg:w-[40%] space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold mb-2">01</div>
              <h3 className="text-3xl font-bold">The Selling Screen</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Live cart panel with real-time totals. Quick-code lookup for rapid entry. One-click add to cart with intuitive quantity controls. Designed for high-volume environments.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row-reverse gap-12 items-center"
          >
            <div className="w-full lg:w-[60%] aspect-video bg-card border border-border rounded-2xl overflow-hidden relative shadow-2xl">
              <img src={pos2} alt="Nexus POS Analytics Dashboard" className="w-full h-full object-cover" />
            </div>
            <div className="w-full lg:w-[40%] space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold mb-2">02</div>
              <h3 className="text-3xl font-bold">Analytics Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Interactive charts plotting item volumes over time. Top product leaderboards and configurable date ranges. Turn raw sales data into actionable business intelligence.
              </p>
            </div>
          </motion.div>
          
          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-12 items-center"
          >
            <div className="w-full lg:w-[60%] aspect-video bg-card border border-border rounded-2xl overflow-hidden relative shadow-2xl">
              <img src={pos3} alt="Nexus POS Settings Screen" className="w-full h-full object-cover" />
            </div>
            <div className="w-full lg:w-[40%] space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold mb-2">03</div>
              <h3 className="text-3xl font-bold">Settings: Experience</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Three animation speed modes: Smooth, Fast, Ultra Fast. Input behavior toggles including enter key navigation, auto-focus, haptic vibration, and inline error display.
              </p>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row-reverse gap-12 items-center"
          >
            <div className="w-full lg:w-[60%] aspect-video bg-card border border-border rounded-2xl overflow-hidden relative shadow-2xl">
              <img src={pos4} alt="Nexus POS Keyboard Shortcuts" className="w-full h-full object-cover" />
            </div>
            <div className="w-full lg:w-[40%] space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold mb-2">04</div>
              <h3 className="text-3xl font-bold">Keyboard Shortcuts</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Full shortcut map across Navigation, Actions, Products, and System. Click-to-reassign any key binding with a global master on/off toggle.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
