import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import BlurTextAnimation from "@/components/ui/blur-text-animation";

interface Props {
  text: string | null;
  visible: boolean;
  closing: boolean;
  doorId: string | null;
  onPopupPointerEnter: () => void;
  onPopupPointerLeave: () => void;
  onCloseClick: () => void;
  onExitComplete: () => void;
  onEscapeKey: () => void;
}

const DOOR_ACCENT: Record<string, string> = {
  arcani: "270 55% 45%",
  respiro: "175 40% 45%",
  ispirazione: "38 55% 52%",
};

export default function FullscreenDoorSubtitlePopup({
  text,
  visible,
  closing,
  doorId,
  onPopupPointerEnter,
  onPopupPointerLeave,
  onCloseClick,
  onExitComplete,
  onEscapeKey,
}: Props) {
  // Escape key
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscapeKey();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, onEscapeKey]);

  const handleExitComplete = useCallback(() => {
    onExitComplete();
  }, [onExitComplete]);

  if (!visible || !text) return null;

  const accentHsl = doorId ? DOOR_ACCENT[doorId] : undefined;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ pointerEvents: "none" }}
      aria-live="polite"
      role="status"
    >
      {/* Atmospheric veil — non-blocking */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: accentHsl
            ? `radial-gradient(ellipse at center, hsl(${accentHsl} / 0.12) 0%, hsl(0 0% 4% / 0.55) 70%, hsl(0 0% 2% / 0.7) 100%)`
            : "radial-gradient(ellipse at center, hsl(0 0% 10% / 0.3) 0%, hsl(0 0% 2% / 0.65) 100%)",
          opacity: closing ? 0 : 1,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* Interactive zone: close button */}
      <div
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50"
        style={{ pointerEvents: "auto" }}
        onPointerEnter={onPopupPointerEnter}
        onPointerLeave={onPopupPointerLeave}
      >
        <button
          onClick={onCloseClick}
          className="group p-2.5 rounded-full border border-foreground/10 bg-background/20 backdrop-blur-sm
                     text-foreground/50 hover:text-foreground/80 hover:border-foreground/25
                     hover:bg-background/30 transition-all duration-300
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Chiudi sottotitolo"
        >
          <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </div>

      {/* Text area — hoverable for keeping popup alive */}
      <div
        className="relative z-10 w-full max-w-3xl mx-auto px-8"
        style={{ pointerEvents: "auto" }}
        onPointerEnter={onPopupPointerEnter}
        onPointerLeave={onPopupPointerLeave}
      >
        <BlurTextAnimation
          text={text}
          visible={visible}
          closing={closing}
          onExitComplete={handleExitComplete}
        />
      </div>
    </div>
  );
}
