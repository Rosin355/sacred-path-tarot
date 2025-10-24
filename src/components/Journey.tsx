import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookMarked, Compass, Crown, Sparkles } from "lucide-react";

const Journey = () => {
  const levels = [
    {
      icon: BookMarked,
      level: "Iniziato",
      title: "Fondamenti Esoterici",
      description: "Impara il linguaggio simbolico dei Tarocchi e le basi della pratica meditativa.",
      lessons: "12 lezioni • 3 meditazioni guidate",
      status: "Gratuito"
    },
    {
      icon: Compass,
      level: "Praticante",
      title: "Corrispondenze & Rituali",
      description: "Approfondisci le connessioni alchemiche, cabalistiche e astrologiche degli Arcani.",
      lessons: "24 lezioni • 8 rituali pratici",
      status: "Premium"
    },
    {
      icon: Crown,
      level: "Maestro",
      title: "Illuminazione & Saggezza",
      description: "Integra completamente gli insegnamenti per diventare canale di vera trasformazione.",
      lessons: "Percorso avanzato personalizzato",
      status: "Premium Elite"
    }
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/30 backdrop-blur-sm">
            <Compass className="w-4 h-4 text-accent animate-glow-pulse" />
            <span className="text-sm text-muted-foreground">Percorso di Illuminazione Guidato</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="gold-gradient">Il Tuo</span>{" "}
            <span className="text-glow">Percorso Spirituale</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un viaggio strutturato attraverso livelli progressivi di conoscenza esoterica
            e pratica magica. Ogni tappa ti porta più vicino alla vera Saggezza.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {levels.map((level, index) => {
            const Icon = level.icon;
            return (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur-sm border-primary/30 hover:card-glow transition-all duration-300 hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-primary/10 border border-accent/30">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
                      {level.status}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{level.level}</p>
                    <CardTitle className="text-xl">{level.title}</CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-base leading-relaxed">
                    {level.description}
                  </CardDescription>
                  
                  <div className="pt-4 border-t border-primary/20">
                    <p className="text-sm text-muted-foreground mb-4">{level.lessons}</p>
                    <Button 
                      className="w-full"
                      variant={index === 0 ? "default" : "outline"}
                    >
                      {index === 0 ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Inizia Gratis
                        </>
                      ) : (
                        "Scopri di Più"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Journey;
