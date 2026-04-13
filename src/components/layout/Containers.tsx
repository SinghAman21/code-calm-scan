import { motion } from "framer-motion";
import { pageTransition } from "@/animations/motion-presets";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      className={cn("min-h-screen bg-background", className)}
    >
      {children}
    </motion.div>
  );
}

export function SectionContainer({ children, className }: PageContainerProps) {
  return (
    <section className={cn("py-16 md:py-24 px-6", className)}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

export function SectionHeading({ children, className }: PageContainerProps) {
  return (
    <h2 className={cn("text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-10", className)}>
      {children}
    </h2>
  );
}

export function WorkspaceContainer({ children, className }: PageContainerProps) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      className={cn("h-full", className)}
    >
      {children}
    </motion.div>
  );
}
