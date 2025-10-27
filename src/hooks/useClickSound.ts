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
    try {
      // Rate limiting
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
        audioContext.resume().catch(() => {});
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

      // Oscillator setup
      osc.type = 'sine';
      osc.frequency.value = 1000;

      // Very short envelope
      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(0.15, currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.08);

      // Connect
      osc.connect(gain);
      gain.connect(filter);

      // Play
      osc.start(currentTime);
      osc.stop(currentTime + 0.08);
    } catch (error) {
      console.warn('Click sound failed:', error);
    }
  }, [getAudioContext]);

  return {
    playClick,
  };
};