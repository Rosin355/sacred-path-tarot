const Services = () => {
  const services = [
    {
      symbol: "♆",
      title: "Lettura Approfondita",
      description: "Consulto privato di 90 minuti che esplora i tuoi blocchi energetici attraverso gli Arcani Maggiori e la Cabala Ermetica.",
    },
    {
      symbol: "♃",
      title: "Percorso Iniziatico",
      description: "Programma di 3 mesi che ti guida attraverso le 22 chiavi degli Arcani Maggiori verso la tua trasformazione spirituale.",
    },
    {
      symbol: "♂",
      title: "Rituale Alchemico",
      description: "Sessione di Alchimia Pratica per trasmutare i blocchi emotivi in oro spirituale attraverso tecniche ermetiche avanzate.",
    },
  ];

  return (
    <section id="services-section" className="sacred-section py-28 lg:py-36 px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-16 space-y-6 animate-fade-in">
          <p className="text-[10px] tracking-[0.25em] uppercase text-accent/50 font-caption flex items-center gap-3">
            <span className="text-accent text-lg leading-none">☉</span>
            I Miei Servizi
          </p>
          <h2 className="text-4xl md:text-5xl font-display tracking-tight lg:text-7xl">
            Percorsi di
            <br />
            <span className="text-accent-gradient">Trasformazione</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="sacred-card p-8 md:p-10 animate-fade-in flex flex-col items-center text-center"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <span className="text-accent/40 text-3xl leading-none mb-6">{service.symbol}</span>
              <h3 className="font-display text-xl md:text-2xl mb-4 text-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base flex-1">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
