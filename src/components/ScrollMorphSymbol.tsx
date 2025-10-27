import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InteractiveParticles } from '@/components/ui/InteractiveParticles';

gsap.registerPlugin(ScrollTrigger);

const ScrollMorphSymbol = () => {
  const symbolRef = useRef<HTMLDivElement>(null);
  const currentSymbolRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);

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

    // ScrollTrigger per controllare visibilità
    ScrollTrigger.create({
      trigger: '#method-section',
      start: 'top bottom',
      end: 'bottom top',
      onEnter: () => setIsVisible(true),
      onLeave: () => setIsVisible(false),
      onEnterBack: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
    });

    // Creare ScrollTrigger per ogni sezione per il morph
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
          scale: 0.3,
          rotation: 180,
          duration: 0.5,
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
          duration: 0.5,
          ease: 'power2.out',
        });
    }
  };

  return (
    <>
      {/* Interactive Particles Layer */}
      <InteractiveParticles 
        currentSymbol={symbols[currentSymbolRef.current]} 
        isVisible={isVisible} 
      />
      
      {/* Original Blur/Pulse Layers */}
      <div
        ref={symbolRef}
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          filter: 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.6)) drop-shadow(0 0 80px rgba(212, 175, 55, 0.4))',
        }}
      >
        {/* Particle effect layers - 6 layers per effetto più intenso */}
        
        {/* Layer 1: Particella più lontana e grande */}
        <div className="absolute inset-0 opacity-10 blur-2xl scale-[2.5] animate-pulse" style={{ animationDuration: '4s' }}>
          <div className="symbol-text text-[12rem] lg:text-[16rem] text-accent font-light">
            {symbols[0]}
          </div>
        </div>
        
        {/* Layer 2: Particella grande con blur forte */}
        <div className="absolute inset-0 opacity-15 blur-xl scale-[2] animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
          <div className="symbol-text text-[12rem] lg:text-[16rem] text-accent font-light">
            {symbols[0]}
          </div>
        </div>
        
        {/* Layer 3: Particella media */}
        <div className="absolute inset-0 opacity-20 blur-lg scale-[1.6] animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}>
          <div className="symbol-text text-[12rem] lg:text-[16rem] text-accent font-light">
            {symbols[0]}
          </div>
        </div>
        
        {/* Layer 4: Particella piccola */}
        <div className="absolute inset-0 opacity-25 blur-md scale-[1.3] animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1.5s' }}>
          <div className="symbol-text text-[12rem] lg:text-[16rem] text-accent font-light">
            {symbols[0]}
          </div>
        </div>
        
        {/* Layer 5: Particella molto vicina */}
        <div className="absolute inset-0 opacity-30 blur-sm scale-110 animate-pulse" style={{ animationDuration: '2s', animationDelay: '2s' }}>
          <div className="symbol-text text-[12rem] lg:text-[16rem] text-accent font-light">
            {symbols[0]}
          </div>
        </div>
        
        {/* Main symbol - Simbolo principale con opacità ridotta */}
        <div className="relative opacity-20">
          <div className="symbol-text text-[12rem] lg:text-[16rem] text-accent font-light">
            {symbols[0]}
          </div>
        </div>
      </div>
    </>
  );
};

export default ScrollMorphSymbol;
