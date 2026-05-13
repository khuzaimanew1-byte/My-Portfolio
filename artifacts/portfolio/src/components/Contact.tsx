import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Contact() {
  return (
    <section id="contact" className="py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-6 text-center max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Let's build something together.</h2>
        <p className="text-base lg:text-lg text-muted-foreground mb-8">
          Looking for a developer who understands both the code and the business goals? My inbox is open.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="h-12 px-7 text-base w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href="mailto:Khuzaimadeveloper777@gmail.com">
              <Mail className="mr-2 h-4 w-4" />
              Email Me
            </a>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-7 text-base w-full sm:w-auto" asChild>
            <a href="https://github.com/khuzaimanew1-byte/" target="_blank" rel="noopener noreferrer">
              GitHub <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
