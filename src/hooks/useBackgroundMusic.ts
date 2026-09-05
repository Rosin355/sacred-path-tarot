import { useContext } from "react";
import { BackgroundMusicContext } from "@/contexts/background-music-context";

export const useBackgroundMusic = () => {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error("useBackgroundMusic deve essere usato dentro BackgroundMusicProvider");
  }
  return context;
};
