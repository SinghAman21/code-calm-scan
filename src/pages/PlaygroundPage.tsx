import { motion } from "framer-motion";
import { pageTransition } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { CodeEditorPanel } from "@/components/scan/CodeEditorPanel";
import { FindingsPanel } from "@/components/scan/FindingsPanel";
import { DiffPanel } from "@/components/scan/DiffPanel";
import { ScanButton } from "@/components/scan/ScanButton";
import { useScan } from "@/hooks/useScanStore";
import { VULNERABLE_JS_CODE } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const PRESETS = [
  { label: "SQL Injection", lang: "javascript" as const },
  { label: "XSS Attack", lang: "javascript" as const },
  { label: "Hardcoded Secrets", lang: "python" as const },
];

export default function PlaygroundPage() {
  const { setCode, setLanguage } = useScan();

  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
          <span className="text-sm font-medium text-foreground">Playground</span>
          <div className="flex gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => { setCode(VULNERABLE_JS_CODE); setLanguage(p.lang); }}
                className="px-2.5 py-1 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <ScanButton />
        </div>
        <div className="flex-1 grid grid-cols-[1fr_300px_1fr] min-h-0">
          <CodeEditorPanel />
          <FindingsPanel />
          <DiffPanel />
        </div>
      </motion.div>
    </AppShell>
  );
}
