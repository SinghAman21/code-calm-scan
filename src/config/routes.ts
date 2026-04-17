import { LucideIcon, ScanSearch, Clock, ScrollText, Cog } from "lucide-react";
import LandingPage from "@/pages/LandingPage";
import AppWorkspace from "@/pages/AppWorkspace";
import HistoryPage from "@/pages/HistoryPage";
import HistoryDetailPage from "@/pages/HistoryDetailPage";
import RulesPage from "@/pages/RulesPage";
import SettingsPage from "@/pages/SettingsPage";
import OnboardingPage from "@/pages/OnboardingPage";
import NotFound from "@/pages/NotFound";

export interface Route {
  path: string;
  element: React.ComponentType;
  icon?: LucideIcon;
  label?: string;
  inNav?: boolean;
  params?: string;
}

/**
 * Route configuration: Single source of truth for all routes
 * This enables:
 * - Dynamic nav generation in AppShell
 * - Centralized route management
 * - Type-safe route references
 */
export const ROUTES: Route[] = [
  // Public routes
  { path: "/", element: LandingPage },
  
  // Authenticated routes
  {
    path: "/app",
    element: AppWorkspace,
    icon: ScanSearch,
    label: "New Scan",
    inNav: true,
  },
  {
    path: "/history",
    element: HistoryPage,
    icon: Clock,
    label: "History",
    inNav: true,
  },
  {
    path: "/history/:id",
    element: HistoryDetailPage,
    params: "id",
  },
  {
    path: "/rules",
    element: RulesPage,
    icon: ScrollText,
    label: "Rules",
    inNav: true,
  },
  {
    path: "/settings",
    element: SettingsPage,
    icon: Cog,
    label: "Settings",
    inNav: true,
  },
  {
    path: "/onboarding",
    element: OnboardingPage,
  },
  
  // 404 catch-all
  { path: "*", element: NotFound },
];

/**
 * Navigation items (filtered from main routes)
 * Used in AppShell sidebar for rendering nav links
 */
export const NAV_ITEMS = ROUTES.filter((route) => route.inNav);
