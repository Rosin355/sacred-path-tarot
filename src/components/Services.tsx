import { Card, CardContent } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      symbol: "♆",
      title: "Lettura Approfondita",
      description: "Consulto privato di 90 minuti che esplora i tuoi blocchi energetici attraverso gli Arcani Maggiori e la Cabala Ermetica.",
      alt: "Lettura Tarocchi Approfondita"
    },
    {
      symbol: "♃",
      title: "Percorso Iniziatico",
      description: "Programma di 3 mesi che ti guida attraverso le 22 chiavi degli Arcani Maggiori verso la tua trasformazione spirituale.",
      alt: "Percorso Iniziatico"
    },
    {
      symbol: "♂",
      title: "Rituale Alchemico",
      description: "Sessione di Alchimia Pratica per trasmutare i blocchi emotivi in oro spirituale attraverso tecniche ermetiche avanzate.",
      alt: "Rituale Alchemico"
    }
  ];

  return (
    <section className="py-32 lg:py-40 px-6 lg:px-12 relative">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header con simbolo astrologico */}
        <div className="inline-flex items-center gap-3 px-5 py-2 minimal-border bg-card/30 backdrop-blur-sm mb-12 animate-fade-in">
          <span className="text-accent text-lg leading-none">☉</span>
          <span className="text-sm tracking-wider uppercase text-muted-foreground font-light">
            I Miei Servizi
          </span>
        </div>

        {/* Grid di servizi: 3 card in fila su desktop */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="minimal-border bg-card/30 backdrop-blur-sm hover-lift animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CardContent className="p-8 space-y-6">
                {/* Immagine placeholder */}
                <div className="relative overflow-hidden minimal-border aspect-square">
                  <img 
                    src="/placeholder.svg"
                    alt={service.alt}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>
                
                {/* Testo al centro */}
                <div className="text-center space-y-4">
                  <span className="text-accent text-3xl leading-none">{service.symbol}</span>
                  <h3 className="text-2xl font-heading3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
