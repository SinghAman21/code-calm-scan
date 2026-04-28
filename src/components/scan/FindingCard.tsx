import { Finding } from "@/types";
import { SeverityBadge } from "./SeverityBadge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { staggerItem, bloomBorder, bloomElevation } from "@/animations/motion-presets";
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
      animate={isSelected ? "selected" : "idle"}
      className={cn(
        "group w-full rounded-[1.4rem] border text-left transition-colors duration-150",
        isSelected
          ? "border-primary/30 bg-primary/[0.08]"
          : "border-border/60 bg-background/35 hover:border-border hover:bg-accent/30"
      )}
    >
      <motion.div
        variants={bloomBorder}
        initial="idle"
        animate={isSelected ? "selected" : "idle"}
        className="relative"
      >
        <motion.div
          variants={bloomElevation}
          initial="idle"
          animate={isSelected ? "selected" : "idle"}
        >
          <div className="flex items-start gap-3 p-3.5">
            <div className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border transition-colors duration-150",
              isSelected ? "border-primary/25 bg-primary/12" : "border-border/70 bg-muted/45"
            )}>
              <Icon className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "mb-1 line-clamp-2 text-[13px] leading-snug",
                isSelected ? "text-foreground font-medium" : "text-foreground/90"
              )}>
                {finding.title}
              </p>
              <div className="mb-2 flex items-center gap-1.5">
                <SeverityBadge severity={finding.severity} />
                <span className="text-2xs text-muted-foreground font-mono">L{finding.line}</span>
                <span className="text-2xs text-muted-foreground/60">·</span>
                <span className="text-2xs text-muted-foreground font-mono">{finding.confidence}%</span>
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {categoryConfig[finding.category].label} signal
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
