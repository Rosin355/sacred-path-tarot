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
        minSize={reducedMotion ? 1.4 : 1.8}
        maxSize={reducedMotion ? 2.8 : 4.2}
        speed={reducedMotion ? 0.36 : 0.9}
        particleDensity={reducedMotion ? 28 : 68}
        direction="top"
        particleColor="hsl(var(--door-particle-tint))"
      />
      <SparklesCore
        active={active && !reducedMotion}
        className="door-hover-sparkles door-hover-sparkles-secondary"
        background="transparent"
        minSize={1.2}
        maxSize={2.8}
        speed={0.72}
        particleDensity={32}
        direction="top"
        particleColor="hsl(var(--foreground))"
      />
    </div>
  );
};

export default DoorHoverParticles;
