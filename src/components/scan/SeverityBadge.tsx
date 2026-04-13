import { Severity } from "@/types";
import { cn } from "@/lib/utils";

const severityConfig: Record<Severity, { label: string; dotClass: string; textClass: string }> = {
  critical: { label: "Critical", dotClass: "bg-severity-critical", textClass: "text-severity-critical" },
  high: { label: "High", dotClass: "bg-severity-high", textClass: "text-severity-high" },
  medium: { label: "Medium", dotClass: "bg-severity-medium", textClass: "text-severity-medium" },
  low: { label: "Low", dotClass: "bg-severity-low", textClass: "text-severity-low" },
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const config = severityConfig[severity];
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-2xs font-medium",
      "bg-muted/80",
      config.textClass,
      className
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}
