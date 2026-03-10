import ViaLayout from "@/components/ViaLayout";

const cards = [
  {
    title: "Il Metodo di Jessica",
    description: "Un approccio esoterico che intreccia Tarocchi, Cabala e Alchimia Spirituale per illuminare il tuo cammino interiore.",
    cta: "Scopri il metodo",
  },
  {
    title: "Consulti e Percorsi",
    description: "Letture personalizzate e percorsi di crescita spirituale guidati dalla saggezza degli Arcani.",
    cta: "Prenota un consulto",
  },
  {
    title: "Eventi Esoterici",
    description: "Cerchi di studio, rituali stagionali e incontri dedicati all'approfondimento delle scienze sacre.",
    cta: "Esplora gli eventi",
  },
];

const ViaArcani = () => {
  return (
    <ViaLayout viaClass="via-arcani" title="La Via degli Arcani">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <h1 className="text-foreground mb-6">La Via degli Arcani</h1>
        <p className="text-muted-foreground font-body max-w-xl text-base leading-relaxed italic">
          "Ogni carta è uno specchio dell'anima. Ogni lettura, un atto sacro di ascolto."
        </p>
      </section>

      {/* CTA Cards */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group border border-border/30 rounded-sm p-8 bg-card/30 hover:bg-card/50 transition-all duration-500 hover:border-accent/30 space-y-4"
            >
              <h3 className="text-foreground text-base tracking-[0.06em]">{card.title}</h3>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">
                {card.description}
              </p>
              <span className="inline-block text-accent text-xs tracking-wider uppercase group-hover:tracking-[0.2em] transition-all duration-500">
                {card.cta} →
              </span>
            </div>
          ))}
        </div>
      </section>
    </ViaLayout>
  );
};

export default ViaArcani;
