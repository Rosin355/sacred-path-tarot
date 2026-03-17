import { useEffect, useState } from 'react';
import { soundEffects } from '@/lib/soundEffects';

export const useSoundEffects = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      try {
        await soundEffects.init();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize sound effects:', error);
      }
    };

    // Initialize on first user interaction
    const handleInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Sync mute state from localStorage
  useEffect(() => {
    const muteState = localStorage.getItem('music-muted');
    const isMuted = muteState === 'true';
    soundEffects.setMuted(isMuted);

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'music-muted') {
        soundEffects.setMuted(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    playCardClick: () => soundEffects.playCardClick(),
    playRevealWisdom: () => soundEffects.playRevealWisdom(),
    playNewConsultation: () => soundEffects.playNewConsultation(),
    playNavigation: () => soundEffects.playNavigation(),
    playStarInvocation: () => soundEffects.playStarInvocation(),
    playCapsuleOpen: () => soundEffects.playCapsuleOpen(),
    playCapsuleClose: () => soundEffects.playCapsuleClose(),
    isInitialized,
  };
};
