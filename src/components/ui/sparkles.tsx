import { useEffect, useId, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

type SparklesCoreProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
  active?: boolean;
  direction?: "top" | "top-right" | "top-left" | "none";
};

const DIRECTION_ANGLE: Record<NonNullable<SparklesCoreProps["direction"]>, number> = {
  top: 270,
  "top-right": 315,
  "top-left": 225,
  none: 0,
};

const COLOR_VAR_FALLBACK = "0 0% 100%";

const resolveCssVarColor = (color: string, target?: HTMLElement | null) => {
  if (!color.includes("var(") || !target) return color;

  const computed = getComputedStyle(target);

  return color.replace(/var\((--[^)]+)\)/g, (_, token: string) => {
    const value = computed.getPropertyValue(token).trim();
    return value || COLOR_VAR_FALLBACK;
  });
};

export const SparklesCore = ({
  id,
  className,
  background = "transparent",
  minSize = 1,
  maxSize = 3,
  speed = 1,
  particleColor = "hsl(var(--foreground))",
  particleDensity = 120,
  active = true,
  direction = "top",
}: SparklesCoreProps) => {
  const [init, setInit] = useState(false);
  const [resolvedParticleColor, setResolvedParticleColor] = useState(particleColor);
  const controls = useAnimation();
  const generatedId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  useEffect(() => {
    setResolvedParticleColor(resolveCssVarColor(particleColor, containerRef.current));
  }, [particleColor]);

  useEffect(() => {
    controls.start({
      opacity: active ? 1 : 0,
      transition: {
        duration: active ? 0.28 : 0.18,
        ease: "easeOut",
      },
    });
  }, [active, controls]);

  const particlesLoaded = async (container?: Container) => {
    if (!container || !active) return;

    controls.start({
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    });
  };

  const options = useMemo<ISourceOptions>(
    () => ({
      background: {
        color: {
          value: background,
        },
      },
      fullScreen: {
        enable: false,
        zIndex: 1,
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push",
          },
          onHover: {
            enable: false,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
        },
      },
      particles: {
        color: {
          value: resolvedParticleColor,
        },
        move: {
          angle: {
            offset: 0,
            value: DIRECTION_ANGLE[direction],
          },
          direction: direction === "none" ? "none" : "top",
          enable: true,
          outModes: {
            default: "out",
          },
          random: false,
          speed: {
            min: 0.1,
            max: speed,
          },
          straight: false,
        },
        number: {
          density: {
            enable: true,
            width: 400,
            height: 400,
          },
          value: particleDensity,
        },
        opacity: {
          value: {
            min: 0.1,
            max: 1,
          },
          animation: {
            enable: true,
            speed: Math.max(1.2, speed * 4),
            sync: false,
            startValue: "random",
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: {
            min: minSize,
            max: maxSize,
          },
        },
        links: {
          enable: false,
        },
      },
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
    }),
    [background, direction, maxSize, minSize, particleDensity, resolvedParticleColor, speed]
  );

  return (
    <motion.div ref={containerRef} animate={controls} className={cn("pointer-events-none opacity-0", className)}>
      {init ? (
        <Particles
          id={id ?? generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={options}
        />
      ) : null}
    </motion.div>
  );
};

export default SparklesCore;
