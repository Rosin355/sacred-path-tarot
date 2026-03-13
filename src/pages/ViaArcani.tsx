import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViaLayout from "@/components/ViaLayout";
import CelestialHero from "@/components/arcani/CelestialHero";

const sections = [
  {
    title: "Corsi e percorsi sui tarocchi",
    text: "Il percorso include corsi dedicati agli arcani maggiori, agli arcani minori, ai metodi di stesura dei tarocchi e allo sviluppo della medianità per mezzo dei tarocchi. Ogni proposta è pensata per aiutare la persona a leggere il simbolo con più profondità, ordine e sensibilità.",
    icon: "✦",
  },
  {
    title: "Carta del destino e lettura simbolica",
    text: "Tra i percorsi proposti c'è anche la carta del destino, un lavoro che aiuta a comprendere se stessi e gli altri attraverso la data di nascita, in una chiave simbolica e riflessiva.",
    icon: "◈",
  },
  {
    title: "Esercitazioni pratiche sulle stesure dei tarocchi",
    text: "Ogni primo venerdì del mese, presso la Libreria Esoterica Il Sigillo, Jessica guida un incontro di esercitazione sulle stesure dei tarocchi. Questo spazio formativo aiuta gli allievi a integrare arcani maggiori e minori, imparare a porre le domande giuste e offrire un responso più chiaro, veritiero e ben strutturato.",
    icon: "❖",
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
      {/* Hero with celestial animation */}
      <section className="relative flex flex-col items-center justify-center min-h-[65vh] px-6 text-center overflow-hidden">
        {/* Celestial background */}
        <CelestialHero />
        
        {/* Radial ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, hsla(270, 55%, 45%, 0.08) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 font-caption">
            Il cammino attraverso i simboli
          </p>
          <h1 className="text-foreground mb-8 font-display">La Via degli Arcani</h1>
          <div className="w-16 h-px bg-accent/30 mx-auto mb-8" />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            La Via degli Arcani è il percorso dedicato a chi desidera entrare davvero nel linguaggio dei tarocchi,
            non solo come strumento divinatorio, ma come via di conoscenza, interpretazione e consapevolezza.
            Qui Jessica Marin accompagna l'allievo nello studio degli arcani maggiori, degli arcani minori,
            dei metodi di stesura, della medianità attraverso i tarocchi e della carta del destino.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="relative px-6 py-20 md:py-28">
        {/* Subtle background shift */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, hsla(262, 25%, 7%, 0.6) 20%, hsla(262, 25%, 7%, 0.6) 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-12 md:space-y-16">
          {sections.map((section, i) => (
            <div
              key={section.title}
              className="group p-8 md:p-10 border border-border/20 bg-card/30 backdrop-blur-sm
                hover:border-accent/20 hover:bg-card/50 transition-all duration-700"
            >
              <div className="flex items-start gap-5">
                <span className="text-accent/50 text-2xl mt-1 shrink-0 select-none">{section.icon}</span>
                <div className="space-y-4">
                  <h2 className="text-foreground text-lg md:text-xl tracking-[0.04em] font-display leading-snug">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base font-body leading-relaxed">
                    {section.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="relative px-6 py-16 md:py-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, hsla(270, 55%, 45%, 0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="w-12 h-px bg-accent/20 mx-auto mb-10" />
          <p className="text-muted-foreground text-sm md:text-base font-body mb-10 leading-relaxed max-w-xl mx-auto">
            Ogni percorso è pensato per accompagnarti verso una comprensione più profonda del simbolo e di te stesso.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {ctas.map((cta) => (
              <button
                key={cta.label}
                className="px-7 py-3.5 border border-border/30 text-foreground text-sm tracking-wider uppercase
                  hover:bg-accent/10 hover:border-accent/30 transition-all duration-500 font-caption
                  backdrop-blur-sm"
              >
                {cta.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-muted-foreground text-sm tracking-wider uppercase
              hover:text-foreground transition-colors duration-500 font-caption elegant-underline"
          >
            ← Torna al Tempio
          </button>
        </div>
      </section>
    </ViaLayout>
  );
};

export default ViaArcani;
