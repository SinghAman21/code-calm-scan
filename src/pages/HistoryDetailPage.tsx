import { motion } from "framer-motion";
import { pageTransition, fadeUp } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { useParams, Link } from "react-router-dom";
import { SeverityBadge } from "@/components/scan/SeverityBadge";
import { useEffect, useRef, useState } from "react";
import { animateCountUp } from "@/hooks/useGsapTimeline";
import { prefersReducedMotion } from "@/animations/motion-presets";
import { ArrowLeft, Copy, AlertCircle } from "lucide-react";
import { fetchScanById } from "@/lib/scan-api";
import { ScanResult } from "@/types";

export default function HistoryDetailPage() {
  const { id } = useParams();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing scan id.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const loadDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const scan = await fetchScanById(id);
        if (!cancelled) setResult(scan);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load scan detail.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="h-full overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="h-5 w-36 rounded bg-muted/60 animate-pulse" />
            <div className="h-7 w-48 rounded bg-muted/60 animate-pulse" />
            <div className="h-24 rounded-lg bg-muted/60 animate-pulse" />
            <div className="h-24 rounded-lg bg-muted/60 animate-pulse" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !result) {
    return (
      <AppShell>
        <div className="h-full flex items-center justify-center p-6">
          <div className="max-w-md text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm mb-3">{error || "Scan not found."}</p>
            <Link to="/history" className="text-sm text-primary hover:underline">Back to history</Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Link to="/history" className="inline-flex items-center gap-1 text-2xs text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-3 w-3" /> Back to history
          </Link>

          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Scan #{id}</h1>
          <p className="text-sm text-muted-foreground mb-6 capitalize">
            {result.language} · {result.stats.linesScanned} lines · {result.stats.scanDuration}s
          </p>

          <MetricRow stats={result.stats} />

          {/* Findings */}
          <div className="mt-8 space-y-2">
            <h2 className="text-lg font-semibold text-foreground mb-3">Findings</h2>
            {result.findings.map((f, i) => (
              <motion.div
                key={f.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i}
                className="p-3.5 rounded-lg border border-border bg-card hover:border-border/80 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-sm font-medium text-foreground">{f.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto font-mono">L{f.line}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Diff */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Diff</h2>
              <button
                onClick={() => navigator.clipboard.writeText(result.improvedCode)}
                className="flex items-center gap-1 text-2xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="h-3 w-3" /> Copy patch
              </button>
            </div>
            <div className="rounded-lg border border-border overflow-hidden font-mono text-xs leading-5">
              {result.originalCode.split("\n").slice(0, 12).map((line, i) => (
                <div key={i} className="flex" style={{ backgroundColor: "hsl(var(--diff-del-bg))" }}>
                  <span className="w-8 text-right pr-2 select-none shrink-0 border-r text-2xs tabular-nums" style={{ color: "hsl(var(--muted-foreground) / 0.3)", backgroundColor: "hsl(var(--diff-del-gutter))", borderColor: "hsl(var(--border))" }}>{i+1}</span>
                  <span className="px-1.5 text-diff-del-text whitespace-pre"><span className="select-none mr-1 opacity-40">−</span>{line}</span>
                </div>
              ))}
              <div className="px-3 py-1 text-center text-2xs text-muted-foreground/40 border-y border-border" style={{ backgroundColor: "hsl(var(--diff-hunk))" }}>⋯</div>
              {result.improvedCode.split("\n").slice(0, 12).map((line, i) => (
                <div key={i} className="flex" style={{ backgroundColor: "hsl(var(--diff-add-bg))" }}>
                  <span className="w-8 text-right pr-2 select-none shrink-0 border-r text-2xs tabular-nums" style={{ color: "hsl(var(--muted-foreground) / 0.3)", backgroundColor: "hsl(var(--diff-add-gutter))", borderColor: "hsl(var(--border))" }}>{i+1}</span>
                  <span className="px-1.5 text-diff-add-text whitespace-pre"><span className="select-none mr-1 opacity-40">+</span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}

function MetricRow({ stats }: { stats: ScanResult["stats"] }) {
  const refs = {
    critical: useRef<HTMLSpanElement>(null),
    high: useRef<HTMLSpanElement>(null),
    medium: useRef<HTMLSpanElement>(null),
    total: useRef<HTMLSpanElement>(null),
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (refs.critical.current) refs.critical.current.textContent = String(stats.critical);
      if (refs.high.current) refs.high.current.textContent = String(stats.high);
      if (refs.medium.current) refs.medium.current.textContent = String(stats.medium);
      if (refs.total.current) refs.total.current.textContent = String(stats.total);
      return;
    }
    if (refs.critical.current) animateCountUp(refs.critical.current, stats.critical);
    if (refs.high.current) animateCountUp(refs.high.current, stats.high);
    if (refs.medium.current) animateCountUp(refs.medium.current, stats.medium);
    if (refs.total.current) animateCountUp(refs.total.current, stats.total);
  }, [stats]);

  const metrics = [
    { ref: refs.critical, label: "Critical", color: "text-severity-critical", bg: "bg-severity-critical/10" },
    { ref: refs.high, label: "High", color: "text-severity-high", bg: "bg-severity-high/10" },
    { ref: refs.medium, label: "Medium", color: "text-severity-medium", bg: "bg-severity-medium/10" },
    { ref: refs.total, label: "Total", color: "text-foreground", bg: "bg-muted" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {metrics.map((m) => (
        <div key={m.label} className={`rounded-lg p-3 text-center ${m.bg}`}>
          <span ref={m.ref} className={`text-2xl font-bold font-mono leading-none ${m.color}`}>0</span>
          <div className="text-2xs text-muted-foreground mt-1">{m.label}</div>
        </div>
      ))}
    </div>
  );
}
