import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";
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

/* ─── types ─── */
interface LightboxItem {
  src: string;
  alt: string;
  number: string;
  title: string;
  description: string;
  index: number;
}

/* ══════════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════════════ */
function Lightbox({
  item,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  item: LightboxItem;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  /* ESC / arrow key handling */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      key="lb-backdrop"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      onClick={onClose}
    >
      {/* atmospheric layered backdrop */}
      <div className="absolute inset-0 bg-black/92" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(45,212,191,0.05) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backdropFilter: "blur(2px)" }}
      />

      {/* ── top bar ── */}
      <div
        className="absolute top-0 inset-x-0 flex items-center justify-between px-5 py-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* project label */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
            style={{
              background: "rgba(45,212,191,0.15)",
              border: "1px solid rgba(45,212,191,0.35)",
              color: "#2dd4bf",
            }}
          >
            {item.number}
          </div>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            {item.title}
          </span>
          <span
            className="text-xs font-mono"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            {item.index + 1} / {total}
          </span>
        </div>

        {/* close */}
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.14)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.07)";
          }}
        >
          <X size={15} color="rgba(255,255,255,0.75)" />
        </button>
      </div>

      {/* ── main image ── */}
      <motion.div
        key={item.src}
        className="relative flex items-center justify-center px-4 w-full"
        style={{ maxHeight: "78vh" }}
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: -6 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* subtle glow behind image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(45,212,191,0.06) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />

        <img
          src={item.src}
          alt={item.alt}
          style={{
            maxWidth: "min(92vw, 1200px)",
            maxHeight: "76vh",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            borderRadius: "12px",
            boxShadow:
              "0 40px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06)",
            display: "block",
          }}
          draggable={false}
        />
      </motion.div>

      {/* ── bottom caption + nav ── */}
      <div
        className="absolute bottom-0 inset-x-0 flex items-end justify-between px-5 py-5 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* description */}
        <p
          className="text-xs leading-relaxed max-w-lg hidden md:block"
          style={{ color: "rgba(255,255,255,0.38)" }}
        >
          {item.description}
        </p>

        {/* prev / next */}
        <div className="flex items-center gap-2 ml-auto">
          <NavBtn
            label="←"
            onClick={onPrev}
            disabled={item.index === 0}
          />
          <NavBtn
            label="→"
            onClick={onNext}
            disabled={item.index === total - 1}
          />
        </div>
      </div>
    </motion.div>
  );
}

function NavBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-9 h-9 rounded-full font-mono text-sm transition-all disabled:opacity-25 disabled:cursor-not-allowed"
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.7)",
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(255,255,255,0.14)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(255,255,255,0.07)";
      }}
    >
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════ */
export function ProjectShowcase() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openAt  = useCallback((i: number) => setActiveIndex(i), []);
  const close   = useCallback(() => setActiveIndex(null), []);
  const prev    = useCallback(() => setActiveIndex(i => (i !== null && i > 0 ? i - 1 : i)), []);
  const next    = useCallback(() => setActiveIndex(i => (i !== null && i < screens.length - 1 ? i + 1 : i)), []);

  const activeItem: LightboxItem | null =
    activeIndex !== null
      ? { ...screens[activeIndex], src: screens[activeIndex].image, index: activeIndex }
      : null;

  return (
    <>
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
            {screens.map(({ number, title, description, image, alt, reverse }, i) => (
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
                {/* Screenshot — clickable */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="w-full lg:w-[62%] relative group cursor-zoom-in"
                  onClick={() => openAt(i)}
                  role="button"
                  aria-label={`View full screenshot: ${title}`}
                >
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl shadow-black/60">
                    <img
                      src={image}
                      alt={alt}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                    {/* expand hint overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium"
                        style={{
                          background: "rgba(5,8,13,0.78)",
                          border: "1px solid rgba(45,212,191,0.3)",
                          color: "#2dd4bf",
                          backdropFilter: "blur(12px)",
                        }}
                      >
                        <Maximize2 size={11} />
                        View fullscreen
                      </div>
                    </div>
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

      {/* Cinematic lightbox */}
      <AnimatePresence>
        {activeItem && (
          <Lightbox
            item={activeItem}
            total={screens.length}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </>
  );
}
