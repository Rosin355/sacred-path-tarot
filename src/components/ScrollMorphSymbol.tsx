import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollMorphSymbol = () => {
  const symbolRef = useRef<HTMLDivElement>(null);
  const currentSymbolRef = useRef<number>(0);

  // 5 simboli astrologici (Hero esclusa)
  const symbols = ['♂', '♃', '♄', '♆', '☉'];
  
  // 5 sezioni da targetare
  const sections = [
    'method-section',
    'tarot-section',
    'journey-section',
    'about-section',
    'services-section'
  ];

  useEffect(() => {
    if (!symbolRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    // Creare ScrollTrigger per ogni sezione
    sections.forEach((sectionId, index) => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => morphToSymbol(index),
        onEnterBack: () => morphToSymbol(index),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const morphToSymbol = (index: number) => {
    if (currentSymbolRef.current === index || !symbolRef.current) return;
    
    currentSymbolRef.current = index;
    const symbolElements = symbolRef.current.querySelectorAll('.symbol-text');
    
    if (symbolElements.length > 0) {
      gsap.timeline()
        .to(symbolElements, {
          opacity: 0,
          scale: 0.5,
          rotation: 180,
          duration: 0.4,
          ease: 'power2.in',
        })
        .call(() => {
          symbolElements.forEach(el => {
            el.textContent = symbols[index];
          });
        })
        .to(symbolElements, {
          opacity: 1,
          scale: 1,
          rotation: 360,
          duration: 0.4,
          ease: 'power2.out',
        });
    }
  };

  return (
    <div
      ref={symbolRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      style={{
        filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.5)) drop-shadow(0 0 60px rgba(212, 175, 55, 0.3))',
      }}
    >
      {/* Particle effect layers */}
      <div className="absolute inset-0 opacity-50 blur-sm scale-110 animate-pulse">
        <div className="symbol-text text-8xl lg:text-9xl text-accent font-light">
          {symbols[0]}
        </div>
      </div>
      <div className="absolute inset-0 opacity-30 blur-md scale-125 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <div className="symbol-text text-8xl lg:text-9xl text-accent font-light">
          {symbols[0]}
        </div>
      </div>
      
      {/* Main symbol */}
      <div className="relative">
        <div className="symbol-text text-8xl lg:text-9xl text-accent font-light">
          {symbols[0]}
        </div>
      </div>
    </div>
  );
};

export default ScrollMorphSymbol;
