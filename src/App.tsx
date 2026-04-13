import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/useTheme";
import { ScanProvider } from "@/hooks/useScanStore";
import LandingPage from "./pages/LandingPage";
import AppWorkspace from "./pages/AppWorkspace";
import HistoryPage from "./pages/HistoryPage";
import HistoryDetailPage from "./pages/HistoryDetailPage";
import RulesPage from "./pages/RulesPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScanProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<AppWorkspace />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/:id" element={<HistoryDetailPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ScanProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
