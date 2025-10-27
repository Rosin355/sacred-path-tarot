import { Button } from "@/components/ui/button";
import { Menu, X, Volume2, VolumeX, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isMuted, toggleMute } = useBackgroundMusic();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();

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
          <a href="/" className="text-xl font-display font-bold tracking-tight hover:text-accent transition-colors">
            TAROCCHI PER ILLUMINARSI
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <a href="#metodo" className="text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors elegant-underline">
              Metodo
            </a>
            <a href="#lettura" className="text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors elegant-underline">
              Consultazione
            </a>
            <a href="#percorso" className="text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors elegant-underline">
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
              <Button variant="outline" size="sm" className="minimal-border hover-lift" onClick={() => navigate('/login')}>
                Login
              </Button>
            ) : (
              <>
                {isAdmin() && (
                  <Button variant="outline" size="sm" className="minimal-border hover-lift" onClick={() => navigate('/admin')}>
                    Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Esci
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="p-2 minimal-border bg-card/30"
              aria-label={isMuted ? "Attiva musica" : "Disattiva musica"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              className="text-foreground p-2 minimal-border bg-card/30"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              onClick={() => setIsMenuOpen(false)}
            >
              Metodo
            </a>
            <a 
              href="#lettura" 
              className="block text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Consultazione
            </a>
            <a 
              href="#percorso" 
              className="block text-sm tracking-wide uppercase font-light text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Percorso
            </a>
            
            {!user ? (
              <Button variant="outline" size="sm" className="w-full minimal-border" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
                Login
              </Button>
            ) : (
              <>
                {isAdmin() && (
                  <Button variant="outline" size="sm" className="w-full minimal-border" onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}>
                    Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="w-full" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Esci
                </Button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
