import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Track, Genre, Mood } from "@shared/schema";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Pause, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function TracksPage() {
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [moodFilter, setMoodFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  
  const { data: tracks, isLoading: isLoadingTracks } = useQuery<Track[]>({
    queryKey: ['/api/tracks'],
  });
  
  const { data: genres, isLoading: isLoadingGenres } = useQuery<Genre[]>({
    queryKey: ['/api/genres'],
  });
  
  const { data: moods, isLoading: isLoadingMoods } = useQuery<Mood[]>({
    queryKey: ['/api/moods'],
  });
  
  const { currentTrack, isPlaying, play, pause } = useAudioPlayer();
  
  // Apply URL search parameters on mount
  useEffect(() => {
    const genreParam = searchParams.get('genre');
    const moodParam = searchParams.get('mood');
    
    if (genreParam) setGenreFilter(genreParam);
    if (moodParam) setMoodFilter(moodParam);
  }, [searchParams]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (genreFilter) params.set('genre', genreFilter);
    if (moodFilter) params.set('mood', moodFilter);
    
    const newSearch = params.toString();
    if (newSearch) {
      setLocation(`/tracks?${newSearch}`, { replace: true });
    } else if (location !== '/tracks') {
      setLocation('/tracks', { replace: true });
    }
  }, [genreFilter, moodFilter, setLocation, location]);
  
  // Filter tracks
  const filteredTracks = tracks 
    ? tracks.filter(track => {
        const matchesSearch = search 
          ? track.title.toLowerCase().includes(search.toLowerCase()) || 
            track.genre.toLowerCase().includes(search.toLowerCase()) || 
            track.mood.toLowerCase().includes(search.toLowerCase())
          : true;
        
        const matchesGenre = genreFilter && genreFilter !== "all" 
          ? track.genre === genreFilter 
          : true;
        
        const matchesMood = moodFilter && moodFilter !== "all" 
          ? track.mood === moodFilter 
          : true;
        
        return matchesSearch && matchesGenre && matchesMood;
      })
    : [];
  
  // Pagination
  const tracksPerPage = 10;
  const totalPages = filteredTracks ? Math.ceil(filteredTracks.length / tracksPerPage) : 0;
  const paginatedTracks = filteredTracks 
    ? filteredTracks.slice((page - 1) * tracksPerPage, page * tracksPerPage) 
    : [];
  
  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };
  
  const handleGenreChange = (value: string) => {
    setGenreFilter(value);
    setPage(1);
  };
  
  const handleMoodChange = (value: string) => {
    setMoodFilter(value);
    setPage(1);
  };
  
  const handlePlayPause = (trackId: number) => {
    if (currentTrack === trackId && isPlaying) {
      pause();
    } else {
      play(trackId);
    }
  };
  
  return (
    <section className="py-16 px-4 bg-neutral-100 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-bold text-3xl mb-8">All Tracks</h2>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by track name, mood, or genre"
                value={search}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={genreFilter} onValueChange={handleGenreChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres?.map(genre => (
                    <SelectItem key={genre.id} value={genre.name}>{genre.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={moodFilter} onValueChange={handleMoodChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Moods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Moods</SelectItem>
                  {moods?.map(mood => (
                    <SelectItem key={mood.id} value={mood.name}>{mood.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Tracks Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            {isLoadingTracks ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : paginatedTracks.length > 0 ? (
              <table className="w-full">
                <thead className="bg-neutral-100">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-sm">Track</th>
                    <th className="py-3 px-4 text-left font-semibold text-sm hidden md:table-cell">Genre</th>
                    <th className="py-3 px-4 text-left font-semibold text-sm hidden md:table-cell">Mood</th>
                    <th className="py-3 px-4 text-left font-semibold text-sm hidden sm:table-cell">Duration</th>
                    <th className="py-3 px-4 text-left font-semibold text-sm hidden lg:table-cell">BPM</th>
                    <th className="py-3 px-4 text-center font-semibold text-sm">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paginatedTracks.map(track => {
                    const isCurrentTrack = currentTrack === track.id;
                    const isCurrentlyPlaying = isCurrentTrack && isPlaying;
                    
                    return (
                      <tr 
                        key={track.id} 
                        className={`hover:bg-neutral-100/30 transition-colors ${
                          isCurrentTrack ? 'bg-neutral-100/40' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded mr-3 bg-primary/10 flex items-center justify-center text-primary">
                              {track.genre.charAt(0)}
                            </div>
                            <span className="font-medium">
                              {track.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <Badge variant="outline" className="bg-muted/30 text-muted-foreground font-normal">
                            {track.genre}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <Badge variant="outline" className="bg-muted/30 text-muted-foreground font-normal">
                            {track.mood}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell">
                          {track.duration}
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          {track.bpm || '-'}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            size="icon"
                            variant={isCurrentlyPlaying ? "secondary" : "outline"}
                            className={`rounded-full w-8 h-8 ${
                              isCurrentlyPlaying 
                                ? 'bg-secondary text-white hover:bg-secondary/90' 
                                : 'border-secondary text-secondary hover:bg-secondary hover:text-white'
                            }`}
                            onClick={() => handlePlayPause(track.id)}
                          >
                            {isCurrentlyPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <h3 className="text-xl font-medium text-muted-foreground mb-2">No tracks found</h3>
                <p className="text-muted-foreground mb-4">
                  {search || genreFilter || moodFilter 
                    ? "Try adjusting your search filters" 
                    : "No tracks have been added yet"}
                </p>
                {(search || genreFilter || moodFilter) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearch("");
                      setGenreFilter("all");
                      setMoodFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <nav className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                .map((p, i, arr) => {
                  // Add ellipsis
                  if (i > 0 && p > arr[i - 1] + 1) {
                    return (
                      <span key={`ellipsis-${p}`} className="px-2">...</span>
                    );
                  }
                  
                  return (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "ghost"}
                      className="w-9 h-9"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  );
                })}
              
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
}
