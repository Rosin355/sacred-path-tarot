import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import jessicaImage from "@/assets/jessica-marin.jpg";
import { useSoundEffects } from "@/hooks/useSoundEffects";
const About = () => {
  const {
    playNavigation
  } = useSoundEffects();
  const credentials = [{
    icon: "♀",
    text: "13 anni di pratica esoterica quotidiana e studio approfondito"
  }, {
    icon: "♂",
    text: "Specializzazione in Cabala, Alchimia e Astrologia Ermetica"
  }, {
    icon: "☉",
    text: "Oltre 1000 letture profonde e percorsi di trasformazione guidati"
  }, {
    icon: "♆",
    text: "Metodo esclusivo Magico-Pratico per l'Illuminazione"
  }];
  return <section id="about-section" className="py-20 lg:py-28 px-6 lg:px-12 relative">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header con simbolo astrologico */}
        <div className="inline-flex items-center gap-3 px-5 py-2 minimal-border bg-card/30 backdrop-blur-sm mb-12 animate-fade-in">
          <span className="text-accent text-lg leading-none">♆</span>
          <span className="text-sm tracking-wider uppercase text-muted-foreground font-light">
            La Tua Guida
          </span>
        </div>

        {/* Layout a due colonne */}
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-start">
          
          {/* Colonna sinistra: Testo */}
          <div className="space-y-8 animate-fade-in order-2 md:order-1" style={{
          animationDelay: "0.2s"
        }}>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display leading-tight">
              Jessica
              <br />
              <span className="text-accent-gradient">Marin</span>
            </h2>

            <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
              <p className="text-lg">
                Da 13 anni dedico la mia vita allo studio e alla pratica delle tradizioni esoteriche più profonde. I Tarocchi non sono per me un semplice strumento divinatorio, ma una mappa sacra verso l'Illuminazione.
              </p>
              
              
              
              
            </div>

            {/* Lista credenziali con simboli */}
            <div className="space-y-4 pt-6 border-t border-border/50">
              {credentials.map((credential, index) => <div key={index} className="flex items-start gap-3 animate-fade-in" style={{
              animationDelay: `${0.6 + index * 0.1}s`
            }}>
                  <span className="text-accent text-lg leading-none mt-1">{credential.icon}</span>
                  <p className="text-sm text-muted-foreground font-light">{credential.text}</p>
                </div>)}
            </div>

            {/* Bottone CTA */}
            <Button size="lg" className="group mt-8" onClick={playNavigation}>
              Scopri di Più sulla Mia Storia
              <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>

          {/* Colonna destra: Immagine Jessica */}
          <div className="relative animate-fade-in order-1 md:order-2 max-w-md md:max-w-none" style={{
          animationDelay: "0.4s"
        }}>
            <div className="relative overflow-hidden minimal-border hover-lift">
              <img src={jessicaImage} alt="Jessica Marin - Guida esoterica e esperta di Tarocchi" className="w-full aspect-[4/5] object-cover" />
              
              {/* Decorazione con simboli astrologici negli angoli */}
              <div className="absolute top-4 left-4 text-accent text-2xl opacity-30">♀</div>
              <div className="absolute top-4 right-4 text-accent text-2xl opacity-30">♂</div>
              <div className="absolute bottom-4 left-4 text-accent text-2xl opacity-30">♃</div>
              <div className="absolute bottom-4 right-4 text-accent text-2xl opacity-30">☉</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default About;