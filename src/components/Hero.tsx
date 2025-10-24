import { Button } from "@/components/ui/button";
import { Sparkles, Star } from "lucide-react";
import jessicaImage from "@/assets/jessica-marin.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cosmic background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
      
      {/* Animated stars */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-glow-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            <Star className="w-2 h-2 text-accent" fill="currentColor" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-accent animate-glow-pulse" />
              <span className="text-sm text-muted-foreground">
                Metodo Esoterico & Magico-Pratico
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="gold-gradient">Tarocchi</span>
              <br />
              <span className="text-glow">per Illuminarsi</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Non semplice divinazione, ma un viaggio profondo verso la
              <span className="text-accent font-semibold"> Saggezza</span> attraverso
              13 anni di pratica magica e studio esoterico approfondito.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="mystic-gradient border border-accent/30 hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 mr-2" />
                Inizia il Percorso
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10">
                Scopri il Metodo
              </Button>
            </div>
          </div>

          {/* Jessica Image */}
          <div className="relative animate-scale-in lg:animate-float">
            <div className="relative rounded-2xl overflow-hidden portal-shadow">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <img
                src={jessicaImage}
                alt="Jessica Marin - Tarologa e Maestra Spirituale"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
