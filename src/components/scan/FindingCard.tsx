import { Finding } from "@/types";
import { SeverityBadge } from "./SeverityBadge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { staggerItem } from "@/animations/motion-presets";
import { AlertTriangle, Bug, Code2 } from "lucide-react";

const categoryIcons = {
  vulnerability: AlertTriangle,
  bug: Bug,
  "code-smell": Code2,
};

interface FindingCardProps {
  finding: Finding;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function FindingCard({ finding, isSelected, onClick, index }: FindingCardProps) {
  const Icon = categoryIcons[finding.category];

  return (
    <motion.button
      variants={staggerItem}
      custom={index}
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-colors duration-150",
        "hover:bg-accent/50",
        isSelected
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-start gap-2.5">
        <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-foreground truncate">{finding.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <SeverityBadge severity={finding.severity} />
            <span className="text-xs text-muted-foreground">Line {finding.line}</span>
            <span className="text-xs text-muted-foreground">{finding.confidence}%</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
