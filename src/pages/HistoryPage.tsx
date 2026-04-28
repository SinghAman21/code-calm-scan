import { motion } from "framer-motion";
import { pageTransition, staggerContainer, staggerItem } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { SeverityBadge } from "@/components/scan/SeverityBadge";
import { Link } from "react-router-dom";
import { Search, Clock, ArrowUpRight, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { fetchScanHistory } from "@/lib/scan-api";
import { ScanResult } from "@/types";

function toHistoryEntry(scan: ScanResult) {
  return {
    id: scan.id,
    timestamp: scan.timestamp,
    language: scan.language,
    snippet: (scan.originalCode || "").split("\n").find((line) => line.trim())?.slice(0, 90) || "(empty snippet)",
    stats: scan.stats,
    status: "completed" as const,
  };
}

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const scans = await fetchScanHistory();
        if (cancelled) return;
        setHistory(scans);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load scan history.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  const entries = useMemo(() => history.map(toHistoryEntry), [history]);
  const filtered = entries.filter(
    (h) => h.language.toLowerCase().includes(search.toLowerCase()) || h.snippet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="panel-shell rounded-[2rem] p-6">
              <div className="panel-title">Archive view</div>
              <h1 className="mt-3 text-[clamp(2.2rem,4vw,4rem)] font-display uppercase leading-[0.88] tracking-[-0.1em] text-foreground">
                Every scan,
                <br />
                staged like evidence.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                History is not a dump list. It is a ledger of pressure: languages, issue counts, and the pace of remediation over time.
              </p>
            </div>

            <div className="panel-shell rounded-[2rem] p-6">
              <div className="panel-title">Quick counts</div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <MetricCard label="Entries" value={String(entries.length)} />
                <MetricCard label="Filtered" value={String(filtered.length)} />
                <MetricCard label="Search" value={search ? "on" : "off"} />
              </div>
            </div>
          </div>

          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by language or snippet…"
              className="w-full rounded-[1.3rem] border border-border/80 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
              style={{ backgroundColor: "hsl(var(--card) / 0.85)" }}
            />
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg border border-destructive/40 bg-destructive/5 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {isLoading && (
            <div className="space-y-2 mb-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-16 rounded-lg bg-muted/60 animate-pulse" />
              ))}
            </div>
          )}

          {!isLoading && (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            {filtered.map((entry) => (
              <motion.div key={entry.id} variants={staggerItem}>
                <Link
                  to={`/history/${entry.id}`}
                  className="group panel-shell magnetic-hover flex items-center gap-4 rounded-[1.6rem] px-4 py-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground capitalize">{entry.language}</span>
                      <span className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
                        entry.status === "completed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      )}>
                        {entry.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{entry.snippet}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex gap-1">
                      {entry.stats.critical > 0 && <SeverityBadge severity="critical" />}
                      {entry.stats.high > 0 && <SeverityBadge severity="high" />}
                      {entry.stats.medium > 0 && <SeverityBadge severity="medium" />}
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-border/80 px-3 py-1 text-xs text-muted-foreground tabular-nums">
                      <Clock className="h-3 w-3" />
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground/50 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
            </motion.div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="h-6 w-6 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No scans match your search.</p>
            </div>
          )}
        </div>
      </motion.div>
    </AppShell>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-border/70 bg-background/45 p-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className="mt-3 font-display text-2xl uppercase tracking-[-0.08em] text-foreground">{value}</div>
    </div>
  );
}
