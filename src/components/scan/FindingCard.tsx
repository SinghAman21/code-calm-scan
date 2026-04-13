import { Finding } from "@/types";
import { SeverityBadge } from "./SeverityBadge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { staggerItem } from "@/animations/motion-presets";
import { ShieldAlert, Bug, Sparkles } from "lucide-react";

const categoryConfig = {
  vulnerability: { icon: ShieldAlert, label: "Vuln" },
  bug: { icon: Bug, label: "Bug" },
  "code-smell": { icon: Sparkles, label: "Smell" },
} as const;

interface FindingCardProps {
  finding: Finding;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function FindingCard({ finding, isSelected, onClick, index }: FindingCardProps) {
  const { icon: Icon } = categoryConfig[finding.category];

  return (
    <motion.button
      variants={staggerItem}
      custom={index}
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-md border transition-all duration-150",
        "hover:bg-accent/60 group",
        isSelected
          ? "border-primary/30 bg-primary/[0.06] shadow-[0_0_0_1px_hsl(var(--primary)/0.1)]"
          : "border-transparent hover:border-border"
      )}
    >
      <div className="flex items-start gap-2">
        <div className={cn(
          "mt-0.5 p-1 rounded shrink-0",
          isSelected ? "bg-primary/10" : "bg-muted"
        )}>
          <Icon className={cn("h-3 w-3", isSelected ? "text-primary" : "text-muted-foreground")} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-[13px] leading-snug mb-1 truncate",
            isSelected ? "text-foreground font-medium" : "text-foreground/90"
          )}>
            {finding.title}
          </p>
          <div className="flex items-center gap-1.5">
            <SeverityBadge severity={finding.severity} />
            <span className="text-2xs text-muted-foreground font-mono">L{finding.line}</span>
            <span className="text-2xs text-muted-foreground/60">·</span>
            <span className="text-2xs text-muted-foreground font-mono">{finding.confidence}%</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
