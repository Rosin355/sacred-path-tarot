import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViaLayout from "@/components/ViaLayout";

const sections = [
  {
    title: "Articoli e riflessioni",
    text: "Scritti contemplativi su simbolismo, alchimia interiore e le correnti invisibili che attraversano l'esistenza. Uno spazio di pensiero lento e profondo.",
  },
  {
    title: "Musica e ascolti",
    text: "Ascolti curati, paesaggi sonori esoterici e musica che risveglia la dimensione sacra del sentire. Un invito a fermarsi e lasciarsi attraversare dal suono.",
  },
  {
    title: "Letteratura esoterica",
    text: "Una biblioteca vivente di testi sacri, poesia mistica e opere che illuminano il cammino interiore. Letture scelte per nutrire la ricerca personale.",
  },
  {
    title: "Eventi culturali e progetti speciali",
    text: "Incontri, collaborazioni e iniziative che uniscono arte, simbolo e comunità. Progetti che nascono dall'incontro tra visione interiore e creazione condivisa.",
  },
];

const ctas = [
  { label: "Leggi le riflessioni", action: "#riflessioni" },
  { label: "Esplora le ispirazioni", action: "#ispirazioni" },
  { label: "Scopri i progetti", action: "#progetti" },
];

const ViaIspirazione = () => {
  const navigate = useNavigate();

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
      {/* Hero intro */}
      <section className="flex flex-col items-center justify-center min-h-[55vh] px-6 text-center">
        <h1 className="text-foreground mb-6 font-display">La Via dell'Ispirazione</h1>
        <p className="text-muted-foreground font-body max-w-2xl text-base md:text-lg leading-relaxed">
          La Via dell'Ispirazione è uno spazio editoriale e culturale in cui arte, musica, parola e simbolo si incontrano.
          Qui Jessica Marin raccoglie riflessioni, ascolti, letteratura esoterica e progetti speciali
          per nutrire l'immaginazione, la contemplazione e la ricerca interiore.
        </p>
      </section>

      {/* Content sections */}
      <section className="px-6 pb-16 max-w-4xl mx-auto space-y-16">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-foreground text-lg md:text-xl tracking-[0.04em] font-display">
              {section.title}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base font-body leading-relaxed">
              {section.text}
            </p>
          </div>
        ))}
      </section>

      {/* CTAs */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {ctas.map((cta) => (
            <button
              key={cta.label}
              className="px-6 py-3 border border-border/40 rounded-sm text-foreground text-sm tracking-wider uppercase
                hover:bg-accent/10 hover:border-accent/40 transition-all duration-500 font-caption"
            >
              {cta.label}
            </button>
          ))}
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 text-muted-foreground text-sm tracking-wider uppercase
              hover:text-foreground transition-colors duration-500 font-caption"
          >
            ← Torna al Tempio
          </button>
        </div>
      </section>
    </ViaLayout>
  );
};

export default ViaIspirazione;
