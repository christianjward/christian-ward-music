import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import TracksPage from "@/pages/tracks-page";
import AdminPage from "@/pages/admin-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GlobalPlayer from "@/components/global-player";
import { AudioPlayerProvider } from "@/hooks/use-audio-player";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/tracks" component={TracksPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioPlayerProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <GlobalPlayer />
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </AudioPlayerProvider>
    </QueryClientProvider>
  );
}

export default App;
