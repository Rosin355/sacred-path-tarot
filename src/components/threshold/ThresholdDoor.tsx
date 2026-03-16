import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import gsap from "gsap";
import templeArch from "@/assets/temple-arch.png";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDoorHoverState } from "@/hooks/useDoorHoverState";
import DoorAuraLayer from "@/components/threshold/DoorAuraLayer";
import DoorHoverParticles from "@/components/threshold/DoorHoverParticles";

export interface DoorData {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  colorClass: string;
}

export interface DoorHandle {
  getTextRect: () => DOMRect | null;
  getButtonEl: () => HTMLButtonElement | null;
  getTextEl: () => HTMLDivElement | null;
}

interface Props {
  door: DoorData;
  phase: "idle" | "dissolving" | "navigating";
  isActive: boolean;
  onClick: (door: DoorData) => void;
}

const ThresholdDoor = forwardRef<DoorHandle, Props>(
  ({ door, phase, isActive, onClick }, ref) => {
    const dimmed = phase !== "idle" && !isActive;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const reducedMotion = useReducedMotion();
    const { isHoverActive, deactivateHover, hoverBindings } = useDoorHoverState();

    useImperativeHandle(ref, () => ({
      getTextRect: () => textRef.current?.getBoundingClientRect() ?? null,
      getButtonEl: () => buttonRef.current,
      getTextEl: () => textRef.current,
    }));

    useEffect(() => {
      if (!buttonRef.current || !textRef.current) return;

      const button = buttonRef.current;
      const text = textRef.current;
      const archGlow = button.querySelector(".divine-light-glow");
      const archInner = button.querySelector(".divine-light-inner");
      const fog = button.querySelector(".fog-effect");
      const aura = button.querySelector(".door-hover-aura");
      const auraCore = button.querySelector(".door-hover-aura-core");
      const auraHalo = button.querySelector(".door-hover-aura-halo");

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
      tl.to(button, { scale: 1.022, duration: 0.22 }, 0)
        .to(text, { y: -2, duration: 0.22 }, 0)
        .to(archGlow, { opacity: reducedMotion ? 0.24 : 0.62, duration: 0.24 }, 0)
        .to(archInner, { opacity: reducedMotion ? 0.88 : 1, filter: "brightness(1.12)", duration: 0.24 }, 0)
        .to(fog, { opacity: reducedMotion ? 0.88 : 1, duration: 0.24 }, 0)
        .to(
          aura,
          {
            opacity: reducedMotion ? 0.5 : 1,
            scale: 1.03,
            filter: reducedMotion ? "blur(14px)" : "blur(24px)",
            duration: 0.28,
          },
          0
        )
        .to(auraCore, { scale: 1.08, opacity: reducedMotion ? 0.72 : 1, duration: 0.34 }, 0)
        .to(auraHalo, { scale: 1.14, opacity: reducedMotion ? 0.62 : 0.92, duration: 0.38 }, 0.02);

      hoverTimelineRef.current = tl;

      return () => {
        tl.kill();
        hoverTimelineRef.current = null;
      };
    }, [reducedMotion]);

    useEffect(() => {
      if (phase !== "idle") {
        deactivateHover();
      }
    }, [phase, deactivateHover]);

    useEffect(() => {
      const tl = hoverTimelineRef.current;
      if (!tl) return;

      if (isHoverActive && phase === "idle") {
        tl.play();
      } else {
        tl.reverse();
      }
    }, [isHoverActive, phase]);

    return (
      <button
        ref={buttonRef}
        onClick={() => onClick(door)}
        disabled={phase !== "idle"}
        {...hoverBindings}
        data-hover-active={isHoverActive ? "true" : "false"}
        className={`group relative isolate w-[200px] md:w-[230px] cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
          transition-all duration-700 ease-out hover:scale-[1.03]
          ${door.colorClass}
          ${dimmed ? "opacity-0 scale-95 pointer-events-none" : ""}
        `}
        style={{
          transition: dimmed
            ? "opacity 600ms ease-out, transform 600ms ease-out"
            : "transform 700ms ease-out",
        }}
        aria-label={`Entra ne ${door.title}`}
      >
        <DoorAuraLayer active={isHoverActive && phase === "idle"} reducedMotion={reducedMotion} />
        <DoorHoverParticles active={isHoverActive && phase === "idle"} reducedMotion={reducedMotion} />

        {/* Arch container */}
        <div className="relative z-10">
          <div
            className="absolute inset-0 divine-light-glow rounded-t-full opacity-0 transition-opacity duration-1000"
            aria-hidden="true"
          />
          <div className="absolute inset-[8%] top-[5%] bottom-[3%] overflow-hidden">
            <div className="absolute inset-0 divine-light-inner" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 right-0 h-[40%] fog-effect" aria-hidden="true" />
          </div>
          <img
            src={templeArch}
            alt=""
            className="relative z-10 w-full h-auto pointer-events-none select-none"
            draggable={false}
          />
        </div>

        {/* Text below arch */}
        <div ref={textRef} className="relative z-10 mt-4 text-center space-y-2">
          <h3 className="text-foreground text-base md:text-lg tracking-[0.06em] font-display group-hover:text-accent transition-colors duration-500">
            {door.title}
          </h3>
          <p className="text-muted-foreground text-[0.65rem] tracking-wide font-caption leading-relaxed">
            {door.subtitle}
          </p>
        </div>
      </button>
    );
  }
);

ThresholdDoor.displayName = "ThresholdDoor";
export default ThresholdDoor;
