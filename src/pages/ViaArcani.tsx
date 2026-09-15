import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleSphere } from "@/components/ui/cosmos-3d-orbit-gallery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ViaLayout from "@/components/ViaLayout";
import { PathInquiryForm } from "@/components/PathInquiryForm";
import type { InquiryTopic } from "@/config/inquiries";
import { SiteContentBoundary } from "@/content/SiteContentBoundary";
import type { SitePageContent } from "@/content/siteContent";
import { DecorativeBrand } from "@/components/DecorativeBrand";

const tarotImages = [
  "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg",
];

const ctas = [
  { label: "Corsi e percorsi", primary: true, topic: "corsi-percorsi" },
  { label: "Richiedi un consulto", primary: false, topic: "consulto-personale" },
  { label: "Eventi ed esercitazioni", primary: false, topic: "eventi-esercitazioni" },
] satisfies Array<{ label: string; primary: boolean; topic: InquiryTopic }>;

export const ViaArcaniView = ({ content }: { content: SitePageContent }) => {
  const reducedMotion = useReducedMotion();
  const [selectedTopic, setSelectedTopic] = useState<InquiryTopic>();
  const sections = ["✦", "◈", "❖"].map((icon, index) => ({ icon, title: content[`section_${index + 1}_title`], text: content[`section_${index + 1}_text`] }));

  const openInquiry = (topic: InquiryTopic) => {
    setSelectedTopic(topic);
    window.requestAnimationFrame(() => {
      document.getElementById("richiesta")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    });
  };

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
      document.title = "Tempio delle Tre Vie — Jessica Marin";
    };
  }, []);

  return (
    <ViaLayout viaClass="via-arcani" title="La Via degli Arcani">
      {/* Hero with 3D particle sphere + tarot cards */}
      <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 text-center overflow-hidden">
        {/* 3D Background — same as original hero */}
        {!reducedMotion && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [-10, 1.5, 10], fov: 50 }} style={{ width: "100%", height: "100%" }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <ParticleSphere images={tarotImages} />
            </Canvas>
          </div>
        )}

        {/* Ambient overlay for readability */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: `
              radial-gradient(ellipse at 50% 40%, hsla(270, 55%, 45%, 0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 50% 90%, hsla(262, 29%, 5%, 0.7) 0%, transparent 40%)
            `,
          }}
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="hero-copy relative z-10 max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6 font-caption">
            {content.hero_kicker}
          </p>
          <h1 className="text-foreground mb-8 font-display"
            style={{
              textShadow: "0 0 50px hsla(270, 55%, 45%, 0.4), 0 0 100px hsla(270, 55%, 45%, 0.2)",
            }}
          >
            {content.hero_title}
          </h1>
          <DecorativeBrand value={content.hero_brand} accessibleName="Tarocchi Per Illuminarsi" />
          <div className="sacred-divider mb-8" />
          <p className="text-muted-foreground font-body max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {content.hero_text}
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section className="sacred-section px-6 py-20 md:py-28">
        <div className="relative z-10 max-w-3xl mx-auto space-y-8 md:space-y-10">
          {sections.map((section) => (
            <div
              key={section.title}
              className="sacred-card p-8 md:p-10"
            >
              <div className="flex items-start gap-5">
                <span className="text-accent/40 text-2xl mt-1 shrink-0 select-none">{section.icon}</span>
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
          <div className="sacred-divider mb-10" />
          <p className="text-muted-foreground text-sm md:text-base font-body mb-10 leading-relaxed max-w-xl mx-auto italic">
            {content.closing}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {ctas.map((cta) => (
              <button
                key={cta.label}
                type="button"
                className={`sacred-cta font-caption ${cta.primary ? "sacred-cta-primary" : ""}`}
                onClick={() => openInquiry(cta.topic)}
              >
                {cta.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <PathInquiryForm path="arcani" selectedTopic={selectedTopic} />
    </ViaLayout>
  );
};

const ViaArcani = () => <SiteContentBoundary page="arcani">{content => <ViaArcaniView content={content} />}</SiteContentBoundary>;

export default ViaArcani;
