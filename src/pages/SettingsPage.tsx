import { motion } from "framer-motion";
import { pageTransition, fadeUp } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const sections = [
    {
      title: "Appearance",
      items: [
        {
          label: "Dark Mode",
          desc: "Use dark theme for the interface",
          control: <Toggle checked={theme === "dark"} onChange={toggleTheme} />,
        },
      ],
    },
    {
      title: "Editor",
      items: [
        { label: "Font Size", desc: "Editor font size in pixels", control: <Value>13px</Value> },
        { label: "Word Wrap", desc: "Wrap long lines in editor", control: <StatusPill active>On</StatusPill> },
        { label: "Minimap", desc: "Show code minimap", control: <StatusPill active={false}>Off</StatusPill> },
      ],
    },
    {
      title: "Scan Behavior",
      items: [
        { label: "Auto-scan on paste", desc: "Automatically start scanning when code is pasted", control: <StatusPill active={false}>Off</StatusPill> },
        { label: "Confidence threshold", desc: "Minimum confidence to show findings", control: <Value>70%</Value> },
      ],
    },
    {
      title: "Privacy",
      items: [
        { label: "Local mode", desc: "All processing stays on your machine", control: <StatusPill active>Active</StatusPill> },
        { label: "Telemetry", desc: "Send anonymous usage statistics", control: <StatusPill active={false}>Off</StatusPill> },
      ],
    },
  ];

  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full overflow-y-auto p-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">Settings</h1>
          <p className="text-[13px] text-muted-foreground mb-8">Configure the scanner and editor preferences.</p>

          <div className="space-y-6">
            {sections.map((section, si) => (
              <motion.div key={section.title} variants={fadeUp} initial="hidden" animate="visible" custom={si}>
                <h2 className="text-2xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{section.title}</h2>
                <div className="rounded-lg border border-border bg-card divide-y divide-border">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <div className="text-[13px] text-foreground">{item.label}</div>
                        <div className="text-2xs text-muted-foreground">{item.desc}</div>
                      </div>
                      {item.control}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0",
        checked ? "bg-primary" : "bg-border"
      )}
    >
      <span className={cn(
        "absolute top-0.5 h-4 w-4 rounded-full bg-background shadow-sm transition-transform duration-200",
        checked ? "translate-x-[18px]" : "translate-x-0.5"
      )} />
    </button>
  );
}

function Value({ children }: { children: React.ReactNode }) {
  return <span className="text-2xs text-foreground font-mono tabular-nums">{children}</span>;
}

function StatusPill({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span className={cn(
      "text-2xs font-medium px-1.5 py-0.5 rounded",
      active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
    )}>
      {children}
    </span>
  );
}
