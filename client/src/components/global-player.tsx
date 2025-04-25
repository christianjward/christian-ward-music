import { useAudioPlayer } from "@/hooks/use-audio-player";
import { AudioPlayer } from "./ui/audio-player";
import { useQuery } from "@tanstack/react-query";
import { Track } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalPlayer() {
  const { currentTrack, isPlaying, play, pause, stopPlayback } = useAudioPlayer();
  
  const { data: trackData } = useQuery<Track>({
    queryKey: currentTrack ? ['/api/tracks', currentTrack] : [],
    enabled: !!currentTrack,
  });
  
  if (!currentTrack || !trackData) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-40">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 bg-neutral-100 rounded flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary rounded">
                {trackData.genre?.charAt(0) || 'M'}
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-base whitespace-nowrap overflow-hidden text-ellipsis">
                {trackData.title}
              </h4>
              <div className="flex items-center text-xs text-muted-foreground gap-3">
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {trackData.genre}
                </span>
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {trackData.mood}
                </span>
                {trackData.bpm && (
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {trackData.bpm} BPM
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-grow max-w-2xl">
            <AudioPlayer
              src={`/api/tracks/stream/${trackData.fileName}`}
              trackId={trackData.id}
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onEnded={stopPlayback}
            />
          </div>
          
          <div className="hidden sm:block">
            <a href="#" className="text-primary hover:text-primary/80 font-medium text-sm">
              License Track
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
