import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ThresholdDoor, { type DoorData, type DoorHandle } from "@/components/threshold/ThresholdDoor";
import DoorDissolveOverlay from "@/components/threshold/DoorDissolveOverlay";
import PetalBurstOverlay from "@/components/threshold/PetalBurstOverlay";

const doors: DoorData[] = [
  {
    id: "arcani",
    title: "La Via degli Arcani",
    subtitle:
      "TAROCCHI, SIMBOLI, CONSULTI PERSONALI, CORSI E PERCORSI DI FORMAZIONE PER DIVENTARE UN INTERPRETE PREPARATO",
    route: "/arcani",
    colorClass: "door-arcani",
  },
  {
    id: "respiro",
    title: "La Via del Respiro",
    subtitle: "Yoga, pranayama, corpo e presenza",
    route: "/respiro",
    colorClass: "door-respiro",
  },
  {
    id: "ispirazione",
    title: "La Via dell'Ispirazione",
    subtitle: "Arte esoterica, musica, letteratura simbolica e visioni",
    route: "/ispirazione",
    colorClass: "door-ispirazione",
  },
];

const DOOR_COLORS: Record<string, string> = {
  arcani: "270 55% 45%",
  respiro: "175 40% 45%",
  ispirazione: "38 55% 52%",
};

type Phase = "idle" | "dissolving" | "navigating";

