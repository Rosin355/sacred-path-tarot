import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import jessicaImage from "@/assets/jessica-marin.jpg";

const About = () => {
  const credentials = [
    { icon: "♀", text: "13 anni di pratica esoterica quotidiana e studio approfondito" },
    { icon: "♂", text: "Specializzazione in Cabala, Alchimia e Astrologia Ermetica" },
    { icon: "☉", text: "Oltre 1000 letture profonde e percorsi di trasformazione guidati" },
    { icon: "♆", text: "Metodo esclusivo Magico-Pratico per l'Illuminazione" },
  ];

  return (
    <section id="about-section" className="sacred-section py-24 lg:py-32 px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <p className="text-[10px] tracking-[0.25em] uppercase text-accent/50 font-caption flex items-center gap-3 mb-6">
            <span className="text-accent text-lg leading-none">♆</span>
            La Tua Guida
          </p>
        </div>

        {/* Layout a due colonne */}
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Colonna sinistra: Testo */}
          <div className="space-y-8 animate-fade-in order-2 md:order-1" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-5xl md:text-6xl font-display leading-tight lg:text-7xl">
              Jessica
              <br />
              <span className="text-accent-gradient">Marin</span>
            </h2>

            <p className="text-muted-foreground font-light leading-relaxed text-lg md:text-xl max-w-xl">
              Da 13 anni dedico la mia vita allo studio e alla pratica delle tradizioni esoteriche più profonde.
              I Tarocchi non sono per me un semplice strumento divinatorio, ma una mappa sacra verso l'Illuminazione.
            </p>

            {/* Credenziali */}
            <div className="space-y-4 pt-6 border-t border-border/30">
              {credentials.map((credential, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <span className="text-accent/40 text-lg leading-none mt-0.5">{credential.icon}</span>
                  <p className="text-muted-foreground font-light text-sm md:text-base">{credential.text}</p>
                </div>
              ))}
            </div>

            <Button size="lg" className="group mt-4">
              Scopri di Più sulla Mia Storia
              <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>

          {/* Colonna destra: Immagine */}
          <div className="relative animate-fade-in order-1 md:order-2 max-w-md md:max-w-none" style={{ animationDelay: "0.4s" }}>
            <div className="sacred-card overflow-hidden p-0">
              <img
                src={jessicaImage}
                alt="Jessica Marin - Guida esoterica e esperta di Tarocchi"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
