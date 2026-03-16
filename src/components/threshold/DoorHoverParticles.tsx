import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

interface Props {
  active: boolean;
  reducedMotion: boolean;
}

interface ParticleSpec {
  id: number;
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  startY: number;
}

const PARTICLE_COUNT = 14;

const createParticleSpecs = (): ParticleSpec[] =>
  Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: index,
    left: `${38 + ((index * 5) % 24)}%`,
    top: `${50 + ((index * 7) % 28)}%`,
    size: 4 + (index % 4),
    duration: 2.9 + (index % 5) * 0.4,
    delay: index * 0.06,
    driftX: (index % 2 === 0 ? 1 : -1) * (9 + (index % 4) * 2),
    driftY: -18 - (index % 5) * 4,
    startY: 8 + (index % 3) * 2,
  }));

const DoorHoverParticles = ({ active, reducedMotion }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const motionTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const specs = useMemo(createParticleSpecs, []);

  useEffect(() => {
    const container = containerRef.current;
    const particles = particlesRef.current.filter(Boolean) as HTMLSpanElement[];

    if (!container || particles.length === 0) return;

    gsap.set(container, { opacity: 0 });
    gsap.set(particles, { opacity: 0, scale: 0.7, x: 0, y: 0 });

    if (reducedMotion) {
      motionTimelineRef.current?.kill();
      motionTimelineRef.current = null;
      return;
    }

    const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: "sine.out" } });

    particles.forEach((particle, index) => {
      const spec = specs[index];

      tl.fromTo(
        particle,
        { x: 0, y: spec.startY, opacity: 0, scale: 0.55 },
        {
          x: spec.driftX * 0.4,
          y: spec.driftY * 0.4,
          opacity: 0.95,
          scale: 1.04,
          duration: spec.duration * 0.45,
        },
        spec.delay
      ).to(
        particle,
        {
          x: spec.driftX,
          y: spec.driftY,
          opacity: 0,
          scale: 0.78,
          duration: spec.duration * 0.55,
        },
        spec.delay + spec.duration * 0.45
      );
    });

    motionTimelineRef.current = tl;

    return () => {
      tl.kill();
      motionTimelineRef.current = null;
    };
  }, [reducedMotion, specs]);

  useEffect(() => {
    const container = containerRef.current;
    const particles = particlesRef.current.filter(Boolean) as HTMLSpanElement[];

    if (!container || particles.length === 0) return;

    gsap.killTweensOf(container);

    if (active) {
      gsap.to(container, {
        opacity: reducedMotion ? 0.5 : 1,
        duration: reducedMotion ? 0.22 : 0.34,
        ease: "power2.out",
      });

      gsap.to(particles, {
        opacity: reducedMotion ? 0.28 : 0.82,
        scale: reducedMotion ? 0.94 : 1.04,
        duration: reducedMotion ? 0.2 : 0.32,
        ease: "power2.out",
        stagger: reducedMotion ? 0 : 0.025,
        overwrite: "auto",
      });

      if (!reducedMotion) {
        motionTimelineRef.current?.restart(true);
      }
    } else {
      if (!reducedMotion) {
        motionTimelineRef.current?.pause(0);
      }

      gsap.to(container, {
        opacity: 0,
        duration: 0.18,
        ease: "power1.inOut",
      });

      gsap.to(particles, {
        opacity: 0,
        scale: 0.72,
        x: 0,
        y: 0,
        duration: 0.18,
        ease: "power1.inOut",
        stagger: 0.02,
        overwrite: "auto",
      });
    }
  }, [active, reducedMotion]);

  return (
    <div ref={containerRef} aria-hidden="true" className="door-hover-particles">
      {specs.map((spec, index) => (
        <span
          key={spec.id}
          ref={(el) => {
            particlesRef.current[index] = el;
          }}
          className="door-hover-particle"
          style={{
            left: spec.left,
            top: spec.top,
            width: `${spec.size}px`,
            height: `${spec.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default DoorHoverParticles;
