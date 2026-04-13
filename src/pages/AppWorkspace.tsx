import { AppShell } from "@/components/layout/AppShell";
import { WorkspaceContainer } from "@/components/layout/Containers";
import { CodeEditorPanel } from "@/components/scan/CodeEditorPanel";
import { FindingsPanel } from "@/components/scan/FindingsPanel";
import { DiffPanel } from "@/components/scan/DiffPanel";

export default function AppWorkspace() {
  return (
    <AppShell>
      <WorkspaceContainer className="grid grid-cols-[1fr_280px_1fr] min-h-0">
        <CodeEditorPanel />
        <FindingsPanel />
        <DiffPanel />
      </WorkspaceContainer>
    </AppShell>
  );
}
