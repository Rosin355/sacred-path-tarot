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
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const ThresholdDoor = forwardRef<DoorHandle, Props>(
  ({ door, phase, isActive, onClick, onPointerEnter, onPointerLeave, onFocus, onBlur }, ref) => {
    const dimmed = phase !== "idle" && !isActive;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);
    const reducedMotion = useReducedMotion();
    const { isHoverActive, deactivateHover, hoverBindings } = useDoorHoverState();

    useImperativeHandle(ref, () => ({
      getTextRect: () => textRef.current?.getBoundingClientRect() ?? null,
      getButtonEl: () => buttonRef.current,
      getTextEl: () => textRef.current
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

      gsap.set([button, text, archGlow, archInner, fog, aura, auraCore, auraHalo], { clearProps: "all" });
      gsap.set(button, { scale: 1 });
      gsap.set(text, { y: 0 });
      gsap.set(archGlow, { opacity: 0 });
      gsap.set(archInner, { opacity: 0.86, filter: "brightness(1)" });
      gsap.set(fog, { opacity: 0.82 });
      gsap.set(aura, { opacity: 0, scale: 0.94, filter: reducedMotion ? "blur(14px)" : "blur(22px)" });
      gsap.set(auraCore, { opacity: 0.78, scale: 0.96 });
      gsap.set(auraHalo, { opacity: 0.56, scale: 0.98 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
      tl.to(button, { scale: 1.022, duration: 0.22 }, 0).
      to(text, { y: -2, duration: 0.22 }, 0).
      to(archGlow, { opacity: reducedMotion ? 0.24 : 0.62, duration: 0.24 }, 0).
      to(archInner, { opacity: reducedMotion ? 0.9 : 1, filter: "brightness(1.12)", duration: 0.24 }, 0).
      to(fog, { opacity: reducedMotion ? 0.88 : 1, duration: 0.24 }, 0).
      to(
        aura,
        {
          opacity: reducedMotion ? 0.5 : 1,
          scale: 1.03,
          filter: reducedMotion ? "blur(14px)" : "blur(24px)",
          duration: 0.28
        },
        0
      ).
      to(auraCore, { scale: 1.08, opacity: reducedMotion ? 0.72 : 1, duration: 0.34 }, 0).
      to(auraHalo, { scale: 1.14, opacity: reducedMotion ? 0.62 : 0.92, duration: 0.38 }, 0.02);

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
      if (!tl || !buttonRef.current) return;

      const button = buttonRef.current;
      const aura = button.querySelector(".door-hover-aura");
      const auraCore = button.querySelector(".door-hover-aura-core");
      const auraHalo = button.querySelector(".door-hover-aura-halo");
      const archGlow = button.querySelector(".divine-light-glow");
      const archInner = button.querySelector(".divine-light-inner");
      const fog = button.querySelector(".fog-effect");
      const text = textRef.current;

      if (isHoverActive && phase === "idle") {
        tl.play();
      } else {
        tl.reverse();
        gsap.to([aura, auraCore, auraHalo, archGlow], {
          opacity: 0,
          duration: 0.18,
          overwrite: true,
          ease: "power1.out"
        });
        gsap.to(aura, {
          scale: 0.94,
          filter: reducedMotion ? "blur(14px)" : "blur(22px)",
          duration: 0.18,
          overwrite: true,
          ease: "power1.out"
        });
        gsap.to(auraCore, { scale: 0.96, duration: 0.18, overwrite: true, ease: "power1.out" });
        gsap.to(auraHalo, { scale: 0.98, duration: 0.18, overwrite: true, ease: "power1.out" });
        gsap.to(archInner, {
          opacity: 0.86,
          filter: "brightness(1)",
          duration: 0.2,
          overwrite: true,
          ease: "power1.out"
        });
        gsap.to(fog, { opacity: 0.82, duration: 0.2, overwrite: true, ease: "power1.out" });
        gsap.to(text, { y: 0, duration: 0.18, overwrite: true, ease: "power1.out" });
        gsap.to(button, { scale: 1, duration: 0.18, overwrite: true, ease: "power1.out" });
      }
    }, [isHoverActive, phase, reducedMotion]);

    return (
      <button
        ref={buttonRef}
        onClick={() => onClick(door)}
        disabled={phase !== "idle"}
        {...hoverBindings}
        onPointerEnter={() => { hoverBindings.onPointerEnter(); onPointerEnter?.(); }}
        onPointerLeave={() => { hoverBindings.onPointerLeave(); onPointerLeave?.(); }}
        onFocus={() => { hoverBindings.onFocus(); onFocus?.(); }}
        onBlur={() => { hoverBindings.onBlur(); onBlur?.(); }}
        data-hover-active={isHoverActive ? "true" : "false"}
        className={`group relative isolate w-[178px] sm:w-[190px] md:w-[198px] lg:w-[222px] cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
          transition-all duration-700 ease-out hover:scale-[1.03]
          ${door.colorClass}
          ${dimmed ? "opacity-0 scale-95 pointer-events-none" : ""}
        `}
        style={{
          transition: dimmed ?
          "opacity 600ms ease-out, transform 600ms ease-out" :
          "transform 700ms ease-out"
        }}
        aria-label={`Entra ne ${door.title}`}>
        
        <DoorAuraLayer active={isHoverActive && phase === "idle"} reducedMotion={reducedMotion} />

        <div className="relative z-10">
          <div
            className="absolute inset-0 divine-light-glow rounded-t-full opacity-0 transition-opacity duration-1000"
            aria-hidden="true" />
          
          <div className="absolute inset-[8%] top-[5%] bottom-[3%] overflow-hidden rounded-t-[999px] threshold-door-inner-light">
            <div className="absolute inset-0 divine-light-inner" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 right-0 h-[40%] fog-effect" aria-hidden="true" />
            <div className="door-threshold-glow" aria-hidden="true" />
            <DoorHoverParticles active={isHoverActive && phase === "idle"} reducedMotion={reducedMotion} />
          </div>
          <img
            src={templeArch}
            alt=""
            className="relative z-10 w-full h-auto pointer-events-none select-none"
            draggable={false} />
          
        </div>

        <div ref={textRef} className="relative z-10 mt-3 text-center space-y-1.5 md:mt-4 md:space-y-2">
          <h3 className="text-foreground text-[0.95rem] md:text-base lg:text-lg tracking-[0.05em] font-display group-hover:text-accent transition-colors duration-500">
            {door.title}
          </h3>
          <p className="text-muted-foreground text-[0.62rem] sm:text-[0.64rem] md:text-[0.65rem] tracking-[0.025em] font-caption leading-relaxed max-w-[30ch] mx-auto px-0 my-px py-0 md:hidden">
            {door.subtitle}
          </p>
        </div>
      </button>);

  }
);

ThresholdDoor.displayName = "ThresholdDoor";
export default ThresholdDoor;