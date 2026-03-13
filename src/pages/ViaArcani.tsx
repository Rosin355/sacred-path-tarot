import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViaLayout from "@/components/ViaLayout";

const sections = [
  {
    title: "Corsi e percorsi sui tarocchi",
    text: "Il percorso include corsi dedicati agli arcani maggiori, agli arcani minori, ai metodi di stesura dei tarocchi e allo sviluppo della medianità per mezzo dei tarocchi. Ogni proposta è pensata per aiutare la persona a leggere il simbolo con più profondità, ordine e sensibilità.",
  },
  {
    title: "Carta del destino e lettura simbolica",
    text: "Tra i percorsi proposti c'è anche la carta del destino, un lavoro che aiuta a comprendere se stessi e gli altri attraverso la data di nascita, in una chiave simbolica e riflessiva.",
  },
  {
    title: "Esercitazioni pratiche sulle stesure dei tarocchi",
    text: "Ogni primo venerdì del mese, presso la Libreria Esoterica Il Sigillo, Jessica guida un incontro di esercitazione sulle stesure dei tarocchi. Questo spazio formativo aiuta gli allievi a integrare arcani maggiori e minori, imparare a porre le domande giuste e offrire un responso più chiaro, veritiero e ben strutturato.",
  },
];

const ctas = [
  { label: "Scopri il metodo", action: "#metodo" },
  { label: "Esplora i percorsi", action: "#percorsi" },
  { label: "Vedi gli eventi", action: "#eventi" },
];

const ViaArcani = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Corso di Tarocchi e Arcani | La Via degli Arcani";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Scopri La Via degli Arcani di Jessica Marin: corsi su arcani maggiori e minori, metodi di stesura, medianità attraverso i tarocchi, carta del destino ed esercitazioni pratiche."
      );
    }
    return () => {
      document.title = "Tre Vie per illuminarsi | Tarocchi, Yoga e Percorsi Interiori";
    };
  }, []);

  return (
    <ViaLayout viaClass="via-arcani" title="La Via degli Arcani">
      {/* Hero intro */}
      <section className="flex flex-col items-center justify-center min-h-[55vh] px-6 text-center">
        <h1 className="text-foreground mb-6 font-display">La Via degli Arcani</h1>
        <p className="text-muted-foreground font-body max-w-2xl text-base md:text-lg leading-relaxed">
          La Via degli Arcani è il percorso dedicato a chi desidera entrare davvero nel linguaggio dei tarocchi,
          non solo come strumento divinatorio, ma come via di conoscenza, interpretazione e consapevolezza.
          Qui Jessica Marin accompagna l'allievo nello studio degli arcani maggiori, degli arcani minori,
          dei metodi di stesura, della medianità attraverso i tarocchi e della carta del destino.
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

export default ViaArcani;
