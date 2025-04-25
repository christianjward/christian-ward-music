import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface GenreCardProps {
  name: string;
  imageUrl?: string;
  className?: string;
}

export default function GenreCard({ name, imageUrl, className }: GenreCardProps) {
  return (
    <Link href={`/tracks?genre=${name}`} className={cn("group block", className)}>
      <div className="rounded-lg bg-white shadow-md hover:shadow-lg overflow-hidden transition-all">
        <div className="relative h-40">
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <div className="flex items-center justify-center h-full text-6xl font-bold text-primary/30">
              {name.charAt(0)}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-3 left-3 right-3 text-white font-semibold text-xl">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
