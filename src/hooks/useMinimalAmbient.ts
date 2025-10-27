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
    let audioContext: AudioContext | null = null;
    
    try {
      // Create audio context
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Master filter (dark, cinematic low-pass)
      const masterFilter = audioContext.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.value = 800;
      masterFilter.Q.value = 0.3;
      masterFilter.connect(audioContext.destination);

      // Master gain (ultra minimal volume)
      const masterGain = audioContext.createGain();
      masterGain.gain.value = 0.08;
      masterGain.connect(masterFilter);

      // Minimal cinematic pad frequencies
      const frequencies = [88, 132, 176];

      const startAmbient = () => {
        if (!isMuted && oscillatorsRef.current.length === 0 && audioContext) {
          try {
            frequencies.forEach((freq, index) => {
              const osc = audioContext!.createOscillator();
              const gain = audioContext!.createGain();

              osc.type = index === 2 ? 'triangle' : 'sine';
              osc.frequency.value = freq;

              const targetGain = index === 0 ? 0.05 : (index === 1 ? 0.03 : 0.02);
              
              gain.gain.setValueAtTime(0, audioContext!.currentTime);
              gain.gain.linearRampToValueAtTime(targetGain, audioContext!.currentTime + 10);

              osc.connect(gain);
              gain.connect(masterGain);
              osc.start();

              oscillatorsRef.current.push(osc);
              gainsRef.current.push(gain);
            });

            setIsPlaying(true);
          } catch (error) {
            console.warn('Audio playback failed:', error);
          }
        }
      };

      const handleFirstInteraction = () => {
        try {
          if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
          }
          startAmbient();
        } catch (error) {
          console.warn('Audio interaction failed:', error);
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };

      if (!isMuted) {
        startAmbient();
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
        if (audioContext) {
          try {
            audioContext.close();
          } catch (e) {
            // Already closed
          }
        }
      };
    } catch (error) {
      console.warn('AudioContext initialization failed:', error);
      return () => {}; // No-op cleanup
    }
  }, [isMuted]);

  useEffect(() => {
    if (gainsRef.current.length > 0 && audioContextRef.current) {
      if (isMuted) {
        try {
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
        } catch (error) {
          console.warn('Audio fade out failed:', error);
        }
      }
    }
    localStorage.setItem('audio-muted', String(isMuted));
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