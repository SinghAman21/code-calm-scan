import { motion, AnimatePresence } from "framer-motion";
import { pageTransition, staggerContainer, staggerItem } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { MOCK_RULES } from "@/data/mock-data";
import { SeverityBadge } from "@/components/scan/SeverityBadge";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "injection", label: "Injection" },
  { id: "auth", label: "Auth" },
  { id: "crypto", label: "Crypto" },
  { id: "secrets", label: "Secrets" },
  { id: "unsafe-apis", label: "Unsafe APIs" },
  { id: "quality", label: "Quality" },
];

export default function RulesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const filtered = activeCategory === "all" ? MOCK_RULES : MOCK_RULES.filter((r) => r.category === activeCategory);

  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">Detection Rules</h1>
          <p className="text-[13px] text-muted-foreground mb-6">Browse the patterns CodeAudit scans for.</p>

          {/* Category tabs */}
          <div className="flex gap-0.5 mb-6 p-0.5 rounded-lg bg-muted/50 w-fit">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={cn(
                  "px-3 py-1.5 text-2xs rounded-md font-medium transition-all duration-150 relative",
                  activeCategory === c.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="grid md:grid-cols-2 gap-3"
            >
              {filtered.map((rule) => (
                <motion.div
                  key={rule.id}
                  variants={staggerItem}
                  className="rounded-lg border border-border p-4 bg-card hover:border-border/80 transition-colors duration-150"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-2xs font-mono text-primary/80">{rule.id}</code>
                    <SeverityBadge severity={rule.severity} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-foreground mb-1">{rule.name}</h3>
                  <p className="text-2xs text-muted-foreground leading-relaxed mb-3">{rule.description}</p>

                  <div className="space-y-1.5">
                    <CodeBlock type="unsafe" code={rule.unsafeExample} />
                    <CodeBlock type="safe" code={rule.safeExample} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AppShell>
  );
}

function CodeBlock({ type, code }: { type: "unsafe" | "safe"; code: string }) {
  const isUnsafe = type === "unsafe";
  return (
    <div className={cn(
      "rounded-md overflow-hidden border",
      isUnsafe ? "border-destructive/15" : "border-success/15"
    )}>
      <div className={cn(
        "px-2 py-0.5 text-2xs font-medium",
        isUnsafe ? "bg-destructive/5 text-destructive/70" : "bg-success/5 text-success/70"
      )}>
        {isUnsafe ? "✗ Unsafe" : "✓ Safe"}
      </div>
      <pre className="px-2.5 py-2 text-2xs font-mono text-foreground/75 overflow-x-auto leading-relaxed whitespace-pre-wrap" style={{ backgroundColor: "hsl(var(--code-bg))" }}>
        {code}
      </pre>
    </div>
  );
}
