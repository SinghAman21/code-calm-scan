import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScanButton } from "@/components/scan/ScanButton";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useScan } from "@/hooks/useScanStore";
import { SUPPORTED_LANGUAGES } from "@/data/mock-data";
import { NAV_ITEMS } from "@/config/routes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shield, PanelLeftClose, PanelLeft, Wifi, Eraser,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { duration } from "@/animations/motion-presets";

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { language, setLanguage, clearAll } = useScan();
  const [collapsed, setCollapsed] = useState(false);
  const isAppRoute = location.pathname === "/app";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -12, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: duration.normal }}
        className={cn(
          "flex flex-col border-r border-border shrink-0 transition-[width] duration-200 ease-out",
          collapsed ? "w-[52px]" : "w-[200px]"
        )}
        style={{ backgroundColor: "hsl(var(--sidebar-background))" }}
      >
        {/* Logo */}
        <div className={cn("flex items-center border-b border-sidebar-border h-12", collapsed ? "px-2 justify-center" : "px-3")}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 min-w-0 mr-auto">
              <Shield className="h-[18px] w-[18px] text-primary shrink-0" />
              <span className="text-[13px] font-semibold text-foreground tracking-tight">CodeAudit</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/" className="flex items-center justify-center">
              <Shield className="h-[18px] w-[18px] text-primary" />
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors",
              collapsed && "mt-0"
            )}
          >
            {collapsed ? <PanelLeft className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Nav */}
        <nav className={cn("flex-1 py-2", collapsed ? "px-1.5" : "px-2")}>
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path ||
                (item.path !== "/app" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center rounded-md transition-colors duration-150",
                    collapsed ? "justify-center p-2" : "gap-2.5 px-2.5 py-[7px]",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                  )}
                >
                  {item.icon && <item.icon className={cn("shrink-0", collapsed ? "h-4 w-4" : "h-[15px] w-[15px]")} strokeWidth={active ? 2.2 : 1.8} />}
                  {!collapsed && item.label && (
                    <span className={cn("text-[13px] truncate", active && "font-medium")}>{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Status */}
        {!collapsed && (
          <div className="px-3 py-2.5 border-t border-sidebar-border">
            <div className="flex items-center gap-1.5 text-2xs text-muted-foreground">
              <Wifi className="h-3 w-3 text-success" />
              <span>Local mode active</span>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <motion.header
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: duration.normal, delay: 0.06 }}
          className="min-h-12 border-b border-border flex items-center px-4 py-2 gap-2 shrink-0 flex-wrap"
          style={{ backgroundColor: "hsl(var(--surface-1))" }}
        >
          <div className="flex items-center gap-2 mr-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Language</span>
            <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
              <SelectTrigger className="h-9 w-[180px] bg-background/70 border-border text-sm">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1" />

          {isAppRoute && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Eraser className="h-3.5 w-3.5" />
              Clear All
            </button>
          )}

          {isAppRoute && <ScanButton className="h-9 px-3.5 text-sm" />}

          <ThemeToggle />
        </motion.header>

        <main className="flex-1 min-h-0">{children}</main>
      </div>
    </div>
  );
}
