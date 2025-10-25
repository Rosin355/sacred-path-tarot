import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { ParticleSphere } from "@/components/ui/cosmos-3d-orbit-gallery";

const Hero = () => {
  const tarotImages = [
    "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg",
  ];

  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 lg:py-32">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [-10, 1.5, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <ParticleSphere images={tarotImages} />
        </Canvas>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-5xl">
        <div className="flex flex-col items-center space-y-12 md:space-y-16 animate-fade-in-slow text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2 minimal-border bg-card/10 backdrop-blur-sm mx-auto" style={{ animationDelay: "0.2s" }}>
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground font-light">
              Metodo Esoterico & Magico-Pratico
            </span>
          </div>

          {/* Title - Monumental Typography */}
          <h1 
            className="font-display font-bold leading-[0.9] tracking-tighter text-[clamp(4rem,10vw,10rem)]" 
            style={{ 
              animationDelay: "0.4s",
              textShadow: "0 0 40px rgba(212, 175, 55, 0.3), 0 0 80px rgba(212, 175, 55, 0.2)"
            }}
          >
            TAROCCHI
            <br />
            <span className="text-accent-gradient">PER</span>
            <br />
            ILLUMINARSI
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light" style={{ animationDelay: "0.6s" }}>
            Non semplice divinazione, ma un viaggio profondo verso la{" "}
            <span className="text-accent font-medium">Saggezza</span> attraverso
            13 anni di pratica magica e studio esoterico approfondito.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center" style={{ animationDelay: "0.8s" }}>
            <Button size="lg" variant="default" className="group">
              Inizia il Percorso
              <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="elegant-underline">
              Scopri il Metodo
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fade-in" style={{
        animationDelay: "1.2s"
      }}>
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs tracking-widest uppercase font-light">Scorri</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;