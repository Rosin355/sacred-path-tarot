import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useHarmonicSound } from "@/hooks/useHarmonicSound";

const Journey = () => {
  const { playNote } = useHarmonicSound();
  
  const levels = [
    {
      number: "01",
      level: "INIZIATO",
      title: "Fondamenti Esoterici",
      description: "Impara il linguaggio simbolico dei Tarocchi e le basi della pratica meditativa.",
      lessons: "12 lezioni • 3 meditazioni guidate",
      status: "Gratuito"
    },
    {
      number: "02",
      level: "PRATICANTE",
      title: "Corrispondenze & Rituali",
      description: "Approfondisci le connessioni alchemiche, cabalistiche e astrologiche degli Arcani.",
      lessons: "24 lezioni • 8 rituali pratici",
      status: "Premium"
    },
    {
      number: "03",
      level: "MAESTRO",
      title: "Illuminazione & Saggezza",
      description: "Integra completamente gli insegnamenti per diventare canale di vera trasformazione.",
      lessons: "Percorso avanzato personalizzato",
      status: "Premium Elite"
    }
  ];

  return (
    <section id="percorso" className="py-32 lg:py-40 px-6 lg:px-12 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-24 space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-5 py-2 minimal-border bg-card/30 backdrop-blur-sm">
            <div className="w-2 h-2 bg-accent" />
            <span className="text-sm tracking-wider uppercase text-muted-foreground font-light">
              Percorso di Illuminazione Guidato
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight">
            IL TUO PERCORSO
            <br />
            <span className="text-accent-gradient">SPIRITUALE</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
            Un viaggio strutturato attraverso livelli progressivi di conoscenza esoterica
            e pratica magica. Ogni tappa ti porta più vicino alla vera Saggezza.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {levels.map((level, index) => (
            <Card
              key={index}
              className="bg-transparent minimal-border hover-lift group cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardHeader className="space-y-6 p-8">
                <div className="flex items-start justify-between">
                  <span className="text-7xl font-display font-bold text-accent/20 group-hover:text-accent/40 transition-colors">
                    {level.number}
                  </span>
                  <span className="text-xs tracking-widest uppercase px-3 py-1 minimal-border bg-card/30 text-muted-foreground">
                    {level.status}
                  </span>
                </div>
                
                <div>
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-light">
                    {level.level}
                  </p>
                  <CardTitle className="text-2xl font-display tracking-tight">
                    {level.title}
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 p-8 pt-0">
                <CardDescription className="text-base leading-relaxed text-muted-foreground font-light">
                  {level.description}
                </CardDescription>
                
                <div className="pt-6 border-t border-border space-y-4">
                  <p className="text-sm text-muted-foreground font-light">{level.lessons}</p>
                  <Button 
                    className="w-full group/btn"
                    variant={index === 0 ? "default" : "outline"}
                    onClick={() => playNote('A')}
                  >
                    {index === 0 ? "Inizia Gratis" : "Scopri di Più"}
                    <ArrowUpRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;
