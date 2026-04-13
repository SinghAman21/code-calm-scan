import { AppShell } from "@/components/layout/AppShell";
import { WorkspaceContainer } from "@/components/layout/Containers";
import { CodeEditorPanel } from "@/components/scan/CodeEditorPanel";
import { FindingsPanel } from "@/components/scan/FindingsPanel";
import { DiffPanel } from "@/components/scan/DiffPanel";
import { ScanButton } from "@/components/scan/ScanButton";
import { useScan } from "@/hooks/useScanStore";
import { VULNERABLE_JS_CODE } from "@/data/mock-data";
import { FlaskConical } from "lucide-react";

const PRESETS = [
  { label: "SQL Injection", lang: "javascript" as const },
  { label: "XSS Attack", lang: "javascript" as const },
  { label: "Hardcoded Secrets", lang: "python" as const },
];

export default function PlaygroundPage() {
  const { setCode, setLanguage } = useScan();

  return (
    <AppShell>
      <WorkspaceContainer className="flex flex-col">
        {/* Playground bar */}
        <div className="h-10 px-4 border-b border-border flex items-center gap-3 shrink-0" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
          <FlaskConical className="h-3.5 w-3.5 text-primary" />
          <span className="text-[13px] font-medium text-foreground">Playground</span>
          <div className="w-px h-4 bg-border mx-1" />
          <div className="flex gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => { setCode(VULNERABLE_JS_CODE); setLanguage(p.lang); }}
                className="px-2 py-0.5 text-2xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <ScanButton />
        </div>

        {/* Panels */}
        <div className="flex-1 grid grid-cols-[1fr_260px_1fr] min-h-0">
          <CodeEditorPanel />
          <FindingsPanel />
          <DiffPanel />
        </div>
      </WorkspaceContainer>
    </AppShell>
  );
}
