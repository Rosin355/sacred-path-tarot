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
      {/* Hero intro */}
      <section className="flex flex-col items-center justify-center min-h-[55vh] px-6 text-center">
        <h1 className="text-foreground mb-6 font-display">La Via del Respiro</h1>
        <p className="text-muted-foreground font-body max-w-2xl text-base md:text-lg leading-relaxed">
          La Via del Respiro è uno spazio dedicato a yoga, pranayama, corpo e presenza.
          Qui il respiro diventa guida e memoria interiore, per aiutare la persona a ritrovare centratura,
          ascolto, forza e consapevolezza attraverso pratiche che uniscono movimento, tecnica e profondità.
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

        {/* Practical info */}
        <div className="border border-border/30 rounded-sm p-8 bg-card/20 space-y-3">
          <h2 className="text-foreground text-lg tracking-[0.04em] font-display">
            Dove e quando
          </h2>
          <p className="text-muted-foreground text-sm md:text-base font-body leading-relaxed">
            Le lezioni si tengono attualmente presso Kairos Spazio Olistico il mercoledì sera,
            dalle 20:30 alle 21:45, oltre a eventuali sostituzioni in altre palestre.
          </p>
        </div>
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

export default ViaRespiro;
