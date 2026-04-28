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
      <motion.div {...pageTransition} className="h-full overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="panel-shell rounded-[2rem] p-6">
              <div className="panel-title">Detection graph</div>
              <h1 className="mt-3 text-[clamp(2.2rem,4vw,4rem)] font-display uppercase leading-[0.88] tracking-[-0.1em] text-foreground">
                Rules with
                <br />
                visible intent.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                Instead of hiding rule behavior in docs, the atlas shows the unsafe pattern and the safer replacement side by side.
              </p>
            </div>

            <div className="panel-shell rounded-[2rem] p-6">
              <div className="panel-title">Scope</div>
              <div className="mt-4 text-3xl font-display uppercase tracking-[-0.08em] text-foreground">{filtered.length}</div>
              <p className="mt-2 text-sm text-muted-foreground">rules visible in the current category.</p>
            </div>
          </div>

          <div className="mb-6 flex w-fit flex-wrap gap-1 rounded-[1.2rem] border border-border/70 bg-muted/35 p-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={cn(
                  "relative rounded-[0.95rem] px-4 py-2 text-2xs font-medium uppercase tracking-[0.16em] transition-all duration-150",
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
              className="grid gap-4 md:grid-cols-2"
            >
              {filtered.map((rule) => (
                <motion.div
                  key={rule.id}
                  variants={staggerItem}
                  className="panel-shell rounded-[1.8rem] p-5"
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
      "overflow-hidden rounded-[1rem] border",
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
