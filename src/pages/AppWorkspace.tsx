import { AppShell } from "@/components/layout/AppShell";
import { WorkspaceContainer } from "@/components/layout/Containers";
import { CodeEditorPanel } from "@/components/scan/CodeEditorPanel";
import { FindingsPanel } from "@/components/scan/FindingsPanel";
import { DiffPanel } from "@/components/scan/DiffPanel";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useScan } from "@/hooks/useScanStore";
import { useCallback } from "react";

export default function AppWorkspace() {
  const { runScan, result, selectedFinding, setSelectedFinding, setActiveFilter, code, isScanning } = useScan();

  // Navigate findings with arrow keys
  const navigateFindings = useCallback((direction: "up" | "down") => {
    if (!result?.findings.length) return;

    const currentIndex = selectedFinding
      ? result.findings.findIndex((f) => f.id === selectedFinding.id)
      : -1;

    let nextIndex = direction === "down" ? currentIndex + 1 : currentIndex - 1;

    // Wrap around
    if (nextIndex < 0) nextIndex = result.findings.length - 1;
    if (nextIndex >= result.findings.length) nextIndex = 0;

    setSelectedFinding(result.findings[nextIndex]);
  }, [result, selectedFinding, setSelectedFinding]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    "ctrl+k": () => {
      if (!isScanning && code.trim()) runScan();
    },
    "arrowdown": () => navigateFindings("down"),
    "arrowup": () => navigateFindings("up"),
    "/": () => setActiveFilter("all"),
    "escape": () => setSelectedFinding(null),
  });

  return (
    <AppShell>
      <WorkspaceContainer className="grid min-h-0 grid-cols-1 gap-4 p-4 md:p-6 xl:grid-cols-[1.12fr_0.78fr_0.98fr]">
        <CodeEditorPanel />
        <FindingsPanel />
        <DiffPanel />
      </WorkspaceContainer>
    </AppShell>
  );
}
