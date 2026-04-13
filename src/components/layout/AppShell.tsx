import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScanButton } from "@/components/scan/ScanButton";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useScan } from "@/hooks/useScanStore";
import { SUPPORTED_LANGUAGES } from "@/data/mock-data";
import {
  Shield, PlusCircle, History, BookOpen, Beaker, Settings, ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/app", icon: PlusCircle, label: "New Scan" },
  { to: "/history", icon: History, label: "History" },
  { to: "/rules", icon: BookOpen, label: "Rules" },
  { to: "/playground", icon: Beaker, label: "Playground" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { language, setLanguage } = useScan();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex flex-col border-r border-border bg-surface-1 transition-all duration-200 shrink-0",
          sidebarOpen ? "w-52" : "w-14"
        )}
        style={{ backgroundColor: "hsl(var(--surface-1))" }}
      >
        <div className="p-3 border-b border-border flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            {sidebarOpen && <span className="text-sm font-semibold text-foreground truncate">CodeAudit</span>}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto p-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", !sidebarOpen && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.to || (item.to !== "/app" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
              Local mode
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="h-12 border-b border-border flex items-center px-4 gap-3 shrink-0"
          style={{ backgroundColor: "hsl(var(--surface-1))" }}
        >
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="text-xs bg-accent border border-border rounded-md px-2 py-1 text-foreground"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>

          <div className="flex-1" />

          <ThemeToggle />
          {location.pathname === "/app" && <ScanButton />}
        </motion.header>

        {/* Content */}
        <main className="flex-1 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
