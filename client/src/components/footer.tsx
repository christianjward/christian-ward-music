import { Link } from "wouter";
import { Instagram, Twitter, Youtube, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8 px-4 mt-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-bold text-xl mb-4">
              Christian Ward <span className="text-secondary">Music</span>
            </h3>
            <p className="text-neutral-300 mb-4">
              Professional music licensing for your creative projects.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/tracks" className="text-neutral-300 hover:text-white transition-colors">All Tracks</Link></li>
              <li><Link href="#" className="text-neutral-300 hover:text-white transition-colors">Licensing</Link></li>
              <li><Link href="/about" className="text-neutral-300 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-neutral-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Music Categories</h4>
            <ul className="space-y-2">
              <li><Link href="/tracks?genre=Cinematic" className="text-neutral-300 hover:text-white transition-colors">Cinematic</Link></li>
              <li><Link href="/tracks?genre=Electronic" className="text-neutral-300 hover:text-white transition-colors">Electronic</Link></li>
              <li><Link href="/tracks?genre=Ambient" className="text-neutral-300 hover:text-white transition-colors">Ambient</Link></li>
              <li><Link href="/tracks?genre=Corporate" className="text-neutral-300 hover:text-white transition-colors">Corporate</Link></li>
              <li><Link href="/tracks" className="text-neutral-300 hover:text-white transition-colors">View All Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="mt-1 text-secondary" size={18} />
                <span className="text-neutral-300">christian.ward@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-1 text-secondary" size={18} />
                <span className="text-neutral-300">+1 (555) 123-4567</span>
              </li>
              <li>
                <Link href="/contact" className="inline-block bg-secondary hover:bg-secondary/90 text-white py-2 px-4 rounded-md transition-colors font-medium mt-3">
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-8 text-neutral-400 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 Christian Ward Music. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Licensing Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
