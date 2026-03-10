import ViaLayout from "@/components/ViaLayout";

const cards = [
  {
    title: "Articoli e Riflessioni",
    description: "Scritti contemplativi su simbolismo, alchimia interiore e le correnti invisibili che attraversano l'esistenza.",
    cta: "Leggi le riflessioni",
  },
  {
    title: "Musica e Ispirazioni",
    description: "Ascolti curati, paesaggi sonori esoterici e musica che risveglia la dimensione sacra del sentire.",
    cta: "Ascolta",
  },
  {
    title: "Letteratura Esoterica",
    description: "Una biblioteca vivente di testi sacri, poesia mistica e opere che illuminano il cammino interiore.",
    cta: "Esplora la biblioteca",
  },
];

const ViaIspirazione = () => {
  return (
    <ViaLayout viaClass="via-ispirazione" title="La Via dell'Ispirazione">
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <h1 className="text-foreground mb-6">La Via dell'Ispirazione</h1>
        <p className="text-muted-foreground font-body max-w-xl text-base leading-relaxed italic">
          "L'arte è il linguaggio segreto dell'anima che cerca se stessa."
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

export default ViaIspirazione;
