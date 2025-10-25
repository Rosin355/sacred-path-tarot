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

  const playNote = useCallback((note: NoteName, duration: number = 1.2) => {
    // Check if audio is muted
    const isMuted = localStorage.getItem('audio-muted') === 'true';
    if (isMuted) return;

    // Throttle to avoid audio spam (minimum 80ms between sounds)
    const now = Date.now();
    if (now - lastPlayTimeRef.current < 80) return;
    lastPlayTimeRef.current = now;

    try {
      const audioContext = getAudioContext();
      
      // Main oscillator (fundamental frequency) - Hand Pan body
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = NOTES[note];
      oscillator.type = 'triangle'; // Warm, organic hand pan tone

      // Harmonic oscillator (octave overtone) - Hand Pan shimmer
      const harmonicOsc = audioContext.createOscillator();
      const harmonicGain = audioContext.createGain();

      harmonicOsc.connect(harmonicGain);
      harmonicGain.connect(audioContext.destination);

      harmonicOsc.frequency.value = NOTES[note] * 2; // Octave higher
      harmonicOsc.type = 'sine'; // Pure harmonic

      // Hand Pan envelope: quick attack, sustain, long resonant decay
      const now = audioContext.currentTime;
      
      // Main oscillator envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.25, now + 0.005); // 5ms percussive attack
      gainNode.gain.linearRampToValueAtTime(0.10, now + 0.15); // Sustain level
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Long resonant decay

      // Harmonic oscillator envelope (softer, adds shimmer)
      harmonicGain.gain.setValueAtTime(0, now);
      harmonicGain.gain.linearRampToValueAtTime(0.02, now + 0.005);
      harmonicGain.gain.linearRampToValueAtTime(0.008, now + 0.15);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
      harmonicOsc.start(now);
      harmonicOsc.stop(now + duration);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, [getAudioContext]);

  const playArpeggio = useCallback((notes: NoteName[], interval: number = 0.1) => {
    notes.forEach((note, index) => {
      setTimeout(() => playNote(note, 1.5), index * interval * 1000);
    });
  }, [playNote]);

  return {
    playNote,
    playArpeggio,
  };
};
