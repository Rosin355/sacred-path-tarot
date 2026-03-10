import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Props {
  active: boolean;
  doorColor: string; // e.g. "270 55% 45%"
  onComplete?: () => void;
}

function parseHSL(color: string): { h: number; s: number; l: number } {
  const nums = color.match(/[\d.]+/g);
  if (!nums || nums.length < 3) return { h: 270, s: 55, l: 45 };
  return { h: parseFloat(nums[0]), s: parseFloat(nums[1]), l: parseFloat(nums[2]) };
}

/** Simplified: just a dark overlay that fades in, then calls onComplete */
const PetalBurstOverlay = ({ active, doorColor, onComplete }: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !overlayRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => onComplete?.(),
      }
    );

    return () => {
      tl.kill();
    };
  }, [active, onComplete]);

  if (!active) return null;

  const { h, s, l } = parseHSL(doorColor);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 9998,
        background: `radial-gradient(ellipse at center, hsla(${h}, ${s}%, ${Math.max(l - 25, 3)}%, 0.7) 0%, hsla(${h}, ${s}%, ${Math.max(l - 35, 2)}%, 0.9) 100%)`,
        opacity: 0,
      }}
      aria-hidden="true"
    />
  );
};

export default PetalBurstOverlay;
