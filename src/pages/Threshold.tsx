import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ThresholdDoor, { type DoorData } from "@/components/threshold/ThresholdDoor";
import TextDissolveOverlay from "@/components/threshold/TextDissolveOverlay";
import PetalBurstOverlay from "@/components/threshold/PetalBurstOverlay";

const doors: DoorData[] = [
  {
    id: "arcani",
    title: "La Via degli Arcani",
    subtitle: "Tarocchi, consulti ed eventi esoterici",
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
    subtitle: "Arte, musica e letteratura esoterica",
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
  const [titleRect, setTitleRect] = useState<DOMRect | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const titleRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout>>();

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
      if (phase !== "idle") return;

      setActiveDoor(door);

      if (reducedMotion) {
        setPhase("navigating");
        setTimeout(() => navigate(door.route), 400);
        return;
      }

      // Capture title rect
      const titleEl = titleRefs.current[door.id];
      if (titleEl) {
        setTitleRect(titleEl.getBoundingClientRect());
      }

      setPhase("dissolving");

      // Start dark overlay after brief delay
      setTimeout(() => setShowOverlay(true), 300);

      // Fallback: navigate after 3s no matter what
      fallbackTimerRef.current = setTimeout(() => {
        navigate(door.route);
      }, 3000);
    },
    [phase, navigate, reducedMotion]
  );

  const handleDissolveComplete = useCallback(() => {
    if (phase === "navigating") return;
    setPhase("navigating");
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    if (activeDoor) {
      navigate(activeDoor.route);
    }
  }, [activeDoor, navigate, phase]);

  const handleOverlayComplete = useCallback(() => {
    // Overlay finished fading in — dissolve should trigger nav
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-background threshold-bg">
      <div className="absolute inset-0 z-[1] threshold-ambient" aria-hidden="true" />

      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
        aria-label={isMuted ? "Attiva audio" : "Disattiva audio"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <header
          className={`text-center mb-12 md:mb-16 transition-all duration-[1200ms] ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          } ${phase !== "idle" ? "opacity-0 transition-opacity duration-500" : ""}`}
        >
          <p className="text-muted-foreground text-sm tracking-[0.25em] uppercase mb-4 font-caption">
            Jessica Marin — Un solo tempio. Tre vie interiori.
          </p>
          <h1 className="text-foreground leading-none mb-6 font-display">
            Il Tempio delle Tre Vie
          </h1>
          <p className="text-muted-foreground text-base italic font-body max-w-md mx-auto leading-relaxed">
            "Ogni via si apre a chi è pronto ad ascoltare."
          </p>
        </header>

        <nav
          aria-label="Le tre vie"
          className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 transition-all duration-[1500ms] ease-out delay-500 ${
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
              onTitleRef={(id, el) => {
                titleRefs.current[id] = el;
              }}
            />
          ))}
        </nav>

        <p
          className={`mt-12 md:mt-16 text-muted-foreground/40 text-xs tracking-[0.3em] uppercase font-caption transition-all duration-[1800ms] ease-out delay-1000 ${
            visible ? "opacity-100" : "opacity-0"
          } ${phase !== "idle" ? "opacity-0" : ""}`}
        >
          Scegli la soglia che ti chiama
        </p>
      </div>

      {/* Text dissolve overlay */}
      {activeDoor && !reducedMotion && (
        <TextDissolveOverlay
          title={activeDoor.title}
          startRect={titleRect}
          active={phase === "dissolving"}
          onComplete={handleDissolveComplete}
          doorColor={DOOR_COLORS[activeDoor.id]}
        />
      )}

      {/* Dark overlay */}
      {showOverlay && activeDoor && !reducedMotion && (
        <PetalBurstOverlay
          active={true}
          doorColor={DOOR_COLORS[activeDoor.id]}
          onComplete={handleOverlayComplete}
        />
      )}
    </div>
  );
};

export default Threshold;
