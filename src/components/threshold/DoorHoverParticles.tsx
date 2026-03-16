import SparklesCore from "@/components/ui/sparkles";

interface Props {
  active: boolean;
  reducedMotion: boolean;
}

const DoorHoverParticles = ({ active, reducedMotion }: Props) => {
  return (
    <div aria-hidden="true" className="door-hover-particles">
      <div className="door-hover-particles-glow" />
      <SparklesCore
        active={active}
        className="door-hover-sparkles door-hover-sparkles-primary"
        background="transparent"
        minSize={reducedMotion ? 1.2 : 1.4}
        maxSize={reducedMotion ? 2.2 : 3.2}
        speed={reducedMotion ? 0.18 : 0.5}
        particleDensity={reducedMotion ? 16 : 28}
        direction="top"
        particleColor="hsl(var(--door-particle-tint))"
      />
      <SparklesCore
        active={active && !reducedMotion}
        className="door-hover-sparkles door-hover-sparkles-secondary"
        background="transparent"
        minSize={1}
        maxSize={2.4}
        speed={0.75}
        particleDensity={18}
        direction="top-right"
        particleColor="hsl(var(--foreground))"
      />
    </div>
  );
};

export default DoorHoverParticles;
