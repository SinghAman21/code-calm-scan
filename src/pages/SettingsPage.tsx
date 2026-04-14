import { motion } from "framer-motion";
import { pageTransition, fadeUp } from "@/animations/motion-presets";
import { AppShell } from "@/components/layout/AppShell";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const {
    theme,
    toggleTheme,
    uiFontSize,
    setUiFontSize,
    editorFontSize,
    setEditorFontSize,
  } = useTheme();

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
        {
          label: "UI Font Size",
          desc: "Adjust text size across the interface",
          control: (
            <NumberStepper
              value={uiFontSize}
              min={13}
              max={18}
              onChange={setUiFontSize}
            />
          ),
        },
        {
          label: "Editor Font Size",
          desc: "Code editor font size in pixels",
          control: (
            <NumberStepper
              value={editorFontSize}
              min={12}
              max={20}
              onChange={setEditorFontSize}
            />
          ),
        },
        { label: "Word Wrap", desc: "Wrap long lines in editor", control: <StatusPill active>On</StatusPill> },
        { label: "Minimap", desc: "Show code minimap", control: <StatusPill active={false}>Off</StatusPill> },
      ],
    },
    {
      title: "Scan Behavior",
      items: [
        { label: "Auto-scan on paste", desc: "Automatically start scanning when code is pasted", control: <StatusPill active={false}>Off</StatusPill> },
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
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Settings</h1>
          <p className="text-sm text-muted-foreground mb-8">Configure the scanner and editor preferences.</p>

          <div className="space-y-6">
            {sections.map((section, si) => (
              <motion.div key={section.title} variants={fadeUp} initial="hidden" animate="visible" custom={si}>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{section.title}</h2>
                <div className="rounded-lg border border-border bg-card divide-y divide-border">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3 px-4 py-3.5">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                      <div className="shrink-0">{item.control}</div>
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
        "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
        checked ? "bg-primary" : "bg-border"
      )}
    >
      <span className={cn(
        "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform duration-200",
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      )} />
    </button>
  );
}

function NumberStepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-7 w-7 rounded-md border border-border text-sm hover:bg-accent"
      >
        -
      </button>
      <span className="min-w-10 text-center text-xs text-foreground font-mono tabular-nums">{value}px</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="h-7 w-7 rounded-md border border-border text-sm hover:bg-accent"
      >
        +
      </button>
    </div>
  );
}

function StatusPill({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span className={cn(
      "text-xs font-medium px-2 py-0.5 rounded",
      active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
    )}>
      {children}
    </span>
  );
}
