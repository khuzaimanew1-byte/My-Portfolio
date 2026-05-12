import { motion } from "framer-motion";
import heroImg from "@assets/my-img_1778584210434.png";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container relative z-10 mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Hi, I'm Khuzaima.
              <br />
              <span className="text-primary">I build scalable digital systems.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              Full Stack Developer focused on structure, clarity, and usability.
            </p>
          </div>
          
          <div className="flex items-center gap-4 pt-4">
            <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => {
              document.getElementById('project')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              View My Work
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-primary/20 hover:bg-primary/10" onClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Get In Touch
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative aspect-square max-w-md mx-auto w-full"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <img 
            src={heroImg} 
            alt="Khuzaima Asif" 
            className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-sm tracking-widest uppercase">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}
