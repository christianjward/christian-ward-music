import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-16 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold mb-6 text-center">About Christian Ward Music</h1>
      
      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-lg mb-4">
          Christian Ward Music offers high-quality music tracks perfect for creative professionals 
          seeking the right sound for their projects. From cinematic scores to electronic beats,
          our diverse library provides the perfect soundtrack for your content.
        </p>
        <p className="text-lg mb-4">
          As a composer with over 10 years of experience creating music for film, television, 
          advertising, and digital media, I understand the importance of finding the right track
          that captures the intended emotion and enhances your visual story.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            To provide creators with accessible, high-quality music that elevates their projects and
            helps them connect with their audience on a deeper level.
          </p>
          <p>
            We believe that the right music can transform good content into unforgettable experiences,
            and we're committed to helping creators find that perfect musical match.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Why Choose Christian Ward Music</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>High-quality, professionally produced tracks</li>
            <li>Diverse library covering multiple genres and moods</li>
            <li>Simple licensing process with clear terms</li>
            <li>Affordable options for creators of all budget sizes</li>
            <li>Custom music creation available for specific projects</li>
            <li>Regular updates with new tracks</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-neutral-100 p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-semibold mb-4 text-center">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold mb-4">1</div>
            <h3 className="text-xl font-medium mb-2">Browse & Discover</h3>
            <p>Easily search through our categorized library to find tracks that match your project's needs.</p>
          </div>
          
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold mb-4">2</div>
            <h3 className="text-xl font-medium mb-2">License</h3>
            <p>Select the appropriate licensing option based on your project type and distribution needs.</p>
          </div>
          
          <div className="text-center p-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold mb-4">3</div>
            <h3 className="text-xl font-medium mb-2">Download & Create</h3>
            <p>Instantly download high-quality files and integrate them into your creative project.</p>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-6">Ready to enhance your project with the perfect soundtrack?</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/tracks">
            <Button variant="default" className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded">
              Browse Tracks
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="px-8 py-2 rounded">
              Contact for Custom Music
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
