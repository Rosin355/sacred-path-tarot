import { useEffect, useRef, useState } from 'react';
import { X, Volume2, VolumeX, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface UnderwaterNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnderwaterNavigation = ({ isOpen, onClose }: UnderwaterNavigationProps) => {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const { isMuted, toggleMute } = useBackgroundMusic();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { playNavigation } = useSoundEffects();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    onClose();
  };

  const handleNavigate = (path: string) => {
    playNavigation();
    if (path.startsWith('#')) {
      window.location.hash = path;
    } else {
      navigate(path);
    }
    onClose();
  };

  useEffect(() => {
    if (!overlayRef.current || !linksRef.current) return;

    const links = linksRef.current.querySelectorAll('.underwater-link');

    if (isOpen) {
      // Entrance animation
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { opacity: 0, backdropFilter: 'blur(0px)' },
        { opacity: 1, backdropFilter: 'blur(20px)', duration: 0.4, ease: 'power2.out' }
      ).fromTo(
        links,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
        },
        '-=0.2'
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.9) 100%)',
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 text-foreground/70 hover:text-accent transition-all duration-300 hover:scale-110 hover:rotate-90"
        aria-label="Chiudi menu"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Links */}
      <div
        ref={linksRef}
        className="flex flex-col items-center justify-center min-h-screen gap-8 px-6"
      >
        <a
          href="#metodo"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('#metodo');
          }}
          className="underwater-link text-4xl font-display font-light tracking-wider uppercase text-foreground/80 hover:text-accent transition-all duration-500 relative"
        >
          Metodo
        </a>

        <a
          href="#lettura"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('#lettura');
          }}
          className="underwater-link text-4xl font-display font-light tracking-wider uppercase text-foreground/80 hover:text-accent transition-all duration-500 relative"
        >
          Consultazione
        </a>

        <a
          href="#percorso"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('#percorso');
          }}
          className="underwater-link text-4xl font-display font-light tracking-wider uppercase text-foreground/80 hover:text-accent transition-all duration-500 relative"
        >
          Percorso
        </a>

        {/* Divider */}
        <div className="w-24 h-px bg-border my-4" />

        {/* Audio Control */}
        <button
          onClick={toggleMute}
          className="underwater-link flex items-center gap-3 text-2xl font-display font-light tracking-wider uppercase text-foreground/70 hover:text-accent transition-all duration-500"
          aria-label={isMuted ? 'Attiva musica' : 'Disattiva musica'}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          <span>Audio</span>
        </button>

        {/* Auth Buttons */}
        {!user ? (
          <Button
            variant="outline"
            size="lg"
            className="underwater-link minimal-border hover-lift mt-4"
            onClick={() => handleNavigate('/login')}
          >
            Login
          </Button>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {isAdmin && (
              <Button
                variant="outline"
                size="lg"
                className="underwater-link minimal-border hover-lift"
                onClick={() => handleNavigate('/admin')}
              >
                Admin
              </Button>
            )}
            <Button
              variant="ghost"
              size="lg"
              className="underwater-link"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Esci
            </Button>
          </div>
        )}
      </div>

      {/* Decorative Element */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
