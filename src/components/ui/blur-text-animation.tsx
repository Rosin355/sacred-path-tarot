import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface WordData {
  text: string;
  duration: number;
  delay: number;
  blur: number;
  scale?: number;
}

export interface BlurTextAnimationProps {
  text: string;
  visible: boolean;
  closing: boolean;
  className?: string;
  onExitComplete?: () => void;
}

export default function BlurTextAnimation({
  text,
  visible,
  closing,
  className = "",
  onExitComplete,
}: BlurTextAnimationProps) {
  const reducedMotion = useReducedMotion();
  const exitTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [phase, setPhase] = useState<"hidden" | "entering" | "visible" | "exiting">("hidden");

  const textWords = useMemo(() => {
    const splitWords = text.split(" ");
    const totalWords = splitWords.length;

    return splitWords.map((word, index) => {
      const progress = index / totalWords;
      const exponentialDelay = Math.pow(progress, 0.8) * 0.5;
      const baseDelay = index * 0.06;
      const microVariation = (Math.random() - 0.5) * 0.05;

      return {
        text: word,
        duration: reducedMotion ? 0.6 : 2.2 + Math.cos(index * 0.3) * 0.3,
        delay: reducedMotion
          ? index * 0.02
          : baseDelay + exponentialDelay + microVariation,
        blur: reducedMotion ? 4 : 12 + Math.floor(Math.random() * 8),
        scale: 0.9 + Math.sin(index * 0.2) * 0.05,
      } as WordData;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reducedMotion]);

  // Enter
  useEffect(() => {
    if (visible && !closing) {
      setPhase("entering");
      const maxTime = textWords.reduce(
        (max, w) => Math.max(max, w.delay + w.duration),
        0
      );
      const t = setTimeout(() => setPhase("visible"), (maxTime + 0.3) * 1000);
      return () => clearTimeout(t);
    }
  }, [visible, closing, textWords]);

  // Exit
  useEffect(() => {
    if (closing && phase !== "hidden") {
      setPhase("exiting");
      const exitDuration = reducedMotion ? 400 : 900;
      exitTimerRef.current = setTimeout(() => {
        setPhase("hidden");
        onExitComplete?.();
      }, exitDuration);
      return () => {
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing, reducedMotion, onExitComplete]);

  // Reset when hidden
  useEffect(() => {
    if (!visible && !closing) {
      setPhase("hidden");
    }
  }, [visible, closing]);

  if (phase === "hidden" && !visible) return null;

  const isEntering = phase === "entering" || phase === "visible";
  const isExiting = phase === "exiting";

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-center font-display text-[clamp(1.1rem,2.8vw,2rem)] leading-[1.4] tracking-[0.04em] flex flex-wrap justify-center gap-x-[0.35em] gap-y-[0.2em]">
          {textWords.map((word, index) => {
            const enterStyle: React.CSSProperties = isEntering
              ? {
                  filter: `blur(0px)`,
                  opacity: 1,
                  transform: `scale(1) translateY(0)`,
                  transition: `filter ${word.duration}s cubic-bezier(0.11, 0, 0.5, 0),
                               opacity ${word.duration * 0.6}s ease-out,
                               transform ${word.duration}s cubic-bezier(0.11, 0, 0.5, 0)`,
                  transitionDelay: `${word.delay}s`,
                }
              : {};

            const exitStyle: React.CSSProperties = isExiting
              ? {
                  filter: `blur(${word.blur}px)`,
                  opacity: 0,
                  transform: `scale(${word.scale ?? 0.92}) translateY(6px)`,
                  transition: reducedMotion
                    ? `opacity 0.3s ease-out`
                    : `filter 0.7s ease-in, opacity 0.5s ease-in, transform 0.7s ease-in`,
                  transitionDelay: `${index * 0.02}s`,
                }
              : {};

            const initialStyle: React.CSSProperties =
              !isEntering && !isExiting
                ? {
                    filter: `blur(${word.blur}px)`,
                    opacity: 0,
                    transform: `scale(${word.scale ?? 0.92}) translateY(8px)`,
                  }
                : {};

            return (
              <span
                key={`${word.text}-${index}`}
                className="inline-block text-foreground/90 will-change-[filter,opacity,transform]"
                style={{
                  textShadow: "0 0 20px hsl(var(--foreground) / 0.15)",
                  ...initialStyle,
                  ...enterStyle,
                  ...exitStyle,
                }}
              >
                {word.text}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
