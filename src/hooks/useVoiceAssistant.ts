import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { extractPageContent, splitIntoChunks } from '@/lib/pageContentExtractor';

export type VoiceState = 'idle' | 'loading' | 'speaking' | 'paused' | 'error';

export interface UseVoiceAssistantReturn {
  state: VoiceState;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  readPage: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  restart: () => Promise<void>;
  errorMessage: string | null;
  audioAnalyser: AnalyserNode | null;
  progress: number; // 0-1 progress through chunks
}

export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const [state, setState] = useState<VoiceState>('idle');
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioAnalyser, setAudioAnalyser] = useState<AnalyserNode | null>(null);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const chunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);
  const abortRef = useRef(false);
  const audioUrlsRef = useRef<string[]>([]);

  // Stop on route change
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [location.pathname]);

  const cleanupAudioUrls = useCallback(() => {
    audioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    audioUrlsRef.current = [];
  }, []);

  const setupAnalyser = useCallback((audioEl: HTMLAudioElement) => {
    if (analyserRef.current) return analyserRef.current;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      
      if (!sourceRef.current) {
        sourceRef.current = ctx.createMediaElementSource(audioEl);
      }
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      sourceRef.current.connect(analyser);
      analyser.connect(ctx.destination);

      analyserRef.current = analyser;
      setAudioAnalyser(analyser);
      return analyser;
    } catch (e) {
      console.warn('Could not set up audio analyser:', e);
      return null;
    }
  }, []);

  const fetchChunkAudio = useCallback(async (
    text: string,
    chunkIndex: number,
    totalChunks: number,
    previousText?: string,
    nextText?: string
  ): Promise<Blob> => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/voice-read-page`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ text, chunkIndex, totalChunks, previousText, nextText }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(err.error || `TTS request failed: ${response.status}`);
    }

    return response.blob();
  }, []);

  const playChunk = useCallback(async (chunkIndex: number): Promise<void> => {
    if (abortRef.current) return;

    const chunks = chunksRef.current;
    if (chunkIndex >= chunks.length) {
      setState('idle');
      setProgress(1);
      cleanupAudioUrls();
      return;
    }

    currentChunkRef.current = chunkIndex;
    setProgress(chunkIndex / chunks.length);

    try {
      setState('loading');
      const blob = await fetchChunkAudio(
        chunks[chunkIndex],
        chunkIndex,
        chunks.length,
        chunkIndex > 0 ? chunks[chunkIndex - 1] : undefined,
        chunkIndex < chunks.length - 1 ? chunks[chunkIndex + 1] : undefined
      );

      if (abortRef.current) return;

      const audioUrl = URL.createObjectURL(blob);
      audioUrlsRef.current.push(audioUrl);

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.crossOrigin = 'anonymous';
      }

      const audio = audioRef.current;
      audio.src = audioUrl;

      setupAnalyser(audio);

      // Resume AudioContext if suspended
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      setState('speaking');

      await new Promise<void>((resolve, reject) => {
        const onEnded = () => {
          cleanup();
          resolve();
        };
        const onError = (e: Event) => {
          cleanup();
          reject(new Error('Audio playback error'));
        };
        const cleanup = () => {
          audio.removeEventListener('ended', onEnded);
          audio.removeEventListener('error', onError);
        };
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);
        audio.play().catch(reject);
      });

      if (!abortRef.current) {
        await playChunk(chunkIndex + 1);
      }
    } catch (error) {
      if (!abortRef.current) {
        console.error('Voice playback error:', error);
        setState('error');
        setErrorMessage(error instanceof Error ? error.message : 'Errore nella riproduzione vocale');
      }
    }
  }, [fetchChunkAudio, setupAnalyser, cleanupAudioUrls]);

  const stopPlayback = useCallback(() => {
    abortRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    cleanupAudioUrls();
    setState('idle');
    setProgress(0);
    setErrorMessage(null);
  }, [cleanupAudioUrls]);

  const readPage = useCallback(async () => {
    abortRef.current = false;
    setErrorMessage(null);

    const content = extractPageContent();
    if (!content || content.length < 10) {
      setErrorMessage('Non ho trovato contenuto leggibile in questa pagina.');
      setState('error');
      return;
    }

    const chunks = splitIntoChunks(content);
    chunksRef.current = chunks;
    currentChunkRef.current = 0;

    await playChunk(0);
  }, [playChunk]);

  const pause = useCallback(() => {
    if (audioRef.current && state === 'speaking') {
      audioRef.current.pause();
      setState('paused');
    }
  }, [state]);

  const resume = useCallback(() => {
    if (audioRef.current && state === 'paused') {
      audioRef.current.play();
      setState('speaking');
    }
  }, [state]);

  const stop = useCallback(() => {
    stopPlayback();
  }, [stopPlayback]);

  const restart = useCallback(async () => {
    stopPlayback();
    abortRef.current = false;
    // Small delay to let state settle
    await new Promise(r => setTimeout(r, 100));
    await readPage();
  }, [stopPlayback, readPage]);

  return {
    state,
    isOpen,
    setIsOpen,
    readPage,
    pause,
    resume,
    stop,
    restart,
    errorMessage,
    audioAnalyser,
    progress,
  };
}
