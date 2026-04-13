import { motion } from "framer-motion";
import { pageTransition, staggerContainer, staggerItem } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { MOCK_RULES } from "@/data/mock-data";
import { SeverityBadge } from "@/components/scan/SeverityBadge";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["all", "injection", "auth", "crypto", "secrets", "unsafe-apis", "quality"];

export default function RulesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filtered = activeCategory === "all" ? MOCK_RULES : MOCK_RULES.filter((r) => r.category === activeCategory);

  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-6">Detection Rules</h1>

          <div className="flex gap-1 mb-6 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-lg font-medium capitalize transition-colors relative",
                  activeCategory === c
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {c === "unsafe-apis" ? "Unsafe APIs" : c}
              </button>
            ))}
          </div>

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" key={activeCategory} className="grid md:grid-cols-2 gap-4">
            {filtered.map((rule) => (
              <motion.div
                key={rule.id}
                variants={staggerItem}
                className="rounded-xl border border-border p-5 bg-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs font-mono text-primary">{rule.id}</code>
                  <SeverityBadge severity={rule.severity} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{rule.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{rule.description}</p>

                <div className="space-y-2">
                  <div className="rounded-lg overflow-hidden border border-destructive/20">
                    <div className="px-2 py-1 text-[10px] text-destructive bg-destructive/5 font-medium">Unsafe</div>
                    <pre className="px-3 py-2 text-xs font-mono text-foreground/80 overflow-x-auto">{rule.unsafeExample}</pre>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-success/20">
                    <div className="px-2 py-1 text-[10px] text-success bg-success/5 font-medium">Safe</div>
                    <pre className="px-3 py-2 text-xs font-mono text-foreground/80 overflow-x-auto">{rule.safeExample}</pre>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AppShell>
  );
}
