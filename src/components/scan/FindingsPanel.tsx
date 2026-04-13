import { FindingCard } from "./FindingCard";
import { motion } from "framer-motion";
import { staggerContainer } from "@/animations/motion-presets";
import { useScan } from "@/hooks/useScanStore";
import { ShieldCheck, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { duration } from "@/animations/motion-presets";

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

  const findings = result?.findings.filter((f) => {
    if (activeFilter === "all") return true;
    return f.category === activeFilter || f.severity === activeFilter;
  }) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.normal, delay: 0.15 }}
      className="flex flex-col h-full border-x border-border"
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border shrink-0" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span className="text-[13px] font-semibold text-foreground">Findings</span>
          {result && (
            <span className="text-2xs font-mono text-muted-foreground ml-auto tabular-nums">{result.stats.total}</span>
          )}
        </div>

        {/* Category filters */}
        <div className="flex gap-0.5 p-0.5 rounded-md bg-muted/50">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "flex-1 px-1.5 py-1 text-2xs rounded-[3px] font-medium transition-colors duration-150",
                activeFilter === f.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Severity quick-stats when result exists */}
        {result && (
          <div className="flex gap-2 mt-2">
            {SEVERITY_PILLS.map((s) => {
              const count = result.stats[s.id as keyof typeof result.stats] as number;
              if (count === 0) return null;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveFilter(s.id)}
                  className={cn(
                    "flex items-center gap-1 text-2xs text-muted-foreground transition-colors",
                    activeFilter === s.id && "text-foreground"
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

      {/* Findings list */}
      <div className="flex-1 overflow-y-auto px-1.5 py-1.5">
        {isScanning && <SkeletonFindings />}

        {!isScanning && !result && <EmptyState />}

        {!isScanning && result && findings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-4">
            <ShieldCheck className="h-6 w-6 mb-2 opacity-30" />
            <p className="text-xs text-center">No issues match this filter</p>
          </div>
        )}

        {!isScanning && findings.length > 0 && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-0.5">
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
    <div className="space-y-1.5 p-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-md p-3 skeleton-shimmer"
          style={{
            backgroundColor: "hsl(var(--muted))",
            animationDelay: `${i * 80}ms`,
            height: "56px",
          }}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
        <Inbox className="h-5 w-5 text-muted-foreground/50" />
      </div>
      <p className="text-[13px] text-muted-foreground font-medium mb-1">No findings yet</p>
      <p className="text-xs text-muted-foreground/70 leading-relaxed">
        Paste code and run a scan to detect vulnerabilities, bugs, and code quality issues.
      </p>
    </div>
  );
}
