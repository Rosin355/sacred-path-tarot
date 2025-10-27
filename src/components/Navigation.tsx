import { Button } from "@/components/ui/button";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { useAmbientDrone } from "@/hooks/useAmbientDrone";
import { useHarmonicSound } from "@/hooks/useHarmonicSound";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMuted, toggleMute, isPlaying } = useAmbientDrone();
  const { playNote, playArpeggio } = useHarmonicSound();

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      playArpeggio(['G', 'E', 'D'], 0.12); // Closing - descending
    } else {
      playArpeggio(['D', 'E', 'G'], 0.12); // Opening - ascending
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = () => {
    playNote('A', 1.2);
    setIsMenuOpen(false);
  };

  const handleAudioToggle = () => {
    toggleMute();
    if (!isMuted) {
      playNote('D', 0.8); // Soft confirmation note when unmuting
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <nav className="container mx-auto px-6 lg:px-12 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-xl font-display font-bold tracking-tight hover:text-accent transition-colors">
            TAROCCHI PER ILLUMINARSI
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <a href="#metodo" className="text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors elegant-underline" onClick={() => playNote('A')}>
              Metodo
            </a>
            <a href="#lettura" className="text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors elegant-underline" onClick={() => playNote('A')}>
              Consultazione
            </a>
            <a href="#percorso" className="text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors elegant-underline" onClick={() => playNote('A')}>
              Percorso
            </a>
            <Button variant="outline" size="sm" className="minimal-border hover-lift" onClick={() => playNote('A')}>
              Inizia
            </Button>
          </div>

          {/* Audio Controls & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleAudioToggle}
              className={`p-2 hover:bg-card/50 rounded-md transition-all ${
                isPlaying && !isMuted ? 'text-accent animate-pulse' : ''
              }`}
              aria-label={isMuted ? "Attiva audio" : "Disattiva audio"}
              title={isMuted ? "Clicca per attivare l'audio ambient" : "Audio ambient attivo"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              className="md:hidden text-foreground p-2 minimal-border bg-card/30"
              onClick={handleMenuToggle}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-8 pt-8 border-t border-border space-y-6 animate-fade-in">
            <a 
              href="#metodo" 
              className="block text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors"
              onClick={handleNavClick}
            >
              Metodo
            </a>
            <a 
              href="#lettura" 
              className="block text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors"
              onClick={handleNavClick}
            >
              Consultazione
            </a>
            <a 
              href="#percorso" 
              className="block text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors"
              onClick={handleNavClick}
            >
              Percorso
            </a>
            <Button variant="outline" size="sm" className="w-full minimal-border" onClick={handleNavClick}>
              Inizia
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
