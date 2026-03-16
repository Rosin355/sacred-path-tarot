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
}

const PARTICLE_COUNT = 8;

const createParticleSpecs = (): ParticleSpec[] =>
  Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    id: index,
    left: `${18 + ((index * 11) % 60)}%`,
    top: `${22 + ((index * 9) % 52)}%`,
    size: 3 + (index % 3),
    duration: 2.8 + (index % 4) * 0.45,
    delay: index * 0.08,
    driftX: (index % 2 === 0 ? 1 : -1) * (6 + (index % 3) * 2),
    driftY: -10 - (index % 4) * 4,
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

    const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: "sine.inOut" } });

    particles.forEach((particle, index) => {
      const spec = specs[index];
      tl.to(
        particle,
        {
          x: spec.driftX,
          y: spec.driftY,
          opacity: 0.75,
          scale: 1,
          duration: spec.duration,
          delay: spec.delay,
          yoyo: true,
          repeat: 1,
          repeatRefresh: false,
        },
        0
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
    gsap.killTweensOf(particles);

    if (active) {
      gsap.to(container, {
        opacity: reducedMotion ? 0.35 : 1,
        duration: reducedMotion ? 0.2 : 0.28,
        ease: "power2.out",
      });

      gsap.to(particles, {
        opacity: reducedMotion ? 0.18 : 0.55,
        scale: 1,
        duration: reducedMotion ? 0.18 : 0.26,
        ease: "power2.out",
        stagger: reducedMotion ? 0 : 0.03,
      });

      if (!reducedMotion) {
        motionTimelineRef.current?.play();
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
