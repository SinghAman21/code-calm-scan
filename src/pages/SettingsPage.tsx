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
          control: (
            <button
              onClick={toggleTheme}
              className={cn(
                "relative w-10 h-5 rounded-full transition-colors",
                theme === "dark" ? "bg-primary" : "bg-border"
              )}
            >
              <span className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-primary-foreground transition-transform",
                theme === "dark" ? "translate-x-5" : "translate-x-0.5"
              )} />
            </button>
          ),
        },
      ],
    },
    {
      title: "Editor",
      items: [
        { label: "Font Size", desc: "Editor font size in pixels", control: <span className="text-sm text-muted-foreground font-mono">13px</span> },
        { label: "Word Wrap", desc: "Wrap long lines in editor", control: <span className="text-xs text-success">On</span> },
        { label: "Minimap", desc: "Show code minimap", control: <span className="text-xs text-muted-foreground">Off</span> },
      ],
    },
    {
      title: "Scan Behavior",
      items: [
        { label: "Auto-scan on paste", desc: "Automatically start scanning when code is pasted", control: <span className="text-xs text-muted-foreground">Off</span> },
        { label: "Confidence threshold", desc: "Minimum confidence to show findings", control: <span className="text-sm text-muted-foreground font-mono">70%</span> },
      ],
    },
    {
      title: "Privacy",
      items: [
        { label: "Local mode", desc: "All processing stays on your machine", control: <span className="text-xs text-success">Active</span> },
        { label: "Telemetry", desc: "Send anonymous usage statistics", control: <span className="text-xs text-muted-foreground">Off</span> },
      ],
    },
  ];

  return (
    <AppShell>
      <motion.div {...pageTransition} className="h-full overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-8">Settings</h1>
          <div className="space-y-8">
            {sections.map((section, si) => (
              <motion.div key={section.title} variants={fadeUp} initial="hidden" animate="visible" custom={si}>
                <h2 className="text-sm font-semibold text-foreground mb-3">{section.title}</h2>
                <div className="rounded-xl border border-border bg-card divide-y divide-border">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4">
                      <div>
                        <div className="text-sm text-foreground">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
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
