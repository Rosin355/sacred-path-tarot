import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";

interface ViaLayoutProps {
  children: ReactNode;
  viaClass: string;
  title: string;
}

function parseHSL(color: string): { h: number; s: number; l: number } {
  const nums = color.match(/[\d.]+/g);
  if (!nums || nums.length < 3) return { h: 270, s: 55, l: 45 };
  return { h: parseFloat(nums[0]), s: parseFloat(nums[1]), l: parseFloat(nums[2]) };
}

const ViaLayout = ({ children, viaClass, title }: ViaLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMuted, toggleMute } = useBackgroundMusic();
  const [overlayVisible, setOverlayVisible] = useState(true);

  const doorColor = (location.state as any)?.doorColor as string | undefined;

  useEffect(() => {
    const frame1 = requestAnimationFrame(() => {
      const frame2 = requestAnimationFrame(() => {
        setOverlayVisible(false);
      });
      (frame1 as any).__inner = frame2;
    });
    return () => {
      cancelAnimationFrame(frame1);
      if ((frame1 as any).__inner) cancelAnimationFrame((frame1 as any).__inner);
    };
  }, []);

  const overlayBg = doorColor
    ? (() => {
        const { h, s, l } = parseHSL(doorColor);
        return `radial-gradient(ellipse at center, hsla(${h}, ${s}%, ${Math.max(l - 25, 3)}%, 1) 0%, hsla(${h}, ${s}%, ${Math.max(l - 35, 2)}%, 1) 100%)`;
      })()
    : "hsl(var(--background))";

  return (
    <div className={`min-h-screen bg-background ${viaClass}`}>
      {/* Continuity overlay */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-[1800ms] ease-out"
        style={{
          zIndex: 9999,
          background: overlayBg,
          opacity: overlayVisible ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/15">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Torna al Tempio</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground/50 text-[10px] tracking-[0.25em] uppercase hidden sm:block font-caption">
            {title}
          </span>
          <button
            onClick={toggleMute}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors duration-300"
            aria-label={isMuted ? "Attiva audio" : "Disattiva audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-20">{children}</main>

      {/* Refined footer with closing block */}
      <footer className="relative">
        {/* Closing reflective block */}
        <div className="sacred-closing border-t border-border/10">
          <div className="sacred-divider mb-10" />
          <p className="text-muted-foreground/60 text-sm font-body italic max-w-md mx-auto leading-relaxed mb-8">
            "Il cammino è il tempio stesso."
          </p>
          <button
            onClick={() => navigate("/")}
            className="sacred-cta-primary sacred-cta font-caption"
          >
            ← Torna al Tempio delle Tre Vie
          </button>
        </div>

        {/* Bottom line */}
        <div className="py-6 px-6 text-center border-t border-border/8">
          <p className="text-muted-foreground/30 text-xs font-caption tracking-[0.15em]">
            Jessica Marin — Un solo tempio. Tre vie interiori.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ViaLayout;
