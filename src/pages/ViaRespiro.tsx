import { useEffect } from "react";
import ViaLayout from "@/components/ViaLayout";

const sections = [
  {
    title: "Yoga, pranayama, corpo e presenza",
    text: "Questo percorso accompagna l'allievo nella conoscenza del proprio respiro, del proprio corpo e della propria mente, usando la pratica come via concreta di presenza e trasformazione.",
    icon: "◯",
  },
  {
    title: "Pratiche dinamiche e potenziamento",
    text: "Tra le discipline più dinamiche proposte da Jessica ci sono power yoga e ginnastica total body, pensate per forgiare il corpo, aumentare il movimento e sviluppare energia, forza e resistenza.",
    icon: "△",
  },
  {
    title: "Pratiche tecniche, interiori e rilassate",
    text: "La proposta comprende anche Iyengar yoga, più tecnico, strutturato e profondo, oltre a Hatha yoga, Yin yoga e tecniche della respirazione, per chi desidera un approccio più interiore, graduale e contemplativo.",
    icon: "◇",
  },
  {
    title: "Un approccio che unisce forza e presenza",
    text: "Jessica non guida solo al rilassamento, ma porta la persona verso un equilibrio tra flessibilità, forza, potenza, resistenza, atmosfera e ascolto. Ogni lezione custodisce il ricordo del respiro, una cura per l'ambiente e un momento finale di rilassamento e integrazione.",
    icon: "☽",
  },
];

const ctas = [
  { label: "Comprendi la pratica", primary: true },
  { label: "Scopri le discipline", primary: false },
  { label: "Vedi lezioni e incontri", primary: false },
];

const ViaRespiro = () => {
  useEffect(() => {
    document.title = "Yoga, Pranayama e Presenza | La Via del Respiro";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Scopri La Via del Respiro di Jessica Marin: yoga, pranayama, corpo e presenza attraverso pratiche che uniscono forza, tecnica, rilassamento, consapevolezza e ascolto."
      );
    }
    return () => {
      document.title = "Tre Vie per illuminarsi | Tarocchi, Yoga e Percorsi Interiori";
    };
  }, []);

  return (
    <ViaLayout viaClass="via-respiro" title="La Via del Respiro">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] px-6 text-center overflow-hidden">
        {/* Layered ambient — airy, spacious */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 50% 15%, hsla(175, 40%, 45%, 0.07) 0%, transparent 55%),
              radial-gradient(ellipse at 25% 75%, hsla(260, 25%, 72%, 0.05) 0%, transparent 50%),
              radial-gradient(ellipse at 75% 45%, hsla(175, 30%, 50%, 0.04) 0%, transparent 50%)
            `,
          }}
          aria-hidden="true"
        />

        {/* Breath-pulse circle */}
        <div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, hsla(175, 40%, 50%, 0.05) 0%, transparent 70%)",
            animation: "breath-pulse 8s ease-in-out infinite",
          }}
          aria-hidden="true"
        />

        {/* Secondary breath ring */}
        <div
          className="absolute top-1/2 left-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, hsla(175, 35%, 45%, 0.02) 0%, transparent 60%)",
            animation: "breath-pulse 12s ease-in-out infinite 2s",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 font-caption">
            Il respiro come guida interiore
          </p>
          <h1 className="text-foreground mb-8 font-display">La Via del Respiro</h1>
          <div className="sacred-divider mb-8" />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            La Via del Respiro è uno spazio dedicato a yoga, pranayama, corpo e presenza.
            Qui il respiro diventa guida e memoria interiore, per aiutare la persona a ritrovare centratura,
            ascolto, forza e consapevolezza attraverso pratiche che uniscono movimento, tecnica e profondità.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="sacred-section px-6 py-20 md:py-28">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="sacred-card p-8 md:p-10"
            >
              <div className="flex items-start gap-5">
                <span className="text-accent/40 text-xl mt-1 shrink-0 select-none">{section.icon}</span>
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

          {/* Practical info — highlighted */}
          <div className="sacred-card p-8 md:p-10 !border-accent/20 !bg-accent/[0.04]">
            <p className="text-[10px] tracking-[0.25em] uppercase text-accent/50 font-caption mb-4">Dove e quando</p>
            <h2 className="text-foreground text-lg tracking-[0.04em] font-display mb-3">
              Kairos Spazio Olistico
            </h2>
            <p className="text-muted-foreground text-sm md:text-base font-body leading-relaxed">
              Le lezioni si tengono attualmente presso Kairos Spazio Olistico il mercoledì sera,
              dalle 20:30 alle 21:45, oltre a eventuali sostituzioni in altre palestre.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative px-6 py-16 md:py-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, hsla(175, 40%, 45%, 0.03) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="sacred-divider mb-10" />
          <p className="text-muted-foreground text-sm md:text-base font-body mb-10 leading-relaxed max-w-xl mx-auto italic">
            La pratica è il luogo in cui il corpo ricorda ciò che la mente dimentica.
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

export default ViaRespiro;
