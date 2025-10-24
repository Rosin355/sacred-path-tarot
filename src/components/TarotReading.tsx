import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Moon, Sun, Star } from "lucide-react";
import tarotCardBack from "@/assets/tarot-card-back.jpg";

const TarotReading = () => {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isReading, setIsReading] = useState(false);

  const cards = Array.from({ length: 7 }, (_, i) => i);

  const handleCardSelect = (index: number) => {
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter((i) => i !== index));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, index]);
    }
  };

  const startReading = () => {
    setIsReading(true);
    // Here would be the AI integration
  };

  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/30 backdrop-blur-sm">
            <Moon className="w-4 h-4 text-accent animate-glow-pulse" />
            <span className="text-sm text-muted-foreground">Lettura Esoterica Profonda</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="gold-gradient">Consultazione</span>{" "}
            <span className="text-glow">dei Tarocchi</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seleziona tre carte per ricevere un'interpretazione esoterica basata su
            alchimia, cabala e corrispondenze astrologiche.
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/30 card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Scegli le Tue Carte
            </CardTitle>
            <CardDescription>
              Seleziona {3 - selectedCards.length} {3 - selectedCards.length === 1 ? "carta" : "carte"}
              {selectedCards.length === 3 && " - Pronto per la lettura"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Card Selection */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
              {cards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardSelect(index)}
                  disabled={isReading}
                  className={`
                    relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer
                    transition-all duration-300 hover:scale-105
                    ${selectedCards.includes(index)
                      ? "ring-4 ring-accent shadow-2xl scale-105"
                      : "opacity-70 hover:opacity-100"
                    }
                    ${isReading ? "pointer-events-none" : ""}
                  `}
                >
                  <img
                    src={tarotCardBack}
                    alt={`Carta ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedCards.includes(index) && (
                    <div className="absolute inset-0 bg-accent/20 backdrop-blur-sm flex items-center justify-center">
                      <Star className="w-8 h-8 text-accent animate-glow-pulse" fill="currentColor" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Reading Button */}
            {selectedCards.length === 3 && !isReading && (
              <div className="text-center animate-scale-in">
                <Button
                  size="lg"
                  onClick={startReading}
                  className="mystic-gradient border border-accent/30 hover:scale-105 transition-transform"
                >
                  <Moon className="w-5 h-5 mr-2" />
                  Rivela la Saggezza
                </Button>
              </div>
            )}

            {/* Reading Results */}
            {isReading && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-center gap-8">
                  {selectedCards.map((cardIndex) => (
                    <div key={cardIndex} className="relative w-32 aspect-[2/3] rounded-lg overflow-hidden portal-shadow animate-scale-in">
                      <img
                        src={tarotCardBack}
                        alt={`Carta selezionata ${cardIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <Card className="bg-secondary/50 border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-accent" />
                      Interpretazione Esoterica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Le carte rivelano un percorso di trasformazione profonda. 
                      Il primo Arcano parla della tua situazione attuale, dove l'energia 
                      è in fase di raccoglimento e preparazione interiore...
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-accent">Corrispondenze Alchemiche:</h4>
                      <p className="text-sm text-muted-foreground">
                        Elemento: Acqua • Pianeta: Luna • Cristallo: Ametista
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-accent">Pratica Magica Suggerita:</h4>
                      <p className="text-sm text-muted-foreground">
                        Meditazione lunare con ametista durante la fase crescente. 
                        Accendi una candela viola e ripeti il mantra: "Accolgo la saggezza che fluisce attraverso me"
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsReading(false);
                      setSelectedCards([]);
                    }}
                    className="border-primary/50"
                  >
                    Nuova Consultazione
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TarotReading;
