import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { ProgressWaveform } from "./progress-waveform";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export interface AudioPlayerProps {
  src: string;
  trackId: number;
  isPlaying: boolean;
  onPlay: (trackId: number) => void;
  onPause: () => void;
  onEnded: () => void;
  className?: string;
  compact?: boolean;
}

export function AudioPlayer({
  src,
  trackId,
  isPlaying,
  onPlay,
  onPause,
  onEnded,
  className,
  compact = false,
}: AudioPlayerProps) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      onEnded();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        onPause();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, onPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (value[0] / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const togglePlay = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay(trackId);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={cn("flex flex-col", className)}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {!compact && (
        <ProgressWaveform
          progress={progressPercent}
          className="mb-2 h-2"
          onClick={(percent) => {
            const audio = audioRef.current;
            if (!audio) return;
            
            const seekTime = (percent / 100) * duration;
            audio.currentTime = seekTime;
            setCurrentTime(seekTime);
          }}
        />
      )}

      <div className="flex items-center gap-3">
        <Button
          variant={isPlaying ? "secondary" : "outline"}
          size="icon"
          className={cn(
            "rounded-full",
            isPlaying ? "bg-secondary text-white hover:bg-secondary/90" : ""
          )}
          onClick={togglePlay}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>

        {!compact && (
          <>
            <div className="flex items-center gap-2 flex-grow">
              <span className="text-xs text-muted-foreground font-medium">
                {formatTime(currentTime)}
              </span>

              <Slider
                value={[progressPercent]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-grow"
              />

              <span className="text-xs text-muted-foreground font-medium">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2 w-32">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>

              <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-grow"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
