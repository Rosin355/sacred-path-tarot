import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { BackgroundMusicContext } from "@/contexts/background-music-context";
import { getAudioFileUrl } from "@/lib/audioStorage";
import { soundEffects } from "@/lib/soundEffects";

const STORAGE_KEY = "music-muted";
const TARGET_VOLUME = 0.12;
const FADE_DURATION = 2000;

const readMutedPreference = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const BackgroundMusicProvider = ({ children }: PropsWithChildren) => {
  const [isMuted, setIsMuted] = useState(readMutedPreference);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);

  const stopFade = useCallback(() => {
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const fadeIn = useCallback((audio: HTMLAudioElement) => {
    stopFade();
    const startedAt = performance.now();
    audio.volume = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - startedAt) / FADE_DURATION, 1);
      audio.volume = TARGET_VOLUME * progress;
      if (progress < 1) fadeFrameRef.current = window.requestAnimationFrame(tick);
      else fadeFrameRef.current = null;
    };

    fadeFrameRef.current = window.requestAnimationFrame(tick);
  }, [stopFade]);

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || isMuted) return false;
    if (!audio.paused) {
      setIsPlaying(true);
      return true;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      fadeIn(audio);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, [fadeIn, isMuted]);

  useEffect(() => {
    const url = getAudioFileUrl();
    if (!url) return;

    const audio = new Audio(url);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audio.muted = isMuted;
    audioRef.current = audio;

    const onReady = () => setIsReady(true);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsReady(false);
      setIsPlaying(false);
    };

    audio.addEventListener("canplay", onReady);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) setIsReady(true);

    return () => {
      stopFade();
      audio.pause();
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
    // L'elemento audio nasce una sola volta e sopravvive a tutti i cambi rotta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopFade]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(isMuted));
    } catch {
      // Il sito resta operativo anche quando lo storage è bloccato.
    }
    soundEffects.setMuted(isMuted);

    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
    if (isMuted) {
      stopFade();
      audio.pause();
    }
  }, [isMuted, stopFade]);

  useEffect(() => {
    if (isMuted || isPlaying) return;

    const activate = () => {
      void startPlayback().then((started) => {
        if (started) removeListeners();
      });
    };
    const removeListeners = () => {
      window.removeEventListener("pointerdown", activate, true);
      window.removeEventListener("keydown", activate, true);
      window.removeEventListener("touchend", activate, true);
    };

    window.addEventListener("pointerdown", activate, true);
    window.addEventListener("keydown", activate, true);
    window.addEventListener("touchend", activate, true);
    return removeListeners;
  }, [isMuted, isPlaying, startPlayback]);

  const toggleMute = useCallback(() => {
    const nextMuted = isPlaying && !isMuted;
    const audio = audioRef.current;
    setIsMuted(nextMuted);

    if (!audio) return;
    audio.muted = nextMuted;
    if (!nextMuted && audio.paused) {
      void audio.play()
        .then(() => {
          setIsPlaying(true);
          fadeIn(audio);
        })
        .catch(() => setIsPlaying(false));
    }
  }, [fadeIn, isMuted, isPlaying]);

  return (
    <BackgroundMusicContext.Provider value={{ isMuted, isPlaying, isReady, toggleMute }}>
      {children}
    </BackgroundMusicContext.Provider>
  );
};
