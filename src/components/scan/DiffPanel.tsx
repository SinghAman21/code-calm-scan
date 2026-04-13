import { useScan } from "@/hooks/useScanStore";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

export function DiffPanel() {
  const { result, selectedFinding } = useScan();
  const [activeTab, setActiveTab] = useState<"summary" | "diff" | "improved" | "explanation">("summary");

  const tabs = [
    { id: "summary" as const, label: "Summary" },
    { id: "diff" as const, label: "Git Diff" },
    { id: "improved" as const, label: "Improved Code" },
    { id: "explanation" as const, label: "Explanation" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-3 py-2 text-xs font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!result ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">Scan results will appear here</p>
          </div>
        ) : (
          <>
            {activeTab === "summary" && <SummaryTab />}
            {activeTab === "diff" && <DiffTab />}
            {activeTab === "improved" && <ImprovedTab />}
            {activeTab === "explanation" && <ExplanationTab />}
          </>
        )}
      </div>
    </div>
  );
}

function SummaryTab() {
  const { result, selectedFinding } = useScan();
  if (!result) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Critical", value: result.stats.critical, color: "text-severity-critical" },
          { label: "High", value: result.stats.high, color: "text-severity-high" },
          { label: "Medium", value: result.stats.medium, color: "text-severity-medium" },
          { label: "Low", value: result.stats.low, color: "text-severity-low" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border p-3 bg-card">
            <div className={cn("text-2xl font-bold font-mono", s.color)}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border p-3 bg-card space-y-1">
        <div className="text-xs text-muted-foreground">Lines scanned: <span className="text-foreground font-mono">{result.stats.linesScanned}</span></div>
        <div className="text-xs text-muted-foreground">Scan time: <span className="text-foreground font-mono">{result.stats.scanDuration}s</span></div>
        <div className="text-xs text-muted-foreground">Language: <span className="text-foreground capitalize">{result.language}</span></div>
      </div>
      {selectedFinding && (
        <div className="rounded-lg border border-primary/20 p-3 bg-primary/5">
          <div className="text-sm font-medium text-foreground mb-1">{selectedFinding.title}</div>
          <p className="text-xs text-muted-foreground">{selectedFinding.description}</p>
        </div>
      )}
    </div>
  );
}

function DiffTab() {
  const { result } = useScan();
  if (!result) return null;

  const origLines = result.originalCode.split("\n");
  const fixedLines = result.improvedCode.split("\n");

  return (
    <div className="font-mono text-xs space-y-0 rounded-lg border border-border overflow-hidden">
      <div className="bg-card p-2 border-b border-border text-muted-foreground">
        --- original.js → +++ fixed.js
      </div>
      <div className="overflow-x-auto">
        {origLines.slice(0, 20).map((line, i) => (
          <div key={`o-${i}`} className="flex bg-destructive/5 text-destructive/80">
            <span className="w-8 text-right pr-2 select-none text-muted-foreground/50 shrink-0">{i + 1}</span>
            <span className="px-1">- {line}</span>
          </div>
        ))}
        <div className="bg-muted/30 text-center text-muted-foreground py-1">···</div>
        {fixedLines.slice(0, 20).map((line, i) => (
          <div key={`f-${i}`} className="flex bg-success/5 text-success/80">
            <span className="w-8 text-right pr-2 select-none text-muted-foreground/50 shrink-0">{i + 1}</span>
            <span className="px-1">+ {line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImprovedTab() {
  const { result } = useScan();
  if (!result) return null;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="bg-card p-2 border-b border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Improved code</span>
        <button
          onClick={() => navigator.clipboard.writeText(result.improvedCode)}
          className="text-xs text-primary hover:underline"
        >
          Copy
        </button>
      </div>
      <pre className="p-3 text-xs font-mono overflow-x-auto text-foreground/90 leading-relaxed whitespace-pre-wrap">
        {result.improvedCode}
      </pre>
    </div>
  );
}

function ExplanationTab() {
  const { selectedFinding, result } = useScan();
  const finding = selectedFinding || result?.findings[0];

  if (!finding) return <p className="text-sm text-muted-foreground">Select a finding to see its explanation.</p>;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">{finding.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{finding.explanation}</p>
      </div>
      <div className="rounded-lg border border-border p-3 bg-card">
        <div className="text-xs font-medium text-foreground mb-1">Suggestion</div>
        <p className="text-xs text-muted-foreground">{finding.suggestion}</p>
      </div>
      <div className="text-xs text-muted-foreground">
        Rule: <code className="font-mono text-primary">{finding.ruleId}</code> · Confidence: {finding.confidence}%
      </div>
    </div>
  );
}
