import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Threshold from "./pages/Threshold";
import Transition from "./pages/Transition";
import ViaArcani from "./pages/ViaArcani";
import ViaRespiro from "./pages/ViaRespiro";
import ViaIspirazione from "./pages/ViaIspirazione";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Threshold />} />
          <Route path="/transition/:via" element={<Transition />} />
          <Route path="/arcani" element={<ViaArcani />} />
          <Route path="/respiro" element={<ViaRespiro />} />
          <Route path="/ispirazione" element={<ViaIspirazione />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
