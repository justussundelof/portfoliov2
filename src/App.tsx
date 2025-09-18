import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import URLShortener from "./pages/URLShortener";
import WeatherApp from "./pages/WeatherApp";
import RecipeFinder from "./pages/RecipeFinder";
import BeatMaker from "./pages/BeatMaker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/url-shortener" element={<URLShortener />} />
          <Route path="/weather-app" element={<WeatherApp />} />
          <Route path="/recipe-finder" element={<RecipeFinder />} />
          <Route path="/beat-maker" element={<BeatMaker />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
