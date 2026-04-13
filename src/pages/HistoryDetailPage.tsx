import { motion } from "framer-motion";
import { pageTransition, fadeUp } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { useParams } from "react-router-dom";
import { MOCK_SCAN_RESULT } from "@/data/mock-data";
import { SeverityBadge } from "@/components/scan/SeverityBadge";
import { useEffect, useRef } from "react";
import { animateCountUp } from "@/hooks/useGsapTimeline";

export default function HistoryDetailPage() {
  const { id } = useParams();
  const result = MOCK_SCAN_RESULT; // Mock: always return same result

  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-2">Scan #{id}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {result.language} · {result.stats.linesScanned} lines · {result.stats.scanDuration}s
          </p>

          <MetricRow stats={result.stats} />

          <div className="mt-8 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Findings</h2>
            {result.findings.map((f, i) => (
              <motion.div
                key={f.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i}
                className="p-4 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <SeverityBadge severity={f.severity} />
                  <span className="text-sm font-medium text-foreground">{f.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">Line {f.line}</span>
                </div>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">Diff</h2>
            <div className="rounded-lg border border-border overflow-hidden font-mono text-xs">
              {result.originalCode.split("\n").slice(0, 15).map((line, i) => (
                <div key={i} className="flex bg-destructive/5 text-destructive/70 px-3 py-0.5">
                  <span className="w-6 text-right mr-2 text-muted-foreground/50 select-none">{i+1}</span>
                  - {line}
                </div>
              ))}
              <div className="bg-muted/30 text-center py-1 text-muted-foreground">···</div>
              {result.improvedCode.split("\n").slice(0, 15).map((line, i) => (
                <div key={i} className="flex bg-success/5 text-success/70 px-3 py-0.5">
                  <span className="w-6 text-right mr-2 text-muted-foreground/50 select-none">{i+1}</span>
                  + {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}

function MetricRow({ stats }: { stats: typeof MOCK_SCAN_RESULT.stats }) {
  const critRef = useRef<HTMLSpanElement>(null);
  const highRef = useRef<HTMLSpanElement>(null);
  const medRef = useRef<HTMLSpanElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (critRef.current) animateCountUp(critRef.current, stats.critical);
    if (highRef.current) animateCountUp(highRef.current, stats.high);
    if (medRef.current) animateCountUp(medRef.current, stats.medium);
    if (totalRef.current) animateCountUp(totalRef.current, stats.total);
  }, [stats]);

  const metrics = [
    { ref: critRef, label: "Critical", color: "text-severity-critical" },
    { ref: highRef, label: "High", color: "text-severity-high" },
    { ref: medRef, label: "Medium", color: "text-severity-medium" },
    { ref: totalRef, label: "Total", color: "text-foreground" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-lg border border-border p-4 bg-card text-center">
          <span ref={m.ref} className={`text-3xl font-bold font-mono ${m.color}`}>0</span>
          <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
        </div>
      ))}
    </div>
  );
}
