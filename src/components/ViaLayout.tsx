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
    // Start fading out the overlay after mount
    const t = requestAnimationFrame(() => setOverlayVisible(false));
    return () => cancelAnimationFrame(t);
  }, []);

  const overlayBg = doorColor
    ? (() => {
        const { h, s, l } = parseHSL(doorColor);
        return `radial-gradient(ellipse at center, hsla(${h}, ${s}%, ${Math.max(l - 25, 3)}%, 1) 0%, hsla(${h}, ${s}%, ${Math.max(l - 35, 2)}%, 1) 100%)`;
      })()
    : "hsl(var(--background))";

  return (
    <div className={`min-h-screen bg-background ${viaClass}`}>
      {/* Continuity overlay — matches PetalBurstOverlay's final state */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-[1200ms] ease-out"
        style={{
          zIndex: 9999,
          background: overlayBg,
          opacity: overlayVisible ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna al Tempio
        </button>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground/60 text-xs tracking-[0.2em] uppercase hidden sm:block">
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

      {/* Minimal footer */}
      <footer className="py-12 px-6 border-t border-border/20 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm tracking-wide elegant-underline"
        >
          ← Torna al Tempio delle Tre Vie
        </button>
        <p className="text-muted-foreground/40 text-xs mt-4">
          Jessica Marin — Un solo tempio. Tre vie interiori.
        </p>
      </footer>
    </div>
  );
};

export default ViaLayout;
