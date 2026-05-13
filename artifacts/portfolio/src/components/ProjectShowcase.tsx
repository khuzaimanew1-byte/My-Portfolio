import { motion } from "framer-motion";
import pos1 from "@assets/Screenshot_2026-05-07_144050_1778585087822.png";
import pos2 from "@assets/Screenshot_2026-05-07_122847_1778585087826.png";
import pos3 from "@assets/Screenshot_2026-05-07_143902_1778585087824.png";
import pos4 from "@assets/Screenshot_2026-05-07_122942_1778585087825.png";

const screens = [
  {
    number: "01",
    title: "The Selling Screen",
    description:
      "Live cart panel with real-time totals. Quick-code lookup (#esp, #lat) for rapid entry. One-click add to cart with intuitive quantity controls and per-product stock counts. Designed for high-volume environments where every second counts.",
    image: pos1,
    alt: "Nexus POS Selling Screen",
    reverse: false,
  },
  {
    number: "02",
    title: "Analytics Dashboard",
    description:
      "Interactive area chart plotting item volumes over time with hover tooltips. Weekly, Monthly, and Yearly view modes. Top 9 product leaderboard with color-coded bar chart comparison. Turn raw sales data into actionable business intelligence.",
    image: pos2,
    alt: "Nexus POS Analytics Dashboard",
    reverse: true,
  },
  {
    number: "03",
    title: "Settings: Experience",
    description:
      "Three animation speed modes — Smooth, Fast, Ultra Fast — letting owners tune the UI to their hardware and pace. Input behavior toggles: enter key navigation, auto-focus, haptic vibration on rejection, and inline error display.",
    image: pos3,
    alt: "Nexus POS Settings Experience",
    reverse: false,
  },
  {
    number: "04",
    title: "Keyboard Shortcuts",
    description:
      "Full shortcut map across Navigation, Actions, Products, and System categories. Click any binding to reassign it instantly. A global master toggle enables or disables the entire shortcut system. Built for power users and high-volume environments.",
    image: pos4,
    alt: "Nexus POS Keyboard Shortcuts",
    reverse: true,
  },
];

export function ProjectShowcase() {
  return (
    <section
      id="project"
      className="py-10 lg:py-16 relative bg-secondary/20 border-y border-border"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="max-w-3xl mb-7 lg:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Flagship Project
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Nexus POS
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
            A fully functional, web-based Point of Sale application for modern
            small businesses — cafes, retail shops, and multi-category stores.
            Focused on three principles: speed, clarity, and professional UX.
          </p>
        </div>

        {/* Problem + Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-10">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">The Problem</h3>
            <ul className="space-y-4">
              {[
                {
                  label: "SLOW",
                  text: "Too many clicks to complete a single sale. Cashiers lose time — customers lose patience.",
                },
                {
                  label: "COMPLEX",
                  text: "Features buried in nested menus. New staff require hours of training.",
                },
                {
                  label: "NO DATA",
                  text: "No visibility into product performance, peak hours, or revenue trends.",
                },
              ].map(({ label, text }) => (
                <li key={label} className="flex gap-4 items-start">
                  <span className="text-destructive font-mono font-semibold shrink-0 mt-0.5 text-xs tracking-widest">
                    {label}
                  </span>
                  <span className="text-muted-foreground text-sm lg:text-base">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">The Stack</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "Node.js", "Express.js", "MongoDB"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { value: "4", label: "Core Screens" },
                { value: "1-Click", label: "Checkout Flow" },
                { value: "9+", label: "Configurable Shortcuts" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="p-3 border border-border rounded-xl bg-card"
                >
                  <div className="text-xl lg:text-2xl font-bold text-primary mb-0.5">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Screens */}
        <div className="space-y-10 lg:space-y-14">
          {screens.map(({ number, title, description, image, alt, reverse }) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`flex flex-col ${
                reverse ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-6 lg:gap-8 items-center`}
            >
              {/* Screenshot */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="w-full lg:w-[62%] relative group"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl shadow-black/60">
                  <img
                    src={image}
                    alt={alt}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* Text */}
              <div className="w-full lg:w-[38%] space-y-2 lg:space-y-3">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 border border-primary/30 text-primary font-bold text-xs">
                  {number}
                </div>
                <h3 className="text-xl lg:text-2xl font-bold tracking-tight">{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
