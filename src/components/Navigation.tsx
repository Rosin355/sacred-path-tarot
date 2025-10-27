import { Button } from "@/components/ui/button";
import { Menu, Volume2, VolumeX, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { UnderwaterNavigation } from "@/components/ui/UnderwaterNavigation";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isMuted, toggleMute } = useBackgroundMusic();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { playNavigation } = useSoundEffects();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <nav className="container mx-auto px-6 lg:px-12 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')} 
            className="text-xl font-display font-bold tracking-tight hover:text-accent transition-colors"
          >
            TAROCCHI PER ILLUMINARSI
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <a href="#metodo" onClick={playNavigation} className="text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors elegant-underline">
              Metodo
            </a>
            <a href="#lettura" onClick={playNavigation} className="text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors elegant-underline">
              Consultazione
            </a>
            <a href="#percorso" onClick={playNavigation} className="text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors elegant-underline">
              Percorso
            </a>
            <button
              onClick={toggleMute}
              className="p-2 minimal-border bg-card/30 hover:bg-card/50 transition-colors"
              aria-label={isMuted ? "Attiva musica" : "Disattiva musica"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            {!user ? (
              <Button variant="outline" size="sm" className="minimal-border hover-lift" onClick={() => { playNavigation(); navigate('/login'); }}>
                Login
              </Button>
            ) : (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" className="minimal-border hover-lift" onClick={() => { playNavigation(); navigate('/admin'); }}>
                    Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => { playNavigation(); handleLogout(); }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Esci
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu - Hamburger Button */}
          <div className="md:hidden flex items-center gap-3">
            {!user ? (
              <Button variant="outline" size="sm" className="minimal-border hover-lift" onClick={() => { playNavigation(); navigate('/login'); }}>
                Login
              </Button>
            ) : (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" className="minimal-border hover-lift" onClick={() => { playNavigation(); navigate('/admin'); }}>
                    Admin
                  </Button>
                )}
              </>
            )}
            <button
              className="text-foreground p-2 minimal-border bg-card/30 hover:bg-card/50 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Underwater Navigation Overlay */}
      <UnderwaterNavigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Navigation;
