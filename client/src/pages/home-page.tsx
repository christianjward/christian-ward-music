import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Track, Genre, Mood } from "@shared/schema";
import TrackCard from "@/components/track-card";
import GenreCard from "@/components/genre-card";
import { ChevronRight, Film, Tv, ShoppingBag, Music } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const { data: featuredTracks, isLoading: isLoadingTracks } = useQuery<Track[]>({
    queryKey: ['/api/tracks/featured'],
  });
  
  const { data: genres, isLoading: isLoadingGenres } = useQuery<Genre[]>({
    queryKey: ['/api/genres'],
  });
  
  const { data: moods, isLoading: isLoadingMoods } = useQuery<Mood[]>({
    queryKey: ['/api/moods'],
  });
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="md:w-3/5">
            <h1 className="font-bold text-4xl md:text-5xl leading-tight mb-4">
              Composer for Film, TV & Media
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              License professional tracks perfectly matched to your creative projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/tracks">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                  Browse Tracks
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white hover:bg-neutral-100 text-primary">
                  Contact for Custom
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10">
          <Music className="w-64 h-64" />
        </div>
      </section>
      
      {/* Featured Tracks Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-3xl">Featured Tracks</h2>
            <Link href="/tracks" className="text-primary hover:text-primary/80 font-medium flex items-center gap-2">
              View all tracks
              <ChevronRight size={18} />
            </Link>
          </div>
          
          {isLoadingTracks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-14 rounded-full" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredTracks && featuredTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTracks.map((track) => (
                <TrackCard key={track.id} track={track} isFeatured />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-medium text-muted-foreground mb-2">No featured tracks yet</h3>
              <p className="mb-4 text-muted-foreground">Check back soon for featured music selections</p>
              <Link href="/tracks">
                <Button variant="outline">Browse All Tracks</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="font-bold text-3xl mb-4">
            Need a custom track for your project?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/90">
            Get in touch to discuss your project needs. I specialize in creating custom music that perfectly matches your vision.
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-neutral-100">
              Contact Me
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
