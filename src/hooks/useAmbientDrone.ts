import { useEffect, useRef, useState } from 'react';

export const useAmbientDrone = () => {
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

    // Master filter (warm, deep ambient)
    const masterFilter = audioContext.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.value = 2000;
    masterFilter.Q.value = 0.7;
    masterFilter.connect(audioContext.destination);

    // Master gain
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.3; // 30% volume for ambient background
    masterGain.connect(masterFilter);

    // Create 432 Hz based drone (healing frequency)
    const frequencies = [
      432 * 0.5,   // Sub bass (216 Hz)
      432,         // Fundamental (432 Hz)
      432 * 1.5,   // Fifth (648 Hz)
      432 * 2,     // Octave (864 Hz)
    ];

    const startDrone = () => {
      if (!isMuted && oscillatorsRef.current.length === 0) {
        frequencies.forEach((freq, index) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          const lfo = audioContext.createOscillator();
          const lfoGain = audioContext.createGain();

          // Oscillator setup
          osc.type = index === 0 ? 'sine' : 'triangle';
          osc.frequency.value = freq;

          // LFO for subtle modulation
          lfo.type = 'sine';
          lfo.frequency.value = 0.1 + (index * 0.05); // Slow modulation
          lfoGain.gain.value = index === 0 ? 2 : 5; // Subtle frequency modulation
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);

          // Gain envelope - very slow fade in
          gain.gain.setValueAtTime(0, audioContext.currentTime);
          gain.gain.linearRampToValueAtTime(
            index === 0 ? 0.15 : (index === 1 ? 0.25 : 0.1),
            audioContext.currentTime + 8
          ); // 8 second fade in

          // Connect
          osc.connect(gain);
          gain.connect(masterGain);

          // Start
          osc.start();
          lfo.start();

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
      startDrone();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    if (!isMuted) {
      startDrone();
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
          gain.gain.linearRampToValueAtTime(0, audioContextRef.current!.currentTime + 0.5);
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
        }, 500);
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
