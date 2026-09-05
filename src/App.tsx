import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { BackgroundMusicProvider } from "./providers/BackgroundMusicProvider";

const CinematicHome = lazy(() => import("./pages/CinematicHome"));
const Transition = lazy(() => import("./pages/Transition"));
const ViaArcani = lazy(() => import("./pages/ViaArcani"));
const ViaRespiro = lazy(() => import("./pages/ViaRespiro"));
const ViaIspirazione = lazy(() => import("./pages/ViaIspirazione"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FloatingVoiceGuide = lazy(() => import("./components/voice/FloatingVoiceGuide"));

const RouteFallback = () => <div className="min-h-[100dvh] bg-background" aria-hidden="true" />;

const VoiceGuideForPathPages = () => {
  const { pathname } = useLocation();
  const visible = ["/arcani", "/respiro", "/ispirazione"].includes(pathname);
  return visible ? (
    <Suspense fallback={null}>
      <FloatingVoiceGuide />
    </Suspense>
  ) : null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BackgroundMusicProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<CinematicHome />} />
              <Route path="/transition/:via" element={<Transition />} />
              <Route path="/arcani" element={<ViaArcani />} />
              <Route path="/respiro" element={<ViaRespiro />} />
              <Route path="/ispirazione" element={<ViaIspirazione />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <VoiceGuideForPathPages />
        </BrowserRouter>
      </BackgroundMusicProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
