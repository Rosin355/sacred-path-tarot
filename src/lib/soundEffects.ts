import * as Tone from 'tone';

class SoundEffects {
  private static instance: SoundEffects;
  private synth: Tone.PolySynth;
  private isInitialized = false;
  private volume: Tone.Volume;

  private constructor() {
    this.volume = new Tone.Volume(-12).toDestination();
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.02,
        decay: 0.3,
        sustain: 0.3,
        release: 0.8,
      },
    }).connect(this.volume);
  }

  static getInstance(): SoundEffects {
    if (!SoundEffects.instance) {
      SoundEffects.instance = new SoundEffects();
    }
    return SoundEffects.instance;
  }

  async init() {
    if (!this.isInitialized) {
      await Tone.start();
      this.isInitialized = true;
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  // Click carte: D, E, F#
  async playCardClick() {
    await this.ensureInitialized();
    const now = Tone.now();
    this.synth.triggerAttackRelease('D4', '0.15', now);
    this.synth.triggerAttackRelease('E4', '0.15', now + 0.05);
    this.synth.triggerAttackRelease('F#4', '0.15', now + 0.1);
  }

  // "Rivela Saggezza": arpeggio G-A-C#
  async playRevealWisdom() {
    await this.ensureInitialized();
    const now = Tone.now();
    this.synth.triggerAttackRelease('G4', '0.3', now);
    this.synth.triggerAttackRelease('A4', '0.3', now + 0.15);
    this.synth.triggerAttackRelease('C#5', '0.4', now + 0.3);
  }

  // "Nuova Consultazione": D ottava alta
  async playNewConsultation() {
    await this.ensureInitialized();
    this.synth.triggerAttackRelease('D5', '0.4');
  }

  // Navigazione/CTA: nota A
  async playNavigation() {
    await this.ensureInitialized();
    this.synth.triggerAttackRelease('A4', '0.2');
  }

  // Stella rituale: tintinnio delicato e verticale
  async playStarInvocation() {
    await this.ensureInitialized();
    const now = Tone.now();
    this.synth.triggerAttackRelease('E5', '0.12', now, 0.5);
    this.synth.triggerAttackRelease('B5', '0.18', now + 0.04, 0.4);
    this.synth.triggerAttackRelease('F#6', '0.24', now + 0.1, 0.26);
  }

  // Apertura capsule: soglia morbida e contemplativa
  async playCapsuleOpen() {
    await this.ensureInitialized();
    const now = Tone.now();
    this.synth.triggerAttackRelease('A4', '0.18', now, 0.34);
    this.synth.triggerAttackRelease('C#5', '0.26', now + 0.06, 0.3);
    this.synth.triggerAttackRelease('E5', '0.34', now + 0.14, 0.24);
  }

  // Chiusura capsule: dissolvenza breve verso il silenzio
  async playCapsuleClose() {
    await this.ensureInitialized();
    const now = Tone.now();
    this.synth.triggerAttackRelease('E5', '0.12', now, 0.18);
    this.synth.triggerAttackRelease('C#5', '0.16', now + 0.05, 0.14);
    this.synth.triggerAttackRelease('A4', '0.2', now + 0.1, 0.1);
  }

  setMuted(muted: boolean) {
    this.volume.mute = muted;
  }
}

export const soundEffects = SoundEffects.getInstance();
