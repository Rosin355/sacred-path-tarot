import { useEffect, useRef, useState } from 'react';

interface EyeTrackingOptions {
  disabled?: boolean;
  socketOffset?: number;
  hoverBoost?: number;
}

interface EyeTrackingState {
  left: { x: number; y: number };
  right: { x: number; y: number };
  isHovering: boolean;
  isBlinking: boolean;
}

const lerp = (start: number, end: number, amount: number) => start + (end - start) * amount;

export function useOrbEyeTracking<T extends HTMLElement>({
  disabled = false,
  socketOffset = 3.2,
  hoverBoost = 1.18,
}: EyeTrackingOptions = {}) {
  const orbRef = useRef<T | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [state, setState] = useState<EyeTrackingState>({
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
    isHovering: false,
    isBlinking: false,
  });

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    let frame = 0;
    let blinkTimeout = 0;
    let blinkResetTimeout = 0;

    const scheduleBlink = () => {
      const delay = 2800 + Math.random() * 3400;
      blinkTimeout = window.setTimeout(() => {
        setState(prev => ({ ...prev, isBlinking: true }));
        blinkResetTimeout = window.setTimeout(() => {
          setState(prev => ({ ...prev, isBlinking: false }));
          scheduleBlink();
        }, 170);
      }, delay);
    };

    const updateTarget = () => {
      const node = orbRef.current;
      if (!node) {
        targetRef.current = { x: 0, y: 0 };
        return;
      }

      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      if (!pointerRef.current.active) {
        targetRef.current = { x: 0, y: 0 };
        return;
      }

      const dx = pointerRef.current.x - centerX;
      const dy = pointerRef.current.y - centerY;
      const distance = Math.hypot(dx, dy) || 1;
      const maxDistance = socketOffset * (state.isHovering ? hoverBoost : 1);
      const normalized = Math.min(distance / 140, 1);
      const strength = maxDistance * normalized;

      targetRef.current = {
        x: (dx / distance) * strength,
        y: (dy / distance) * strength * 0.8,
      };
    };

    const animate = () => {
      updateTarget();
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.11);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.09);

      setState(prev => ({
        ...prev,
        left: { x: currentRef.current.x, y: currentRef.current.y },
        right: { x: currentRef.current.x, y: currentRef.current.y },
      }));

      frame = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
    };

    const onPointerLeaveWindow = () => {
      pointerRef.current.active = false;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        pointerRef.current.active = false;
      }
    };

    scheduleBlink();
    frame = window.requestAnimationFrame(animate);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeaveWindow);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(blinkTimeout);
      window.clearTimeout(blinkResetTimeout);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeaveWindow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [disabled, hoverBoost, socketOffset, state.isHovering]);

  const setHovering = (isHovering: boolean) => {
    setState(prev => ({ ...prev, isHovering }));
    if (!isHovering) {
      pointerRef.current.active = false;
    }
  };

  const reactToTap = () => {
    if (disabled) return;
    setState(prev => ({
      ...prev,
      isBlinking: true,
      left: { x: 0, y: 1.5 },
      right: { x: 0, y: 1.5 },
    }));

    window.setTimeout(() => {
      setState(prev => ({ ...prev, isBlinking: false }));
    }, 150);
  };

  return {
    orbRef,
    eyeState: state,
    setHovering,
    reactToTap,
  };
}
