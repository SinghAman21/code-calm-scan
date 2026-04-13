import { motion } from "framer-motion";
import { pageTransition, staggerContainer, staggerItem } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { MOCK_HISTORY } from "@/data/mock-data";
import { SeverityBadge } from "@/components/scan/SeverityBadge";
import { Link } from "react-router-dom";
import { Search, Clock } from "lucide-react";
import { useState } from "react";

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const filtered = MOCK_HISTORY.filter(
    (h) => h.language.toLowerCase().includes(search.toLowerCase()) || h.snippet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-6">Scan History</h1>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scans..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground"
            />
          </div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            {filtered.map((entry) => (
              <motion.div key={entry.id} variants={staggerItem}>
                <Link
                  to={`/history/${entry.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{entry.language}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${entry.status === "completed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{entry.snippet}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex gap-1">
                      {entry.stats.critical > 0 && <SeverityBadge severity="critical" />}
                      {entry.stats.high > 0 && <SeverityBadge severity="high" />}
                      {entry.stats.medium > 0 && <SeverityBadge severity="medium" />}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AppShell>
  );
}
