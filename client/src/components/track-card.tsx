import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { ProgressWaveform } from "./ui/progress-waveform";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Track } from "@shared/schema";

interface TrackCardProps {
  track: Track;
  isFeatured?: boolean;
}

export default function TrackCard({ track, isFeatured = false }: TrackCardProps) {
  const { currentTrack, isPlaying, play, pause } = useAudioPlayer();
  
  const isCurrentTrack = currentTrack === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;
  
  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play(track.id);
    }
  };
  
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${
      isCurrentTrack ? 'ring-2 ring-secondary' : ''
    }`}>
      <div className="relative h-48 bg-muted">
        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
          {track.genre.charAt(0) || 'M'}
        </div>
        <Button 
          onClick={handlePlayPause}
          size="icon"
          variant={isCurrentlyPlaying ? "secondary" : "default"}
          className={`absolute bottom-4 right-4 rounded-full shadow-md ${
            isCurrentlyPlaying 
              ? 'bg-secondary hover:bg-secondary/90' 
              : 'bg-white hover:bg-neutral-100'
          }`}
        >
          {isCurrentlyPlaying ? <Pause /> : <Play />}
        </Button>
        {isFeatured && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-white">Featured</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-semibold text-lg ${isCurrentTrack ? 'text-secondary' : ''}`}>
            {track.title}
          </h3>
          <span className={`text-sm ${isCurrentTrack ? 'text-secondary' : 'text-muted-foreground'}`}>
            {track.duration}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-muted/50 hover:bg-muted text-muted-foreground">
            {track.genre}
          </Badge>
          <Badge variant="outline" className="bg-muted/50 hover:bg-muted text-muted-foreground">
            {track.mood}
          </Badge>
          {track.bpm && (
            <Badge variant="outline" className="bg-muted/50 hover:bg-muted text-muted-foreground">
              {track.bpm} BPM
            </Badge>
          )}
        </div>
        <ProgressWaveform 
          progress={isCurrentTrack ? 75 : 0} 
          className={isCurrentTrack ? '' : 'opacity-30'}
        />
      </CardContent>
    </Card>
  );
}
