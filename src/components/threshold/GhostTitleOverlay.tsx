import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  title: string;
  startRect: DOMRect | null;
  active: boolean;
  onCentered?: () => void;
  doorColor: string;
}

const GhostTitleOverlay = ({ title, startRect, active, onCentered, doorColor }: Props) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!active || !startRect || !ref.current) return;

    const el = ref.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Position at original location
    gsap.set(el, {
      position: "fixed",
      left: startRect.left,
      top: startRect.top,
      width: startRect.width,
      fontSize: window.getComputedStyle(el).fontSize,
      opacity: 1,
      zIndex: 9999,
    });

    // Animate to center
    const tl = gsap.timeline({
      onComplete: () => onCentered?.(),
    });

    tl.to(el, {
      left: vw / 2 - startRect.width / 2,
      top: vh / 2 - startRect.height / 2,
      scale: 1.3,
      duration: 0.9,
      ease: "power2.inOut",
    }).to(
      el,
      {
        opacity: 0,
        scale: 1.6,
        duration: 0.5,
        ease: "power2.in",
      },
      "-=0.15"
    );

    return () => {
      tl.kill();
    };
  }, [active, startRect, onCentered]);

  if (!active || !startRect) return null;

  return (
    <h3
      ref={ref}
      className="fixed pointer-events-none text-foreground text-base md:text-lg tracking-[0.06em] whitespace-nowrap"
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        textShadow: `0 0 30px ${doorColor}, 0 0 60px ${doorColor}`,
        zIndex: 9999,
      }}
    >
      {title}
    </h3>
  );
};

export default GhostTitleOverlay;
