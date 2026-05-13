import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Philosophy } from "@/components/Philosophy";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { Github } from "@/components/Github";
import { Contact } from "@/components/Contact";
import { CinematicBackground } from "@/components/CinematicBackground";

export default function Home() {
  return (
    <div className="bg-transparent text-foreground min-h-screen font-sans selection:bg-primary selection:text-primary-foreground">
      <CinematicBackground />
      <Hero />
      <About />
      <Skills />
      <Philosophy />
      <ProjectShowcase />
      <Github />
      <Contact />
    </div>
  );
}
