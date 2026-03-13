import { useEffect, useRef, useState, useCallback } from 'react';
import { getAudioFileUrl } from '@/lib/audioStorage';
import { soundEffects } from '@/lib/soundEffects';

const STORAGE_KEY = 'music-muted';
const INITIAL_VOLUME = 0.12;
const FADE_IN_DURATION = 2000;

// Persistent singleton audio – stored on window to survive HMR
function getOrCreateAudio(): HTMLAudioElement | null {
  const win = window as any;
  if (win.__templeAudio) return win.__templeAudio;

  const url = getAudioFileUrl();
  if (!url) return null;

  const audio = new Audio(url);
  audio.loop = true;
  audio.volume = 0;
  win.__templeAudio = audio;
  return audio;
}

function fadeIn(audio: HTMLAudioElement) {
  const startTime = Date.now();
  const id = setInterval(() => {
    const progress = Math.min((Date.now() - startTime) / FADE_IN_DURATION, 1);
    try { audio.volume = INITIAL_VOLUME * progress; } catch {}
    if (progress >= 1) clearInterval(id);
  }, 50);
}

export const useBackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Grab / create audio on mount
  useEffect(() => {
    const audio = getOrCreateAudio();
    audioRef.current = audio;
    if (!audio) return;

    // Sync state if already playing (route change)
    if (!audio.paused) {
      setIsPlaying(true);
      audio.muted = isMuted;
      return;
    }

    // First mount – try autoplay
    audio.muted = isMuted;
    if (!isMuted) {
      audio.play()
        .then(() => { setIsPlaying(true); fadeIn(audio); })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to mute toggle
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isMuted));
    soundEffects.setMuted(isMuted);

    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;

    if (isMuted) {
      audio.pause();
      setIsPlaying(false);
    } else if (audio.paused) {
      audio.volume = 0;
      audio.play()
        .then(() => { setIsPlaying(true); fadeIn(audio); })
        .catch(() => {});
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  return { isMuted, isPlaying, toggleMute };
};
