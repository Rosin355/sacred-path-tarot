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
        minSize={reducedMotion ? 1.2 : 1.6}
        maxSize={reducedMotion ? 3.2 : 4.8}
        speed={reducedMotion ? 0.5 : 1.25}
        particleDensity={reducedMotion ? 56 : 132}
        direction="top"
        particleColor="hsl(var(--door-particle-tint))"
      />
      <SparklesCore
        active={active && !reducedMotion}
        className="door-hover-sparkles door-hover-sparkles-secondary"
        background="transparent"
        minSize={1}
        maxSize={2.4}
        speed={0.9}
        particleDensity={72}
        direction="top-right"
        particleColor="hsl(var(--door-color-bright))"
      />
    </div>
  );
};

export default DoorHoverParticles;
