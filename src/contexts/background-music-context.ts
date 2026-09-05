import { createContext } from "react";

export type BackgroundMusicState = {
  isMuted: boolean;
  isPlaying: boolean;
  isReady: boolean;
  toggleMute: () => void;
};

export const BackgroundMusicContext = createContext<BackgroundMusicState | null>(null);
