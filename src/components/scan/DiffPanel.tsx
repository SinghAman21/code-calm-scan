import { useScan } from "@/hooks/useScanStore";
import { cn } from "@/lib/utils";
import { FileSearch, Copy, Check, Info, GitCompareArrows, Code2, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { duration } from "@/animations/motion-presets";
import { SeverityBadge } from "./SeverityBadge";

type TabId = "summary" | "diff" | "improved" | "explanation";

const TABS: { id: TabId; label: string; icon: typeof Info }[] = [
  { id: "summary", label: "Summary", icon: Info },
  { id: "diff", label: "Diff", icon: GitCompareArrows },
  { id: "improved", label: "Fixed", icon: Code2 },
  { id: "explanation", label: "Details", icon: BookOpen },
];

export function DiffPanel() {
  const { result, selectedFinding } = useScan();
  const [activeTab, setActiveTab] = useState<TabId>("summary");

  // Auto-switch to explanation when a finding is selected
  useEffect(() => {
    if (selectedFinding) setActiveTab("explanation");
  }, [selectedFinding]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.normal, delay: 0.2 }}
      className="flex flex-col h-full"
    >
      {/* Tabs */}
      <div className="h-9 flex items-center border-b border-border px-1 shrink-0" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 text-2xs font-medium rounded-[3px] transition-colors duration-150 relative",
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-3 w-3" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.span
                layoutId="diff-tab-indicator"
                className="absolute -bottom-[5px] left-1 right-1 h-[2px] bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!result ? (
          <DiffEmptyState />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === "summary" && <SummaryTab />}
              {activeTab === "diff" && <DiffTab />}
              {activeTab === "improved" && <ImprovedTab />}
              {activeTab === "explanation" && <ExplanationTab />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

function DiffEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-3">
        <FileSearch className="h-5 w-5 text-muted-foreground/50" />
      </div>
      <p className="text-[13px] text-muted-foreground font-medium mb-1">Awaiting scan results</p>
      <p className="text-xs text-muted-foreground/70 leading-relaxed">
        Run a scan to view findings summary, diffs, and improved code.
      </p>
    </div>
  );
}

