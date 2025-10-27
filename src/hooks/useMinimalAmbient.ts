import { useEffect, useRef, useState } from 'react';

export const useMinimalAmbient = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainsRef = useRef<GainNode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('audio-muted') === 'true';
  });

  useEffect(() => {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    // Master filter (dark, cinematic low-pass)
    const masterFilter = audioContext.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.value = 800; // Very dark
    masterFilter.Q.value = 0.3;
    masterFilter.connect(audioContext.destination);

    // Master gain (ultra minimal volume)
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.08; // 8% volume - barely perceptible
    masterGain.connect(masterFilter);

    // Minimal cinematic pad frequencies
    const frequencies = [
      88,   // Low bass (A1)
      132,  // Mid bass (C2)
      176,  // Upper bass (F2)
    ];

    const startAmbient = () => {
      if (!isMuted && oscillatorsRef.current.length === 0) {
        frequencies.forEach((freq, index) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();

          // Simple sine/triangle waves
          osc.type = index === 2 ? 'triangle' : 'sine';
          osc.frequency.value = freq;

          // Individual gains
          const targetGain = index === 0 ? 0.05 : (index === 1 ? 0.03 : 0.02);
          
          // Very slow fade in (10 seconds)
          gain.gain.setValueAtTime(0, audioContext.currentTime);
          gain.gain.linearRampToValueAtTime(targetGain, audioContext.currentTime + 10);

          // Connect
          osc.connect(gain);
          gain.connect(masterGain);

          // Start
          osc.start();

          oscillatorsRef.current.push(osc);
          gainsRef.current.push(gain);
        });

        setIsPlaying(true);
      }
    };

    // Try to start on mount
    const handleFirstInteraction = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      startAmbient();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    if (!isMuted) {
      startAmbient();
      // Fallback for autoplay blocked
      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      oscillatorsRef.current = [];
      gainsRef.current = [];
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (gainsRef.current.length > 0) {
      if (isMuted) {
        // Fade out
        gainsRef.current.forEach(gain => {
          gain.gain.linearRampToValueAtTime(0, audioContextRef.current!.currentTime + 1);
        });
        setTimeout(() => {
          oscillatorsRef.current.forEach(osc => {
            try {
              osc.stop();
            } catch (e) {
              // Already stopped
            }
          });
          oscillatorsRef.current = [];
          gainsRef.current = [];
          setIsPlaying(false);
        }, 1000);
      }
      localStorage.setItem('audio-muted', String(isMuted));
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return {
    isPlaying,
    isMuted,
    toggleMute,
  };
};