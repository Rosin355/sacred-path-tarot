import { useEffect, useRef, useState } from 'react';
import { getAudioFileUrl } from '@/lib/audioStorage';

const STORAGE_KEY = 'music-muted';
const INITIAL_VOLUME = 0.12; // 12% volume like richardmattka.com
const FADE_IN_DURATION = 2000; // 2 seconds fade-in

export const useBackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0; // Start at 0 for fade-in
    
    // Get audio from Supabase Storage
    const audioUrl = getAudioFileUrl();
    if (!audioUrl) {
      console.log('No audio file available yet');
      return;
    }
    
    audio.src = audioUrl;
    audioRef.current = audio;

    // Fade in function
    const fadeIn = () => {
      const startTime = Date.now();
      const fadeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / FADE_IN_DURATION, 1);
        audio.volume = INITIAL_VOLUME * progress;
        
        if (progress >= 1) {
          clearInterval(fadeInterval);
        }
      }, 50);
    };

    // Auto-play with fade-in if not muted
    if (!isMuted) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          fadeIn();
        })
        .catch((error) => {
          console.log('Autoplay blocked:', error);
          // Autoplay was blocked, wait for user interaction
        });
    }

    // Cleanup
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle mute state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isMuted));
    
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            // Fade in when unmuting
            const startTime = Date.now();
            const fadeInterval = setInterval(() => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / FADE_IN_DURATION, 1);
              if (audioRef.current) {
                audioRef.current.volume = INITIAL_VOLUME * progress;
              }
              
              if (progress >= 1) {
                clearInterval(fadeInterval);
              }
            }, 50);
          })
          .catch((error) => {
            console.log('Play failed:', error);
          });
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return {
    isMuted,
    isPlaying,
    toggleMute,
  };
};
