import { motion } from "framer-motion";
import { pageTransition } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { CodeEditorPanel } from "@/components/scan/CodeEditorPanel";
import { FindingsPanel } from "@/components/scan/FindingsPanel";
import { DiffPanel } from "@/components/scan/DiffPanel";

export default function AppWorkspace() {
  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full grid grid-cols-[1fr_320px_1fr] min-h-0">
        <CodeEditorPanel />
        <FindingsPanel />
        <DiffPanel />
      </motion.div>
    </AppShell>
  );
}
