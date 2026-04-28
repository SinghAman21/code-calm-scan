import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScanButton } from "@/components/scan/ScanButton";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useScan } from "@/hooks/useScanStore";
import { SUPPORTED_LANGUAGES } from "@/data/mock-data";
import { NAV_ITEMS } from "@/config/routes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shield,
  PanelLeftClose,
  PanelLeft,
  Eraser,
  Activity,
  Orbit,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { duration } from "@/animations/motion-presets";

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { language, setLanguage, clearAll, result } = useScan();
  const [collapsed, setCollapsed] = useState(false);
  const isAppRoute = location.pathname === "/app";
  const routeMeta = useMemo(() => {
    if (location.pathname.startsWith("/history/")) {
      return {
        eyebrow: "Forensics",
        title: "Case File",
        summary: "Review the exact scan conditions, issue stack, and patch diff.",
      };
    }

    const dictionary: Record<string, { eyebrow: string; title: string; summary: string }> = {
      "/app": {
        eyebrow: "Live Audit",
        title: "Command Deck",
        summary: "Compose source, inspect findings, and track remediation without leaving the flow.",
      },
      "/history": {
        eyebrow: "Archive",
        title: "Scan Ledger",
        summary: "A chronological record of incidents, languages, and resolution pressure.",
      },
      "/rules": {
        eyebrow: "Detection Graph",
        title: "Rule Atlas",
        summary: "Study how the engine reads unsafe code and what safer patterns replace it.",
      },
      "/settings": {
        eyebrow: "Calibration",
        title: "Operator Settings",
        summary: "Tune the room: typography, scan rhythm, and interface behavior.",
      },
    };

    return dictionary[location.pathname] ?? {
      eyebrow: "System",
      title: "Code Calm Scan",
      summary: "Local-first security analysis for developers shipping under pressure.",
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <motion.aside
        initial={{ x: -12, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: duration.normal }}
        className={cn(
          "relative hidden shrink-0 border-r border-sidebar-border/70 bg-sidebar-background/90 md:flex md:flex-col",
          "transition-[width] duration-300",
          collapsed ? "w-[78px]" : "w-[292px]"
        )}
      >
        <div className="pointer-events-none absolute inset-0 ink-grid opacity-30" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.28),transparent_70%)]" />

        <div className={cn("relative flex items-center border-b border-sidebar-border/70", collapsed ? "justify-center px-3 py-5" : "px-5 py-5")}>
          {!collapsed ? (
            <Link to="/" className="mr-auto flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] border border-primary/25 bg-primary/12 text-primary shadow-[inset_0_1px_0_hsl(var(--primary)/0.1)]">
                <Shield className="h-5 w-5 shrink-0" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-[0.8rem] uppercase tracking-[0.26em] text-foreground">Calm Scan</div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Local Security Desk</div>
              </div>
            </Link>
          ) : (
            <Link to="/" className="flex items-center justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-primary/25 bg-primary/12 text-primary">
                <Shield className="h-5 w-5" />
              </div>
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "magnetic-hover rounded-full border border-sidebar-border/80 bg-sidebar-accent/50 p-2 text-sidebar-foreground hover:text-foreground"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="relative border-b border-sidebar-border/70 px-5 py-5">
            <div className="rounded-[1.6rem] border border-primary/15 bg-[linear-gradient(135deg,hsl(var(--primary)/0.18),transparent_60%),linear-gradient(180deg,hsl(var(--surface-2)/0.6),hsl(var(--surface-1)/0.8))] p-4 shadow-[var(--shadow-soft)]">
              <div className="mb-3 flex items-center justify-between">
                <span className="panel-title">Mode</span>
                <Orbit className="h-4 w-4 text-primary/70" />
              </div>
              <div className="text-lg font-display uppercase tracking-[0.18em] text-foreground">Developer Flight Deck</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Trace risks, read code paths, and ship fixes with less ceremony.
              </p>
            </div>
          </div>
        )}

        <nav className={cn("relative flex-1 py-5", collapsed ? "px-2" : "px-4")}>
          <div className="mb-3 px-2">
            {!collapsed && <div className="panel-title">Routes</div>}
          </div>
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path ||
                (item.path !== "/app" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group magnetic-hover relative overflow-hidden rounded-[1.2rem] border transition-all duration-200",
                    collapsed ? "flex justify-center px-2 py-3" : "flex gap-3 px-3 py-3",
                    active
                      ? "border-primary/30 bg-primary/12 text-foreground shadow-[var(--shadow-soft)]"
                      : "border-transparent text-sidebar-foreground hover:border-sidebar-border/80 hover:bg-sidebar-accent/45 hover:text-foreground"
                  )}
                >
                  {active && <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-primary" />}
                  {item.icon && (
                    <div className={cn(
                      "flex shrink-0 items-center justify-center rounded-xl border",
                      collapsed ? "h-10 w-10" : "h-10 w-10",
                      active
                        ? "border-primary/25 bg-primary/12 text-primary"
                        : "border-sidebar-border/70 bg-sidebar-accent/40 text-sidebar-foreground group-hover:text-primary"
                    )}>
                      <item.icon className="h-4 w-4" strokeWidth={active ? 2.2 : 1.8} />
                    </div>
                  )}
                  {!collapsed && item.label && (
                    <div className="min-w-0 flex-1">
                      <div className={cn("text-sm truncate", active && "font-semibold")}>{item.label}</div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {item.path === "/app" ? "Compose" : item.path === "/history" ? "Review" : item.path === "/rules" ? "Inspect" : "Tune"}
                      </div>
                    </div>
                  )}
                  {!collapsed && <ArrowUpRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5", active ? "text-primary/75" : "text-muted-foreground/45")} />}
                </Link>
              );
            })}
          </div>
        </nav>

        {!collapsed && (
          <div className="relative border-t border-sidebar-border/70 px-5 py-5">
            <div className="flex items-center gap-3 rounded-[1.2rem] border border-sidebar-border/70 bg-sidebar-accent/30 px-4 py-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-success/12 text-success">
                <Activity className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-success" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Local mode active</div>
                <div className="text-xs text-muted-foreground">
                  {result ? `${result.stats.total} issues in current session` : "No cloud relay, no telemetry."}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <motion.header
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: duration.normal, delay: 0.06 }}
          className="relative border-b border-border/70 px-4 py-4 md:px-7"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--surface-1)/0.92),hsl(var(--surface-1)/0.72))] backdrop-blur-xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-2 panel-title">{routeMeta.eyebrow}</div>
              <div className="flex flex-wrap items-end gap-3">
                <h1 className="text-[clamp(1.55rem,3vw,3rem)] font-display uppercase leading-[0.9] tracking-[-0.08em] text-foreground">
                  {routeMeta.title}
                </h1>
                <span className="mb-1 hidden text-xs uppercase tracking-[0.3em] text-primary/70 md:inline">Built around `#174E4F`</span>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {routeMeta.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-[1.15rem] border border-border/80 px-3 py-2 shadow-[var(--shadow-soft)]" style={{ backgroundColor: "hsl(var(--surface-1) / 0.7)" }}>
                <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Language</div>
                <Select value={language} onValueChange={(value) => setLanguage(value as typeof language)}>
                  <SelectTrigger className="h-11 w-[186px] rounded-[0.95rem] border-border/80 bg-background/55 text-sm shadow-none ring-offset-0 focus:ring-1">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/80 bg-popover/95 backdrop-blur-xl">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <SelectItem key={l.id} value={l.id}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isAppRoute && (
                <button
                  onClick={clearAll}
                  className="magnetic-hover inline-flex h-11 items-center gap-2 rounded-[1rem] border border-border/80 px-4 text-sm text-muted-foreground hover:text-foreground"
                  style={{ backgroundColor: "hsl(var(--surface-1) / 0.8)" }}
                >
                  <Eraser className="h-4 w-4" />
                  Clear
                </button>
              )}

              {isAppRoute && <ScanButton className="h-11 px-5 text-sm" />}

              <ThemeToggle />
            </div>
          </div>
        </motion.header>

        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
