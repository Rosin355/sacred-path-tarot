import { useEffect, useRef, useState, useCallback } from 'react';
import { getAudioFileUrl } from '@/lib/audioStorage';
import { soundEffects } from '@/lib/soundEffects';

const STORAGE_KEY = 'music-muted';
const INITIAL_VOLUME = 0.12;
const FADE_IN_DURATION = 2000;

// ── Persistent singleton ──
// The audio element lives outside React so it survives route changes.
let globalAudio: HTMLAudioElement | null = null;
let globalInitialised = false;

function getOrCreateAudio(): HTMLAudioElement | null {
  if (globalAudio) return globalAudio;

  const url = getAudioFileUrl();
  if (!url) return null;

  const audio = new Audio(url);
  audio.loop = true;
  audio.volume = 0;
  globalAudio = audio;
  return audio;
}

function fadeIn(audio: HTMLAudioElement) {
  const startTime = Date.now();
  const id = setInterval(() => {
    const progress = Math.min((Date.now() - startTime) / FADE_IN_DURATION, 1);
    audio.volume = INITIAL_VOLUME * progress;
    if (progress >= 1) clearInterval(id);
  }, 50);
}

export const useBackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');
  const [isPlaying, setIsPlaying] = useState(false);
  const mountedRef = useRef(true);

  // On first mount anywhere in the app, start playback once
  useEffect(() => {
    mountedRef.current = true;
    const audio = getOrCreateAudio();
    if (!audio) return;

    audio.muted = isMuted;

    // Sync UI state if audio is already playing (route change)
    if (!audio.paused) {
      setIsPlaying(true);
      return; // already playing – nothing to do
    }

    if (!isMuted && !globalInitialised) {
      globalInitialised = true;
      audio.play()
        .then(() => {
          if (mountedRef.current) setIsPlaying(true);
          fadeIn(audio);
        })
        .catch(() => {
          // autoplay blocked – will start on first user interaction
        });
    }

    return () => { mountedRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to mute toggle
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isMuted));
    soundEffects.setMuted(isMuted);

    const audio = globalAudio;
    if (!audio) return;

    audio.muted = isMuted;

    if (isMuted) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.volume = 0;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          fadeIn(audio);
        })
        .catch(() => {});
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  return { isMuted, isPlaying, toggleMute };
};
