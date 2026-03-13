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
      <section className="relative flex flex-col items-center justify-center min-h-[75vh] px-6 text-center overflow-hidden">
        {/* Layered ambient — airy, spacious, turquoise */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 50% 10%, hsla(175, 50%, 42%, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 20% 70%, hsla(185, 35%, 55%, 0.08) 0%, transparent 45%),
              radial-gradient(ellipse at 80% 40%, hsla(170, 40%, 48%, 0.07) 0%, transparent 45%),
              radial-gradient(ellipse at 50% 90%, hsla(195, 30%, 40%, 0.06) 0%, transparent 50%)
            `,
          }}
          aria-hidden="true"
        />

        {/* Primary breath-pulse ring — large, visible */}
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] md:w-[650px] md:h-[650px] rounded-full pointer-events-none"
          style={{
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, hsla(175, 45%, 48%, 0.1) 0%, hsla(175, 40%, 45%, 0.04) 50%, transparent 70%)",
            boxShadow: "0 0 80px 20px hsla(175, 40%, 50%, 0.04)",
            animation: "breath-pulse 7s ease-in-out infinite",
          }}
          aria-hidden="true"
        />

        {/* Secondary breath ring — offset, slower */}
        <div
          className="absolute top-1/2 left-1/2 w-[750px] h-[750px] md:w-[950px] md:h-[950px] rounded-full pointer-events-none"
          style={{
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, hsla(180, 38%, 50%, 0.06) 0%, hsla(175, 35%, 45%, 0.02) 45%, transparent 65%)",
            animation: "breath-pulse 11s ease-in-out infinite 2.5s",
          }}
          aria-hidden="true"
        />

        {/* Tertiary breath ring — outermost, very subtle */}
        <div
          className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] md:w-[1200px] md:h-[1200px] rounded-full pointer-events-none"
          style={{
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, hsla(185, 30%, 55%, 0.03) 0%, transparent 55%)",
            animation: "breath-pulse 15s ease-in-out infinite 5s",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
          <p className="text-xs tracking-[0.3em] uppercase mb-6 font-caption" style={{ color: "hsla(175, 35%, 60%, 0.7)" }}>
            Il respiro come guida interiore
          </p>
          <h1 className="text-foreground mb-8 font-display">La Via del Respiro</h1>
          <div className="mx-auto mb-8" style={{
            width: "3rem",
            height: "1px",
            background: "linear-gradient(90deg, transparent, hsla(175, 40%, 55%, 0.4), transparent)",
          }} />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            La Via del Respiro è uno spazio dedicato a yoga, pranayama, corpo e presenza.
            Qui il respiro diventa guida e memoria interiore, per aiutare la persona a ritrovare centratura,
            ascolto, forza e consapevolezza attraverso pratiche che uniscono movimento, tecnica e profondità.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="sacred-section px-6 py-20 md:py-28">
        {/* Subtle turquoise ambient behind cards */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, hsla(175, 35%, 45%, 0.04) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="p-8 md:p-10 transition-all duration-600 ease-out hover:translate-y-[-2px]"
              style={{
                background: "hsla(180, 15%, 10%, 0.5)",
                border: "1px solid hsla(175, 25%, 30%, 0.15)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 1px 0 0 hsla(175, 20%, 40%, 0.06) inset, 0 8px 32px -8px hsla(180, 20%, 5%, 0.4)",
              }}
            >
              <div className="flex items-start gap-5">
                <span className="text-xl mt-1 shrink-0 select-none" style={{ color: "hsla(175, 40%, 55%, 0.45)" }}>{section.icon}</span>
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

          {/* Practical info — turquoise-highlighted */}
          <div
            className="p-8 md:p-10"
            style={{
              background: "hsla(175, 20%, 12%, 0.45)",
              border: "1px solid hsla(175, 35%, 45%, 0.2)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 40px -10px hsla(175, 40%, 45%, 0.06), 0 8px 32px -8px hsla(180, 20%, 5%, 0.4)",
            }}
          >
            <p className="text-[10px] tracking-[0.25em] uppercase font-caption mb-4" style={{ color: "hsla(175, 40%, 55%, 0.55)" }}>Dove e quando</p>
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
            background: `
              radial-gradient(ellipse at 50% 50%, hsla(175, 40%, 48%, 0.05) 0%, transparent 55%),
              radial-gradient(ellipse at 50% 80%, hsla(180, 30%, 40%, 0.03) 0%, transparent 50%)
            `,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="mx-auto mb-10" style={{
            width: "3rem",
            height: "1px",
            background: "linear-gradient(90deg, transparent, hsla(175, 40%, 55%, 0.35), transparent)",
          }} />
          <p className="text-muted-foreground text-sm md:text-base font-body mb-10 leading-relaxed max-w-xl mx-auto italic">
            La pratica è il luogo in cui il corpo ricorda ciò che la mente dimentica.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {ctas.map((cta) => (
              <button
                key={cta.label}
                className={`font-caption ${cta.primary ? "" : ""}`}
                style={{
                  padding: "0.875rem 2rem",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "hsl(var(--foreground))",
                  backdropFilter: "blur(4px)",
                  background: cta.primary
                    ? "hsla(175, 35%, 45%, 0.12)"
                    : "hsla(180, 15%, 10%, 0.3)",
                  border: cta.primary
                    ? "1px solid hsla(175, 40%, 50%, 0.25)"
                    : "1px solid hsla(175, 20%, 30%, 0.2)",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = cta.primary
                    ? "hsla(175, 35%, 45%, 0.2)"
                    : "hsla(175, 30%, 40%, 0.1)";
                  el.style.borderColor = cta.primary
                    ? "hsla(175, 40%, 55%, 0.4)"
                    : "hsla(175, 35%, 45%, 0.3)";
                  el.style.boxShadow = `0 0 ${cta.primary ? "30px" : "20px"} hsla(175, 40%, 50%, ${cta.primary ? "0.1" : "0.06"})`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = cta.primary
                    ? "hsla(175, 35%, 45%, 0.12)"
                    : "hsla(180, 15%, 10%, 0.3)";
                  el.style.borderColor = cta.primary
                    ? "hsla(175, 40%, 50%, 0.25)"
                    : "hsla(175, 20%, 30%, 0.2)";
                  el.style.boxShadow = "none";
                }}
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
