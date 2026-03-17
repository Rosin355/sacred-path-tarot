import SparklesCore from "@/components/ui/sparkles";

interface Props {
  active: boolean;
  reducedMotion: boolean;
}

const DoorHoverParticles = ({ active, reducedMotion }: Props) => {
  return (
    <div
      aria-hidden="true"
      className="door-hover-particles"
      data-active={active ? "true" : "false"}
    >
      <div className="door-hover-particles-glow" />
      <SparklesCore
        active={active}
        className="door-hover-sparkles door-hover-sparkles-primary"
        background="transparent"
        minSize={reducedMotion ? 0.65 : 0.75}
        maxSize={reducedMotion ? 1.35 : 1.85}
        speed={reducedMotion ? 0.18 : 0.42}
        particleDensity={reducedMotion ? 36 : 72}
        direction="top"
        particleColor="hsl(var(--door-particle-tint))"
      />
      <SparklesCore
        active={active && !reducedMotion}
        className="door-hover-sparkles door-hover-sparkles-secondary"
        background="transparent"
        minSize={0.55}
        maxSize={1.15}
        speed={0.28}
        particleDensity={32}
        direction="top-right"
        particleColor="hsl(var(--door-color-bright))"
      />
    </div>
  );
};

export default DoorHoverParticles;
