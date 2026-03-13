import { useEffect } from "react";
import ViaLayout from "@/components/ViaLayout";

const sections = [
  {
    title: "Articoli e riflessioni",
    text: "Scritti contemplativi su simbolismo, alchimia interiore e le correnti invisibili che attraversano l'esistenza. Uno spazio di pensiero lento e profondo.",
    accent: "editoriale",
  },
  {
    title: "Musica e ascolti",
    text: "Ascolti curati, paesaggi sonori esoterici e musica che risveglia la dimensione sacra del sentire. Un invito a fermarsi e lasciarsi attraversare dal suono.",
    accent: "sonoro",
  },
  {
    title: "Letteratura esoterica",
    text: "Una biblioteca vivente di testi sacri, poesia mistica e opere che illuminano il cammino interiore. Letture scelte per nutrire la ricerca personale.",
    accent: "letterario",
  },
  {
    title: "Eventi culturali e progetti speciali",
    text: "Incontri, collaborazioni e iniziative che uniscono arte, simbolo e comunità. Progetti che nascono dall'incontro tra visione interiore e creazione condivisa.",
    accent: "culturale",
  },
];

const ctas = [
  { label: "Leggi le riflessioni", primary: true },
  { label: "Esplora le ispirazioni", primary: false },
  { label: "Scopri i progetti", primary: false },
];

const ViaIspirazione = () => {
  useEffect(() => {
    document.title = "La Via dell'Ispirazione | Arte esoterica, musica e letteratura simbolica";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Esplora La Via dell'Ispirazione di Jessica Marin: riflessioni, musica, letteratura esoterica, contenuti culturali ed eventi speciali in uno spazio contemplativo e simbolico."
      );
    }
    return () => {
      document.title = "Tre Vie per illuminarsi | Tarocchi, Yoga e Percorsi Interiori";
    };
  }, []);

  return (
    <ViaLayout viaClass="via-ispirazione" title="La Via dell'Ispirazione">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] px-6 text-center overflow-hidden">
        {/* Warm editorial ambient — golden tones */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 50% 25%, hsla(38, 55%, 52%, 0.07) 0%, transparent 50%),
              radial-gradient(ellipse at 15% 65%, hsla(38, 40%, 40%, 0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 85% 70%, hsla(30, 35%, 45%, 0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, hsla(38, 30%, 30%, 0.03) 0%, transparent 40%)
            `,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 font-caption">
            Arte, parola e contemplazione
          </p>
          <h1 className="text-foreground mb-8 font-display">La Via dell'Ispirazione</h1>
          <div className="sacred-divider mb-8" />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            La Via dell'Ispirazione è uno spazio editoriale e culturale in cui arte, musica, parola e simbolo si incontrano.
            Qui Jessica Marin raccoglie riflessioni, ascolti, letteratura esoterica e progetti speciali
            per nutrire l'immaginazione, la contemplazione e la ricerca interiore.
          </p>
        </div>
      </section>

      {/* Content sections — editorial grid */}
      <section className="sacred-section px-6 py-20 md:py-28">
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="sacred-card p-8 flex flex-col"
              >
                <p className="text-[10px] tracking-[0.25em] uppercase text-accent/35 font-caption mb-5">
                  {section.accent}
                </p>
                <h2 className="text-foreground text-lg tracking-[0.04em] font-display mb-4 leading-snug">
                  {section.title}
                </h2>
                <p className="text-muted-foreground text-sm font-body leading-relaxed flex-1">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative px-6 py-16 md:py-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, hsla(38, 50%, 50%, 0.03) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="sacred-divider mb-10" />
          <p className="text-muted-foreground text-sm md:text-base font-body mb-10 leading-relaxed max-w-xl mx-auto italic">
            L'ispirazione è il respiro dell'anima: nutre ciò che ancora non ha forma.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {ctas.map((cta) => (
              <button
                key={cta.label}
                className={`sacred-cta font-caption ${cta.primary ? "sacred-cta-primary" : ""}`}
              >
                {cta.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </ViaLayout>
  );
};

export default ViaIspirazione;
