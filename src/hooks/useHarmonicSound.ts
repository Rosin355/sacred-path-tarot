import { useCallback, useRef } from 'react';

// D Major scale frequencies (Re maggiore)
const NOTES = {
  D: 293.66,      // Re
  E: 329.63,      // Mi
  'F#': 369.99,   // Fa#
  G: 392.00,      // Sol
  A: 440.00,      // La
  B: 493.88,      // Si
  'C#': 554.37,   // Do#
  'D-high': 587.33, // Re (ottava alta)
};

export type NoteName = keyof typeof NOTES;

export const useHarmonicSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback((note: NoteName, duration: number = 1.8) => {
    const isMuted = localStorage.getItem('audio-muted') === 'true';
    if (isMuted) return;

    const now = Date.now();
    if (now - lastPlayTimeRef.current < 80) return;
    lastPlayTimeRef.current = now;

    try {
      const audioContext = getAudioContext();
      const baseFreq = NOTES[note];
      const currentTime = audioContext.currentTime;

      // Master low-pass filter (warm, natural tone)
      const masterFilter = audioContext.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.value = 2400;
      masterFilter.Q.value = 1.0;
      masterFilter.connect(audioContext.destination);

      // Master gain (increased for more prominent sound)
      const masterGain = audioContext.createGain();
      masterGain.connect(masterFilter);

      // Envelope: soft attack, sustained, long decay (louder)
      masterGain.gain.setValueAtTime(0, currentTime);
      masterGain.gain.linearRampToValueAtTime(0.25, currentTime + 0.015);
      masterGain.gain.linearRampToValueAtTime(0.15, currentTime + 0.4);
      masterGain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration);

      // Fundamental (triangle wave for warmth) - increased
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.frequency.value = baseFreq;
      osc1.type = 'triangle';
      gain1.gain.value = 0.7;
      osc1.connect(gain1);
      gain1.connect(masterGain);

      // Fifth harmonic (characteristic Hand Pan) - increased
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.frequency.value = baseFreq * 1.498;
      osc2.type = 'sine';
      gain2.gain.value = 0.3;
      osc2.connect(gain2);
      gain2.connect(masterGain);

      // Major third - increased
      const osc3 = audioContext.createOscillator();
      const gain3 = audioContext.createGain();
      osc3.frequency.value = baseFreq * 1.26;
      osc3.type = 'sine';
      gain3.gain.value = 0.18;
      osc3.connect(gain3);
      gain3.connect(masterGain);

      // Octave - increased
      const osc4 = audioContext.createOscillator();
      const gain4 = audioContext.createGain();
      osc4.frequency.value = baseFreq * 2.0;
      osc4.type = 'sine';
      gain4.gain.value = 0.25;
      osc4.connect(gain4);
      gain4.connect(masterGain);

      // Upper harmonic (shimmer) - increased
      const osc5 = audioContext.createOscillator();
      const gain5 = audioContext.createGain();
      osc5.frequency.value = baseFreq * 3.01;
      osc5.type = 'sine';
      gain5.gain.value = 0.1;
      osc5.connect(gain5);
      gain5.connect(masterGain);

      // Start all oscillators
      [osc1, osc2, osc3, osc4, osc5].forEach(osc => {
        osc.start(currentTime);
        osc.stop(currentTime + duration);
      });

    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, [getAudioContext]);

  const playArpeggio = useCallback((notes: NoteName[], interval: number = 0.18) => {
    notes.forEach((note, index) => {
      setTimeout(() => playNote(note, 2.0), index * interval * 1000);
    });
  }, [playNote]);

  return {
    playNote,
    playArpeggio,
  };
};
