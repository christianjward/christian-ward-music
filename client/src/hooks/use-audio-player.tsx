import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface AudioPlayerContextType {
  currentTrack: number | null;
  isPlaying: boolean;
  play: (trackId: number) => void;
  pause: () => void;
  stopPlayback: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Play track
  const play = (trackId: number) => {
    setCurrentTrack(trackId);
    setIsPlaying(true);
  };

  // Pause track
  const pause = () => {
    setIsPlaying(false);
  };

  // Stop playback
  const stopPlayback = () => {
    setIsPlaying(false);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        play,
        pause,
        stopPlayback,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  
  return context;
}