const Threshold = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { isMuted, toggleMute } = useBackgroundMusic();
  const reducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [activeDoor, setActiveDoor] = useState<DoorData | null>(null);
  const [doorRect, setDoorRect] = useState<DOMRect | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const activeTextRef = useRef<HTMLDivElement | null>(null);

  const doorHandleRefs = useRef<Record<string, DoorHandle | null>>({});
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const activeDoorRef = useRef<DoorData | null>(null);
  const phaseRef = useRef<Phase>("idle");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  const handleDoorClick = useCallback(
    (door: DoorData) => {
      // Guard sync to prevent double-trigger on very fast double click/tap
      if (phaseRef.current !== "idle") return;

      setActiveDoor(door);
      activeDoorRef.current = door;
      setShowOverlay(false);

      if (reducedMotion) {
        setPhase("navigating");
        phaseRef.current = "navigating";
        setTimeout(() => navigate(door.route), 400);
        return;
      }

      // Capture the text area rect only
      const handle = doorHandleRefs.current[door.id];
      if (handle) {
        setDoorRect(handle.getTextRect());
        activeTextRef.current = handle.getTextEl();
      }

      setPhase("dissolving");
      phaseRef.current = "dissolving";

      // Fallback: keep longer than the full dissolve chain to avoid premature route switch
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = setTimeout(() => {
        const d = activeDoorRef.current;
        if (d) navigate(d.route, { state: { doorColor: DOOR_COLORS[d.id] } });
      }, 5200);
    },
    [navigate, reducedMotion],
  );

  const handleDissolveComplete = useCallback(() => {
    if (phaseRef.current !== "dissolving") return;
    setShowOverlay(true);
  }, []);

  const handleOverlayComplete = useCallback(() => {
    if (phaseRef.current === "navigating") return;
    setPhase("navigating");
    phaseRef.current = "navigating";
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    // Small delay while fully dark, then navigate with color state
    setTimeout(() => {
      const d = activeDoorRef.current;
      if (d) {
        navigate(d.route, { state: { doorColor: DOOR_COLORS[d.id] } });
      }
    }, 800);
  }, [navigate]);

  return (
    <div className="relative h-[100dvh] w-full overflow-x-hidden overflow-y-auto bg-background threshold-bg md:fixed md:inset-0 md:h-full md:overflow-hidden">
      <div className="absolute inset-0 z-[1] pointer-events-none threshold-ambient" aria-hidden="true" />

      <button
        onClick={toggleMute}
        className="fixed top-4 right-4 z-50 p-2 text-muted-foreground hover:text-foreground transition-colors duration-300 md:top-5 md:right-5"
        aria-label={isMuted ? "Attiva audio" : "Disattiva audio"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start px-4 pt-14 pb-24 sm:px-6 sm:pt-16 md:h-full md:justify-center md:px-6 md:pt-4 md:pb-6 lg:pt-2 lg:pb-4">
        <header
          className={`threshold-hero-header order-1 text-center mb-6 max-w-4xl md:mb-4 lg:mb-5 transition-all duration-[1200ms] ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          } ${phase !== "idle" ? "opacity-0 transition-opacity duration-500" : ""}`}
        >
          <p className="text-muted-foreground text-[0.68rem] tracking-[0.24em] uppercase mb-3 font-caption sm:text-xs md:mb-3">
            Benvenuto nel Tempio
          </p>
          <h1 className="text-foreground leading-[0.92] mb-0 font-display text-[clamp(2.35rem,4.45vw,4.2rem)] md:mb-0">
            Tarocchi & Yoga <em className="italic">per</em> Illuminarsi
          </h1>
        </header>

        <div
          className={`threshold-intro-copy order-3 mt-7 mb-8 max-w-[34rem] text-center md:order-2 md:mt-0 md:mb-6 lg:mb-7 transition-all duration-[1400ms] ease-out delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          } ${phase !== "idle" ? "opacity-0" : ""}`}
        >
          <div className="threshold-intro-copy__veil">
            <p className="text-muted-foreground text-[0.98rem] font-body leading-relaxed md:text-[0.9rem] md:leading-[1.58] lg:text-[0.95rem]">
              Sono Jessica Marin, la Sacerdotessa che ti guiderà verso le profondità della tua anima e dell’inconscio
              collettivo umano, costellato di simboli e chiavi segrete che ti aiuterò a reintegrare per far emergere la
              pienezza realizzativa del tuo essere!
            </p>
            <p className="mt-4 text-muted-foreground text-[0.98rem] font-body leading-relaxed md:mt-3 md:text-[0.9rem] md:leading-[1.58] lg:text-[0.95rem]">
              Nei miei Corsi, Percorsi e Workshop trasmetto le conoscenze Esoteriche e Yogiche-motorie dai livelli basi
              a quelli avanzati. Sei pronto a trovare la tua luce interiore? Scegli la tua via!
            </p>
          </div>
        </div>

        <nav
          aria-label="Le tre vie"
          className={`threshold-door-grid order-2 md:order-3 flex flex-col md:flex-row items-center justify-center gap-5 md:gap-5 lg:gap-6 transition-all duration-[1500ms] ease-out delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {doors.map((door) => (
            <ThresholdDoor
              key={door.id}
              door={door}
              phase={phase}
              isActive={activeDoor?.id === door.id}
              onClick={handleDoorClick}
              ref={(el) => {
                doorHandleRefs.current[door.id] = el;
              }}
            />
          ))}
        </nav>

        <p
          className={`order-4 mt-8 md:mt-7 lg:mt-8 text-muted-foreground/40 text-[0.62rem] tracking-[0.28em] uppercase font-caption transition-all duration-[1800ms] ease-out delay-1000 text-center ${
            visible ? "opacity-100" : "opacity-0"
          } ${phase !== "idle" ? "opacity-0" : ""}`}
        >
          Scegli la soglia che ti chiama
        </p>
      </div>

      {/* Door dissolve overlay */}
      {activeDoor && !reducedMotion && (
        <DoorDissolveOverlay
          doorRect={doorRect}
          active={phase === "dissolving"}
          onComplete={handleDissolveComplete}
          doorColor={DOOR_COLORS[activeDoor.id]}
          textRef={activeTextRef as React.RefObject<HTMLDivElement>}
        />
      )}

      {/* Dark overlay */}
      {showOverlay && activeDoor && !reducedMotion && (
        <PetalBurstOverlay active={true} doorColor={DOOR_COLORS[activeDoor.id]} onComplete={handleOverlayComplete} />
      )}
    </div>
  );
};

export default Threshold;
