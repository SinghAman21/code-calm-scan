import { Finding } from "@/types";
import { FindingCard } from "./FindingCard";
import { motion } from "framer-motion";
import { staggerContainer } from "@/animations/motion-presets";
import { useScan } from "@/hooks/useScanStore";
import { Shield, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_FILTERS = ["all", "vulnerability", "bug", "code-smell"];
const SEVERITY_FILTERS = ["all", "critical", "high", "medium", "low"];

export function FindingsPanel() {
  const { result, isScanning, selectedFinding, setSelectedFinding, activeFilter, setActiveFilter } = useScan();

  const findings = result?.findings.filter((f) => {
    if (activeFilter === "all") return true;
    return f.category === activeFilter || f.severity === activeFilter;
  }) ?? [];

  return (
    <div className="flex flex-col h-full border-x border-border">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Findings</span>
          {result && (
            <span className="text-xs text-muted-foreground ml-auto">{result.stats.total} issues</span>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-2 py-0.5 text-xs rounded-md transition-colors capitalize",
                activeFilter === f
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "code-smell" ? "Smells" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {isScanning && (
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        )}
        {!isScanning && findings.length === 0 && !result && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Filter className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">Run a scan to see findings</p>
          </div>
        )}
        {!isScanning && findings.length > 0 && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-1.5">
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
    </div>
  );
}
