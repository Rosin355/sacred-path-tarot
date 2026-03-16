import { useEffect, useId, useMemo, useState } from "react";
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

export const SparklesCore = ({
  id,
  className,
  background,
  minSize = 1,
  maxSize = 3,
  speed = 0.8,
  particleColor = "#ffffff",
  particleDensity = 36,
  active = true,
  direction = "top",
}: SparklesCoreProps) => {
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

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
    if (container && active) {
      controls.start({
        opacity: 1,
        transition: { duration: 0.6 },
      });
    }
  };

  const options = useMemo<ISourceOptions>(
    () => ({
      background: {
        color: {
          value: background ?? "transparent",
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
      },
      particles: {
        color: {
          value: particleColor,
        },
        move: {
          angle: {
            offset: 0,
            value: DIRECTION_ANGLE[direction],
          },
          direction: direction === "none" ? "none" : "top",
          enable: active,
          outModes: {
            default: "out",
          },
          random: true,
          speed: {
            min: speed * 0.45,
            max: speed * 1.35,
          },
          straight: false,
        },
        number: {
          density: {
            enable: true,
            width: 420,
            height: 420,
          },
          value: active ? particleDensity : 0,
        },
        opacity: {
          value: {
            min: 0.08,
            max: 0.9,
          },
          animation: {
            enable: true,
            speed: 0.9,
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
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.08,
            opacity: 1,
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
    [active, background, direction, maxSize, minSize, particleColor, particleDensity, speed]
  );

  return (
    <motion.div animate={controls} className={cn("pointer-events-none opacity-0", className)}>
      {init ? (
        <Particles id={id ?? generatedId} className="h-full w-full" particlesLoaded={particlesLoaded} options={options} />
      ) : null}
    </motion.div>
  );
};

export default SparklesCore;
