import { useCallback, useRef } from 'react';

export const useClickSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playClick = useCallback(() => {
    // Rate limiting (prevent clicks faster than 50ms)
    const now = Date.now();
    if (now - lastPlayTimeRef.current < 50) {
      return;
    }
    lastPlayTimeRef.current = now;

    // Check if audio is muted
    const isMuted = localStorage.getItem('audio-muted') === 'true';
    if (isMuted) return;

    const audioContext = getAudioContext();
    
    // Resume context if suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const currentTime = audioContext.currentTime;

    // Single oscillator for discrete "tick" sound
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    // High-pass filter for "click" character
    filter.type = 'highpass';
    filter.frequency.value = 600;
    filter.Q.value = 0.5;
    filter.connect(audioContext.destination);

    // Oscillator setup - simple sine wave
    osc.type = 'sine';
    osc.frequency.value = 1000; // 1kHz - discrete click

    // Very short envelope (80ms total)
    gain.gain.setValueAtTime(0, currentTime);
    gain.gain.linearRampToValueAtTime(0.15, currentTime + 0.005); // 5ms attack
    gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.08); // 75ms decay

    // Connect
    osc.connect(gain);
    gain.connect(filter);

    // Play
    osc.start(currentTime);
    osc.stop(currentTime + 0.08);
  }, [getAudioContext]);

  return {
    playClick,
  };
};