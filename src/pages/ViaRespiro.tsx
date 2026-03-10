import ViaLayout from "@/components/ViaLayout";

const cards = [
  {
    title: "Approccio e Filosofia",
    description: "Lo yoga come pratica sacra di presenza — un cammino che unisce respiro, corpo e coscienza.",
    cta: "Scopri l'approccio",
  },
  {
    title: "Discipline e Pratiche",
    description: "Yoga, pranayama, total body e acqua gym — percorsi di vitalità e consapevolezza corporea.",
    cta: "Esplora le discipline",
  },
  {
    title: "Lezioni e Incontri",
    description: "Classi settimanali, workshop intensivi e ritiri dedicati al risveglio attraverso il corpo.",
    cta: "Vedi il calendario",
  },
];

const ViaRespiro = () => {
  return (
    <ViaLayout viaClass="via-respiro" title="La Via del Respiro">
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <h1 className="text-foreground mb-6">La Via del Respiro</h1>
        <p className="text-muted-foreground font-body max-w-xl text-base leading-relaxed italic">
          "Il corpo è il primo tempio. Il respiro, la prima preghiera."
        </p>
      </section>

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

export default ViaRespiro;
