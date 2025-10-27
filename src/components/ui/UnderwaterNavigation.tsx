import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { Volume2, VolumeX, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const UnderwaterNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isMuted, toggleMute } = useBackgroundMusic();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { playNavigation } = useSoundEffects();

  useEffect(() => {
    if (!overlayRef.current || !linksRef.current) return;

    if (isOpen) {
      // Open animation
      gsap.set(overlayRef.current, { display: 'flex' });
      
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      })
      .from(linksRef.current.children, {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.2");
    } else {
      // Close animation
      const tl = gsap.timeline({
        onComplete: () => {
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { display: 'none' });
          }
        }
      });
      
      tl.to(linksRef.current.children, {
        opacity: 0,
        y: -20,
        stagger: 0.05,
        duration: 0.3,
        ease: "power2.in"
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.1");
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const handleNavClick = (href: string) => {
    playNavigation();
    setIsOpen(false);
    
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => {
          playNavigation();
          setIsOpen(!isOpen);
        }}
        className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 minimal-border bg-card/30 hover:bg-card/50 transition-colors z-50"
        aria-label="Menu"
      >
        <span 
          className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span 
          className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span 
          className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Full-screen Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 hidden opacity-0 flex-col items-center justify-center backdrop-blur-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 100%)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            playNavigation();
            setIsOpen(false);
          }}
          className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center minimal-border bg-card/30 hover:bg-card/50 transition-colors"
          aria-label="Close menu"
        >
          <span className="text-2xl font-light">×</span>
        </button>

        {/* Navigation Links */}
        <nav ref={linksRef} className="flex flex-col items-center gap-8 mb-12">
          <a
            href="#metodo"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#metodo');
            }}
            className="underwater-link text-4xl md:text-5xl font-display uppercase tracking-wider text-foreground/90 hover:text-accent transition-all duration-500"
          >
            Metodo
          </a>
          <a
            href="#lettura"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#lettura');
            }}
            className="underwater-link text-4xl md:text-5xl font-display uppercase tracking-wider text-foreground/90 hover:text-accent transition-all duration-500"
          >
            Consultazione
          </a>
          <a
            href="#percorso"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#percorso');
            }}
            className="underwater-link text-4xl md:text-5xl font-display uppercase tracking-wider text-foreground/90 hover:text-accent transition-all duration-500"
          >
            Percorso
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#about');
            }}
            className="underwater-link text-4xl md:text-5xl font-display uppercase tracking-wider text-foreground/90 hover:text-accent transition-all duration-500"
          >
            About
          </a>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#services');
            }}
            className="underwater-link text-4xl md:text-5xl font-display uppercase tracking-wider text-foreground/90 hover:text-accent transition-all duration-500"
          >
            Contatti
          </a>
        </nav>

        {/* Bottom Controls */}
        <div className="flex flex-col items-center gap-6">
          {/* Audio Control */}
          <button
            onClick={() => {
              playNavigation();
              toggleMute();
            }}
            className="p-3 minimal-border bg-card/30 hover:bg-card/50 transition-colors"
            aria-label={isMuted ? "Attiva musica" : "Disattiva musica"}
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>

          {/* Auth Buttons */}
          {!user ? (
            <Button
              variant="outline"
              className="minimal-border hover-lift"
              onClick={() => {
                playNavigation();
                handleNavClick('/login');
              }}
            >
              Login
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {isAdmin && (
                <Button
                  variant="outline"
                  className="minimal-border hover-lift"
                  onClick={() => {
                    playNavigation();
                    handleNavClick('/admin');
                  }}
                >
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  playNavigation();
                  handleLogout();
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UnderwaterNavigation;
