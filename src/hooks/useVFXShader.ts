import { useEffect, useRef } from 'react';
import { VFX, type VFXProps } from '@vfx-js/core';

export const useVFXShader = (shader: string) => {
  const elementRef = useRef<HTMLHeadingElement>(null);
  const vfxRef = useRef<VFX | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    try {
      vfxRef.current = new VFX();
      const options: VFXProps = {
        shader,
        overflow: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
        overlay: 1
      };
      vfxRef.current.add(elementRef.current, options);
    } catch (error) {
      console.warn('VFX-JS initialization failed:', error);
    }

    return () => {
      if (vfxRef.current && typeof vfxRef.current.destroy === 'function') {
        vfxRef.current.destroy();
      }
    };
  }, [shader]);

  return elementRef;
};
