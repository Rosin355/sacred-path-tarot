import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, RotateCcw } from "lucide-react";
import tarotCardBack from "@/assets/tarot-card-back.jpg";
import { useSoundEffects } from "@/hooks/useSoundEffects";

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

const TarotReading = () => {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [draggedCard, setDraggedCard] = useState<number | null>(null);
  const { playCardClick, playRevealWisdom, playNewConsultation } = useSoundEffects();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cards = Array.from({ length: 7 }, (_, i) => i);

  const handleCardSelect = (index: number) => {
    playCardClick();
    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter((i) => i !== index));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, index]);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (isReading) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDraggedCard(index);
    setDragState({
      isDragging: true,
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
    });
    
    e.preventDefault();
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragState?.isDragging || draggedCard === null) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragState({
      ...dragState,
      currentX: clientX,
      currentY: clientY,
    });
  };

  const handleDragEnd = () => {
    if (!dragState?.isDragging || draggedCard === null) return;
    
    const deltaX = Math.abs(dragState.currentX - dragState.startX);
    const deltaY = Math.abs(dragState.currentY - dragState.startY);
    
    // Se il movimento è minimo, tratta come click
    if (deltaX < 5 && deltaY < 5) {
      handleCardSelect(draggedCard);
    }
    
    setDragState(null);
    setDraggedCard(null);
  };

  const startReading = () => {
    playRevealWisdom();
    setIsReading(true);
    // Here would be the AI integration
  };

  return (
    <section id="lettura" className="py-32 lg:py-40 px-6 lg:px-12 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-24 space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-5 py-2 minimal-border bg-card/30 backdrop-blur-sm">
            <span className="text-accent text-lg leading-none">♀</span>
            <span className="text-sm tracking-wider uppercase text-muted-foreground font-light">
              Lettura Esoterica Profonda
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight">
            CONSULTAZIONE
            <br />
            <span className="text-accent-gradient">DEI TAROCCHI</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
            Seleziona tre carte per ricevere un'interpretazione esoterica basata su
            alchimia, cabala e corrispondenze astrologiche.
          </p>
        </div>

        <Card className="bg-card/30 backdrop-blur-sm minimal-border">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-display tracking-tight">
              Scegli le Tue Carte
            </CardTitle>
            <CardDescription className="text-base font-light">
              Seleziona {3 - selectedCards.length} {3 - selectedCards.length === 1 ? "carta" : "carte"}
              {selectedCards.length === 3 && " • Pronto per la lettura"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-12 p-8 pt-0">
            {/* Card Selection */}
            <div 
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4"
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              {cards.map((card, index) => {
                const isDragging = draggedCard === index && dragState?.isDragging;
                const translateX = isDragging ? dragState.currentX - dragState.startX : 0;
                const translateY = isDragging ? dragState.currentY - dragState.startY : 0;
                
                return (
                  <div
                    key={index}
                    ref={(el) => cardRefs.current[index] = el}
                    onMouseDown={(e) => handleDragStart(e, index)}
                    onTouchStart={(e) => handleDragStart(e, index)}
                    className={`
                      relative aspect-[2/3] minimal-border overflow-hidden cursor-grab
                      ${selectedCards.includes(index)
                        ? "ring-2 ring-accent"
                        : "opacity-60 hover:opacity-100"
                      }
                      ${isReading ? "pointer-events-none" : ""}
                      ${isDragging ? "cursor-grabbing z-50" : ""}
                    `}
                    style={{
                      transform: isDragging 
                        ? `translate3d(${translateX}px, ${translateY}px, 0) scale(1.1)` 
                        : selectedCards.includes(index) 
                        ? "scale(1.05)" 
                        : "scale(1)",
                      transition: isDragging ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      willChange: isDragging ? "transform" : "auto",
                      touchAction: "none",
                    }}
                  >
                    <img
                      src={tarotCardBack}
                      alt={`Carta ${index + 1}`}
                      className="w-full h-full object-cover pointer-events-none select-none"
                      draggable="false"
                    />
                    {selectedCards.includes(index) && (
                      <div className="absolute inset-0 bg-accent/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                        <span className="text-accent text-xl leading-none">☉</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reading Button */}
            {selectedCards.length === 3 && !isReading && (
              <div className="flex justify-center animate-scale-in">
                <Button
                  size="lg"
                  onClick={startReading}
                  className="group"
                >
                  Rivela la Saggezza
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {/* Reading Results */}
            {isReading && (
              <div className="space-y-12 animate-fade-in">
                <div className="flex items-center justify-center gap-6">
                  {selectedCards.map((cardIndex, idx) => (
                    <div key={cardIndex} className="relative w-28 aspect-[2/3] minimal-border overflow-hidden animate-scale-in" style={{ animationDelay: `${idx * 0.2}s` }}>
                      <img
                        src={tarotCardBack}
                        alt={`Carta selezionata ${cardIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-8 border-t border-border pt-12">
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-4 tracking-tight">
                      Interpretazione Esoterica
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-light">
                      Le carte rivelano un percorso di trasformazione profonda. 
                      Il primo Arcano parla della tua situazione attuale, dove l'energia 
                      è in fase di raccoglimento e preparazione interiore...
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm tracking-widest uppercase text-accent font-medium">
                        Corrispondenze Alchemiche
                      </h4>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">
                        Elemento: Acqua • Pianeta: Luna • Cristallo: Ametista
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm tracking-widest uppercase text-accent font-medium">
                        Pratica Magica Suggerita
                      </h4>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">
                        Meditazione lunare con ametista durante la fase crescente. 
                        Accendi una candela viola e ripeti il mantra: "Accolgo la saggezza che fluisce attraverso me"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      playNewConsultation();
                      setIsReading(false);
                      setSelectedCards([]);
                    }}
                    className="group"
                  >
                    <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
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
