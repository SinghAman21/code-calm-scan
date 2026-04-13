import { motion } from "framer-motion";
import { pageTransition, staggerContainer, staggerItem } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { MOCK_HISTORY } from "@/data/mock-data";
import { SeverityBadge } from "@/components/scan/SeverityBadge";
import { Link } from "react-router-dom";
import { Search, Clock, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_HISTORY.filter(
    (h) => h.language.toLowerCase().includes(search.toLowerCase()) || h.snippet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">Scan History</h1>
          <p className="text-[13px] text-muted-foreground mb-6">Previous audit results and their findings.</p>

          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by language or snippet…"
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-1">
            {filtered.map((entry) => (
              <motion.div key={entry.id} variants={staggerItem}>
                <Link
                  to={`/history/${entry.id}`}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg border border-transparent hover:border-border hover:bg-accent/40 transition-all duration-150 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[13px] font-medium text-foreground">{entry.language}</span>
                      <span className={cn(
                        "text-2xs px-1.5 py-0.5 rounded font-medium",
                        entry.status === "completed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      )}>
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-2xs text-muted-foreground truncate">{entry.snippet}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex gap-1">
                      {entry.stats.critical > 0 && <SeverityBadge severity="critical" />}
                      {entry.stats.high > 0 && <SeverityBadge severity="high" />}
                      {entry.stats.medium > 0 && <SeverityBadge severity="medium" />}
                    </div>
                    <div className="flex items-center gap-1 text-2xs text-muted-foreground tabular-nums">
                      <Clock className="h-3 w-3" />
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="h-6 w-6 mx-auto mb-2 opacity-30" />
              <p className="text-[13px]">No scans match your search.</p>
            </div>
          )}
        </div>
      </motion.div>
    </AppShell>
  );
}
