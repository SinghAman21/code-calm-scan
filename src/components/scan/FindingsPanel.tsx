import { FindingCard } from "./FindingCard";
import { motion } from "framer-motion";
import { cascadeContainer } from "@/animations/motion-presets";
import { useScan } from "@/hooks/useScanStore";
import { ShieldCheck, Inbox, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { duration } from "@/animations/motion-presets";
import { useState } from "react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "vulnerability", label: "Vulns" },
  { id: "bug", label: "Bugs" },
  { id: "code-smell", label: "Smells" },
] as const;

const SEVERITY_PILLS = [
  { id: "critical", label: "Crit", color: "bg-severity-critical" },
  { id: "high", label: "High", color: "bg-severity-high" },
  { id: "medium", label: "Med", color: "bg-severity-medium" },
  { id: "low", label: "Low", color: "bg-severity-low" },
] as const;

export function FindingsPanel() {
  const { result, isScanning, selectedFinding, setSelectedFinding, activeFilter, setActiveFilter } = useScan();
  const [searchQuery, setSearchQuery] = useState("");

  const findings = result?.findings.filter((f) => {
    // Filter by category/severity
    if (activeFilter !== "all") {
      const matchesFilter = f.category === activeFilter || f.severity === activeFilter;
      if (!matchesFilter) return false;
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        f.title.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.line.toString().includes(query)
      );
    }
    
    return true;
  }) ?? [];

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.normal, delay: 0.15 }}
      className="panel-shell flex h-full min-h-[420px] flex-col overflow-hidden rounded-[2rem]"
    >
      <div className="space-y-3 border-b border-border/70 px-4 py-4 shrink-0" style={{ backgroundColor: "hsl(var(--surface-1) / 0.82)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-primary/20 bg-primary/10 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="panel-title">Findings stack</div>
            <div className="mt-1 text-sm font-medium text-foreground">Risk signals</div>
          </div>
          {result && (
            <span className="ml-auto rounded-full border border-border/80 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {findings.length}/{result.stats.total}
            </span>
          )}
        </div>

        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-2 h-3 w-3 text-muted-foreground/50 pointer-events-none" />
            <input
              type="text"
              placeholder="Search findings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full rounded-[1rem] border border-border/80 bg-background/50 py-2.5 pl-8 pr-8 text-xs text-foreground placeholder-muted-foreground/50",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent",
                "transition-all duration-150"
              )}
            />
            {hasSearch && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 p-0.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-1 rounded-[1rem] border border-border/70 bg-muted/35 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "flex-1 rounded-[0.8rem] px-2 py-2 text-2xs font-medium transition-colors duration-150",
                activeFilter === f.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {result && (
          <div className="flex flex-wrap gap-2">
            {SEVERITY_PILLS.map((s) => {
              const count = result.stats[s.id as keyof typeof result.stats] as number;
              if (count === 0) return null;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveFilter(s.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border border-border/80 px-2.5 py-1.5 text-2xs text-muted-foreground transition-colors",
                    activeFilter === s.id && "border-primary/20 bg-primary/8 text-foreground"
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", s.color)} />
                  {count}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {isScanning && <SkeletonFindings />}

        {!isScanning && !result && <EmptyState />}

        {!isScanning && result && findings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-4">
            <ShieldCheck className="h-6 w-6 mb-2 opacity-30" />
            <p className="text-xs text-center">No issues match this filter</p>
          </div>
        )}

        {!isScanning && findings.length > 0 && (
          <motion.div variants={cascadeContainer} initial="hidden" animate="visible" className="space-y-2">
            {findings.map((f, i) => (
              <FindingCard
                key={f.id}
                finding={f}
                isSelected={selectedFinding?.id === f.id}
                onClick={() => setSelectedFinding(f)}
                index={i}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function SkeletonFindings() {
  return (
    <div className="space-y-2 p-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="skeleton-shimmer rounded-[1.2rem] border border-border/60 p-3"
          style={{
            backgroundColor: "hsl(var(--muted) / 0.55)",
            animationDelay: `${i * 80}ms`,
            height: "88px",
          }}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[1.2rem] border border-border/70 bg-muted/40">
        <Inbox className="h-5 w-5 text-muted-foreground/50" />
      </div>
      <p className="text-[13px] text-muted-foreground font-medium mb-1">No findings yet</p>
      <p className="text-xs text-muted-foreground/70 leading-relaxed">
        Paste code and run a scan to detect vulnerabilities, bugs, and code quality issues.
      </p>
    </div>
  );
}
