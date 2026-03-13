import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const Journey = () => {
  const levels = [
    {
      number: "01",
      level: "INIZIATO",
      title: "Fondamenti Esoterici",
      description: "Impara il linguaggio simbolico dei Tarocchi e le basi della pratica meditativa.",
      lessons: "12 lezioni • 3 meditazioni guidate",
      status: "Gratuito",
    },
    {
      number: "02",
      level: "PRATICANTE",
      title: "Corrispondenze & Rituali",
      description: "Approfondisci le connessioni alchemiche, cabalistiche e astrologiche degli Arcani.",
      lessons: "24 lezioni • 8 rituali pratici",
      status: "Premium",
    },
    {
      number: "03",
      level: "MAESTRO",
      title: "Illuminazione & Saggezza",
      description: "Integra completamente gli insegnamenti per diventare canale di vera trasformazione.",
      lessons: "Percorso avanzato personalizzato",
      status: "Premium Elite",
    },
  ];

  return (
    <section id="journey-section" className="sacred-section py-28 lg:py-36 px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="mb-20 space-y-6 animate-fade-in">
          <p className="text-[10px] tracking-[0.25em] uppercase text-accent/50 font-caption flex items-center gap-3">
            <span className="text-accent text-lg leading-none">♃</span>
            Percorso di Illuminazione Guidato
          </p>

          <h2 className="text-5xl md:text-6xl font-display tracking-tight lg:text-8xl">
            Il tuo Percorso
            <br />
            <span className="text-accent-gradient">Spirituale</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl font-light leading-relaxed text-xl md:text-2xl">
            Un viaggio strutturato attraverso livelli progressivi di conoscenza esoterica
            e pratica magica. Ogni tappa ti porta più vicino alla vera Saggezza.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {levels.map((level, index) => (
            <div
              key={index}
              className="sacred-card p-8 group animate-scale-in flex flex-col"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-5xl md:text-6xl font-display font-bold text-accent/12 group-hover:text-accent/25 transition-colors duration-500">
                  {level.number}
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase px-3 py-1 border border-border/30 bg-card/30 text-muted-foreground/60 font-caption">
                  {level.status}
                </span>
              </div>

              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 mb-2 font-caption">
                {level.level}
              </p>
              <h3 className="font-display tracking-tight text-2xl md:text-3xl mb-4 text-foreground">
                {level.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base mb-6 flex-1">
                {level.description}
              </p>

              <div className="pt-5 border-t border-border/20 space-y-4">
                <p className="text-muted-foreground/60 font-light text-sm">{level.lessons}</p>
                <button
                  className={`w-full sacred-cta font-caption ${index === 0 ? "sacred-cta-primary" : ""}`}
                >
                  {index === 0 ? "Inizia Gratis" : "Scopri di Più"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;
