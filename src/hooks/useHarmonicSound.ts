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

// Hand Pan modal frequencies (based on physical vibration modes)
// Each mode has: frequency ratio, amplitude, and bandwidth (Hz)
const HANDPAN_MODES = [
  { ratio: 1.0, amplitude: 1.0, bandwidth: 0.8 },      // Fundamental
  { ratio: 1.498, amplitude: 0.25, bandwidth: 1.5 },   // Perfect fifth
  { ratio: 1.26, amplitude: 0.15, bandwidth: 2.0 },    // Major third
  { ratio: 2.0, amplitude: 0.3, bandwidth: 1.2 },      // Octave
  { ratio: 2.76, amplitude: 0.08, bandwidth: 2.5 },    // Upper mode
  { ratio: 3.01, amplitude: 0.05, bandwidth: 3.0 },    // Metallic shimmer
];

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

  // Create impulse excitation (simulates hand strike on metal)
  const createImpulse = useCallback((audioContext: AudioContext) => {
    const impulseLength = 0.01; // 10ms impulse
    const sampleRate = audioContext.sampleRate;
    const bufferSize = Math.floor(sampleRate * impulseLength);
    const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Decaying white noise burst (simulates physical impact)
    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.exp(-i / (bufferSize * 0.3));
      data[i] = (Math.random() * 2 - 1) * decay * 0.08;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    return source;
  }, []);

  // Create IIR resonator for modal synthesis
  const createResonator = useCallback((
    audioContext: AudioContext,
    frequency: number,
    bandwidth: number,
    amplitude: number
  ) => {
    const sampleRate = audioContext.sampleRate;
    const r = Math.exp(-Math.PI * bandwidth / sampleRate);
    
    // IIR filter coefficients for resonator (from paper)
    const feedforward = [amplitude * (1 - r * r), 0, 0];
    const feedback = [
      1,
      -2 * r * Math.cos(2 * Math.PI * frequency / sampleRate),
      r * r
    ];

    return audioContext.createIIRFilter(feedforward, feedback);
  }, []);

  const playNote = useCallback((note: NoteName, duration: number = 1.5) => {
    // Check if audio is muted
    const isMuted = localStorage.getItem('audio-muted') === 'true';
    if (isMuted) return;

    // Throttle to avoid audio spam (minimum 80ms between sounds)
    const now = Date.now();
    if (now - lastPlayTimeRef.current < 80) return;
    lastPlayTimeRef.current = now;

    try {
      const audioContext = getAudioContext();
      const baseFreq = NOTES[note];
      const currentTime = audioContext.currentTime;

      // Master output chain
      const masterGain = audioContext.createGain();
      const masterFilter = audioContext.createBiquadFilter();
      
      masterFilter.type = 'lowpass';
      masterFilter.frequency.value = 2200; // Warm, natural tone
      masterFilter.Q.value = 1.2;
      
      masterFilter.connect(audioContext.destination);
      masterGain.connect(masterFilter);

      // ADSR Envelope (softer than additive synthesis)
      masterGain.gain.setValueAtTime(0, currentTime);
      masterGain.gain.linearRampToValueAtTime(0.10, currentTime + 0.012); // 12ms attack
      masterGain.gain.linearRampToValueAtTime(0.05, currentTime + 0.3); // 300ms sustain
      masterGain.gain.exponentialRampToValueAtTime(0.001, currentTime + duration); // Natural decay

      // Create impulse excitation
      const impulse = createImpulse(audioContext);
      
      // Create resonators for each vibrational mode
      const resonators: IIRFilterNode[] = [];
      HANDPAN_MODES.forEach((mode) => {
        const resonator = createResonator(
          audioContext,
          baseFreq * mode.ratio,
          mode.bandwidth,
          mode.amplitude
        );
        
        impulse.connect(resonator);
        resonator.connect(masterGain);
        resonators.push(resonator);
      });

      // Trigger impulse
      impulse.start(currentTime);
      impulse.stop(currentTime + 0.01); // 10ms impulse duration

      // Cleanup after sound finishes
      setTimeout(() => {
        try {
          impulse.disconnect();
          resonators.forEach(r => r.disconnect());
          masterGain.disconnect();
          masterFilter.disconnect();
        } catch (e) {
          // Ignore cleanup errors
        }
      }, duration * 1000 + 100);

    } catch (error) {
      console.error('Error playing note:', error);
    }
  }, [getAudioContext, createImpulse, createResonator]);

  const playArpeggio = useCallback((notes: NoteName[], interval: number = 0.15) => {
    notes.forEach((note, index) => {
      setTimeout(() => playNote(note, 1.5), index * interval * 1000);
    });
  }, [playNote]);

  return {
    playNote,
    playArpeggio,
  };
};
