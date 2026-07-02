import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const SmartHrPortal = lazy(() => import("./pages/SmartHrPortal.tsx"));
const Compiler = lazy(() => import("./pages/Compiler.tsx"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen grid place-items-center">
    <div className="hud-panel px-4 py-2 font-hud text-xs tracking-widest text-cyan">LOADING MODULE...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SmoothScrollProvider>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/smart-hr-portal" element={<SmartHrPortal />} />
                <Route path="/compiler" element={<Compiler />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </SmoothScrollProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
