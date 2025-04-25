import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const closeMenu = () => setIsMenuOpen(false);
  
  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-primary text-2xl font-bold">
              Christian Ward <span className="text-secondary">Music</span>
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-8 font-medium">
          <Link 
            href="/" 
            className={`py-1 ${isActive('/') 
              ? 'text-foreground border-b-2 border-secondary' 
              : 'text-muted-foreground hover:text-foreground transition-colors'}`}
          >
            Home
          </Link>
          <Link 
            href="/tracks" 
            className={`py-1 ${isActive('/tracks') 
              ? 'text-foreground border-b-2 border-secondary' 
              : 'text-muted-foreground hover:text-foreground transition-colors'}`}
          >
            Tracks
          </Link>
          <Link 
            href="/about" 
            className={`py-1 ${isActive('/about') 
              ? 'text-foreground border-b-2 border-secondary' 
              : 'text-muted-foreground hover:text-foreground transition-colors'}`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`py-1 ${isActive('/contact') 
              ? 'text-foreground border-b-2 border-secondary' 
              : 'text-muted-foreground hover:text-foreground transition-colors'}`}
          >
            Contact
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="hidden md:inline-block">
            <Button variant="default">Login</Button>
          </Link>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-8">
                <Link 
                  href="/" 
                  className={`text-lg font-medium ${isActive('/') ? 'text-primary' : ''}`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link 
                  href="/tracks" 
                  className={`text-lg font-medium ${isActive('/tracks') ? 'text-primary' : ''}`}
                  onClick={closeMenu}
                >
                  Tracks
                </Link>
                <Link 
                  href="/about" 
                  className={`text-lg font-medium ${isActive('/about') ? 'text-primary' : ''}`}
                  onClick={closeMenu}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className={`text-lg font-medium ${isActive('/contact') ? 'text-primary' : ''}`}
                  onClick={closeMenu}
                >
                  Contact
                </Link>
                <Link 
                  href="/admin" 
                  onClick={closeMenu}
                >
                  <Button variant="default" className="w-full">Login</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
