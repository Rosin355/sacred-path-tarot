import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import jessicaImage from "@/assets/jessica-marin.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-32 lg:py-40">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Text Content - Takes 7 columns */}
          <div className="lg:col-span-7 space-y-10 animate-fade-in-slow">
            <div className="inline-flex items-center gap-3 px-5 py-2 minimal-border bg-card/30 backdrop-blur-sm">
              <div className="w-2 h-2 bg-accent" />
              <span className="text-sm tracking-wider uppercase text-muted-foreground font-light">
                Metodo Esoterico & Magico-Pratico
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] tracking-tight">
              TAROCCHI
              <br />
              <span className="text-accent-gradient">PER</span>
              <br />
              ILLUMINARSI
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl font-light">
              Non semplice divinazione, ma un viaggio profondo verso la{" "}
              <span className="text-accent font-medium">Saggezza</span> attraverso
              13 anni di pratica magica e studio esoterico approfondito.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" variant="default" className="group">
                Inizia il Percorso
                <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="elegant-underline">
                Scopri il Metodo
              </Button>
            </div>
          </div>

          {/* Jessica Image - Takes 5 columns, positioned top-right */}
          <div className="lg:col-span-5 relative animate-scale-in">
            <div className="relative minimal-border overflow-hidden bg-card/10 backdrop-blur-sm aspect-[3/4] max-w-md ml-auto">
              <img
                src={jessicaImage}
                alt="Jessica Marin - Tarologa e Maestra Spirituale"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent">
                <p className="text-sm font-light text-muted-foreground tracking-wide">JESSICA MARIN</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Tarologa • Maestra Spirituale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1.2s" }}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs tracking-widest uppercase font-light">Scorri</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