function SummaryTab() {
  const { result, selectedFinding } = useScan();
  if (!result) return null;

  const stats = [
    { label: "Critical", value: result.stats.critical, color: "text-severity-critical", bg: "bg-severity-critical/10" },
    { label: "High", value: result.stats.high, color: "text-severity-high", bg: "bg-severity-high/10" },
    { label: "Medium", value: result.stats.medium, color: "text-severity-medium", bg: "bg-severity-medium/10" },
    { label: "Low", value: result.stats.low, color: "text-severity-low", bg: "bg-severity-low/10" },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Severity grid */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div key={s.label} className={cn("rounded-lg p-2.5 text-center", s.bg)}>
            <div className={cn("text-xl font-bold font-mono leading-none mb-0.5", s.color)}>{s.value}</div>
            <div className="text-2xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Meta */}
      <div className="rounded-lg border border-border p-3 space-y-1.5" style={{ backgroundColor: "hsl(var(--surface-inset))" }}>
        <MetaRow label="Lines scanned" value={String(result.stats.linesScanned)} mono />
        <MetaRow label="Duration" value={`${result.stats.scanDuration}s`} mono />
        <MetaRow label="Language" value={result.language} />
        <MetaRow label="Total issues" value={String(result.stats.total)} mono />
      </div>

      {/* Selected finding preview */}
      {selectedFinding && (
        <div className="rounded-lg border border-primary/15 p-3" style={{ backgroundColor: "hsl(var(--primary) / 0.04)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <SeverityBadge severity={selectedFinding.severity} />
            <span className="text-[13px] font-medium text-foreground truncate">{selectedFinding.title}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{selectedFinding.description}</p>
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-2xs text-muted-foreground">{label}</span>
      <span className={cn("text-2xs text-foreground", mono && "font-mono tabular-nums")}>{value}</span>
    </div>
  );
}

function DiffTab() {
  const { result } = useScan();
  if (!result) return null;

  const origLines = result.originalCode.split("\n");
  const fixedLines = result.improvedCode.split("\n");

  return (
    <div className="font-mono text-xs leading-5">
      {/* Diff header */}
      <div className="px-3 py-2 border-b border-border flex items-center gap-2" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
        <span className="text-diff-del-text">--- a/source.js</span>
        <span className="text-muted-foreground/40">→</span>
        <span className="text-diff-add-text">+++ b/source.js</span>
      </div>

      {/* Hunk header */}
      <div className="px-3 py-1 text-2xs text-muted-foreground border-b border-border" style={{ backgroundColor: "hsl(var(--diff-hunk))" }}>
        @@ -1,{Math.min(origLines.length, 20)} +1,{Math.min(fixedLines.length, 20)} @@
      </div>

      {/* Removals */}
      <div className="overflow-x-auto">
        {origLines.slice(0, 20).map((line, i) => (
          <div key={`d-${i}`} className="flex" style={{ backgroundColor: "hsl(var(--diff-del-bg))" }}>
            <span className="w-10 text-right pr-2 select-none shrink-0 border-r" style={{ color: "hsl(var(--muted-foreground) / 0.4)", backgroundColor: "hsl(var(--diff-del-gutter))", borderColor: "hsl(var(--border))" }}>
              {i + 1}
            </span>
            <span className="px-1.5 text-diff-del-text select-all whitespace-pre">
              <span className="select-none mr-1 text-diff-del-text/50">−</span>{line}
            </span>
          </div>
        ))}

        {/* Hunk separator */}
        <div className="px-3 py-1.5 text-center text-2xs text-muted-foreground/50 border-y border-border" style={{ backgroundColor: "hsl(var(--diff-hunk))" }}>
          ⋯ expanded ⋯
        </div>

        {/* Additions */}
        {fixedLines.slice(0, 20).map((line, i) => (
          <div key={`a-${i}`} className="flex" style={{ backgroundColor: "hsl(var(--diff-add-bg))" }}>
            <span className="w-10 text-right pr-2 select-none shrink-0 border-r" style={{ color: "hsl(var(--muted-foreground) / 0.4)", backgroundColor: "hsl(var(--diff-add-gutter))", borderColor: "hsl(var(--border))" }}>
              {i + 1}
            </span>
            <span className="px-1.5 text-diff-add-text select-all whitespace-pre">
              <span className="select-none mr-1 text-diff-add-text/50">+</span>{line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImprovedTab() {
  const { result } = useScan();
  const [copied, setCopied] = useState(false);
  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.improvedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between shrink-0" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
        <span className="text-2xs text-muted-foreground font-medium uppercase tracking-wider">Fixed code</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-2xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="flex-1 overflow-auto" style={{ backgroundColor: "hsl(var(--code-bg))" }}>
        <pre className="p-3 text-xs font-mono leading-5 text-foreground/90 whitespace-pre">
          {result.improvedCode.split("\n").map((line, i) => (
            <div key={i} className="flex hover:bg-accent/30 transition-colors duration-100">
              <span className="w-8 text-right pr-2 select-none text-muted-foreground/30 shrink-0 tabular-nums text-2xs">{i + 1}</span>
              <span>{line}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function ExplanationTab() {
  const { selectedFinding, result } = useScan();
  const finding = selectedFinding || result?.findings[0];

  if (!finding) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-xs text-muted-foreground">Select a finding from the panel to see its details.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <SeverityBadge severity={finding.severity} />
          <span className="text-2xs text-muted-foreground font-mono">{finding.ruleId}</span>
        </div>
        <h3 className="text-[15px] font-semibold text-foreground mb-2 leading-snug">{finding.title}</h3>
        <p className="text-[13px] text-muted-foreground leading-relaxed">{finding.explanation}</p>
      </div>

      <div className="rounded-lg border border-border p-3" style={{ backgroundColor: "hsl(var(--surface-inset))" }}>
        <div className="text-2xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">Recommendation</div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">{finding.suggestion}</p>
      </div>

      <div className="flex items-center gap-4 text-2xs text-muted-foreground pt-1 border-t border-border">
        <span>Line <span className="font-mono text-foreground">{finding.line}</span></span>
        <span>Confidence <span className="font-mono text-foreground">{finding.confidence}%</span></span>
        <span className="capitalize">{finding.category.replace("-", " ")}</span>
      </div>
    </div>
  );
}
