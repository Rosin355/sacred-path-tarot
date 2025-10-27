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
    const symbolElement = symbolRef.current.querySelector('.symbol-text');
    
    if (symbolElement) {
      gsap.timeline()
        .to(symbolElement, {
          opacity: 0,
          scale: 0.5,
          rotation: 180,
          duration: 0.4,
          ease: 'power2.in',
        })
        .call(() => {
          symbolElement.textContent = symbols[index];
        })
        .to(symbolElement, {
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
      className="fixed top-20 right-8 z-50 pointer-events-none"
      style={{
        filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))',
      }}
    >
      <div className="symbol-text text-6xl text-accent font-light">
        {symbols[0]}
      </div>
    </div>
  );
};

export default ScrollMorphSymbol;
