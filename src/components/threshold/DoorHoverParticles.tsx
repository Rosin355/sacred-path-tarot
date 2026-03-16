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
        minSize={reducedMotion ? 0.9 : 1.1}
        maxSize={reducedMotion ? 2.2 : 3.1}
        speed={reducedMotion ? 0.45 : 1.05}
        particleDensity={reducedMotion ? 48 : 108}
        direction="top"
        particleColor="hsl(var(--door-particle-tint))"
      />
      <SparklesCore
        active={active && !reducedMotion}
        className="door-hover-sparkles door-hover-sparkles-secondary"
        background="transparent"
        minSize={0.8}
        maxSize={1.8}
        speed={0.8}
        particleDensity={58}
        direction="top-right"
        particleColor="hsl(var(--door-color-bright))"
      />
    </div>
  );
};

export default DoorHoverParticles;
