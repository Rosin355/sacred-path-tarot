import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ViaLayout from "@/components/ViaLayout";

const sections = [
  {
    title: "Yoga, pranayama, corpo e presenza",
    text: "Questo percorso accompagna l'allievo nella conoscenza del proprio respiro, del proprio corpo e della propria mente, usando la pratica come via concreta di presenza e trasformazione.",
  },
  {
    title: "Pratiche dinamiche e potenziamento",
    text: "Tra le discipline più dinamiche proposte da Jessica ci sono power yoga e ginnastica total body, pensate per forgiare il corpo, aumentare il movimento e sviluppare energia, forza e resistenza.",
  },
  {
    title: "Pratiche tecniche, interiori e rilassate",
    text: "La proposta comprende anche Iyengar yoga, più tecnico, strutturato e profondo, oltre a Hatha yoga, Yin yoga e tecniche della respirazione, per chi desidera un approccio più interiore, graduale e contemplativo.",
  },
  {
    title: "Un approccio che unisce forza e presenza",
    text: "Jessica non guida solo al rilassamento, ma porta la persona verso un equilibrio tra flessibilità, forza, potenza, resistenza, atmosfera e ascolto. Ogni lezione custodisce il ricordo del respiro, una cura per l'ambiente e un momento finale di rilassamento e integrazione.",
  },
];

const ctas = [
  { label: "Comprendi la pratica", action: "#pratica" },
  { label: "Scopri le discipline", action: "#discipline" },
  { label: "Vedi lezioni e incontri", action: "#lezioni" },
];

const ViaRespiro = () => {
  const navigate = useNavigate();

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
      <section className="relative flex flex-col items-center justify-center min-h-[65vh] px-6 text-center overflow-hidden">
        {/* Airy ambient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 50% 20%, hsla(175, 40%, 45%, 0.06) 0%, transparent 60%),
              radial-gradient(ellipse at 30% 70%, hsla(260, 25%, 72%, 0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, hsla(175, 30%, 50%, 0.03) 0%, transparent 50%)
            `,
          }}
          aria-hidden="true"
        />

        {/* Breath-like pulsing circle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsla(175, 40%, 50%, 0.04) 0%, transparent 70%)",
            animation: "breath-pulse 8s ease-in-out infinite",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 font-caption">
            Il respiro come guida interiore
          </p>
          <h1 className="text-foreground mb-8 font-display">La Via del Respiro</h1>
          <div className="w-16 h-px bg-accent/30 mx-auto mb-8" />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            La Via del Respiro è uno spazio dedicato a yoga, pranayama, corpo e presenza.
            Qui il respiro diventa guida e memoria interiore, per aiutare la persona a ritrovare centratura,
            ascolto, forza e consapevolezza attraverso pratiche che uniscono movimento, tecnica e profondità.
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="relative px-6 py-20 md:py-28">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, transparent 0%, hsla(262, 20%, 8%, 0.4) 20%, hsla(262, 20%, 8%, 0.4) 80%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8 md:space-y-10">
          {sections.map((section) => (
            <div
              key={section.title}
              className="p-8 md:p-10 border border-border/15 bg-card/20
                hover:border-accent/15 hover:bg-card/35 transition-all duration-700"
            >
              <h2 className="text-foreground text-lg md:text-xl tracking-[0.04em] font-display mb-4 leading-snug">
                {section.title}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base font-body leading-relaxed">
                {section.text}
              </p>
            </div>
          ))}

          {/* Practical info */}
          <div className="p-8 md:p-10 border border-accent/15 bg-accent/[0.03] space-y-3">
            <p className="text-xs tracking-[0.2em] uppercase text-accent/60 font-caption mb-3">Dove e quando</p>
            <h2 className="text-foreground text-lg tracking-[0.04em] font-display">
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
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-12 h-px bg-accent/20 mx-auto mb-10" />
          <p className="text-muted-foreground text-sm md:text-base font-body mb-10 leading-relaxed max-w-xl mx-auto">
            La pratica è il luogo in cui il corpo ricorda ciò che la mente dimentica.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {ctas.map((cta) => (
              <button
                key={cta.label}
                className="px-7 py-3.5 border border-border/30 text-foreground text-sm tracking-wider uppercase
                  hover:bg-accent/10 hover:border-accent/30 transition-all duration-500 font-caption"
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

export default ViaRespiro;
