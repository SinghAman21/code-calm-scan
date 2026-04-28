import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Zap, Code2, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { duration } from "@/animations/motion-presets";

const STEPS = [
  {
    icon: Shield,
    title: "Welcome to CodeAudit",
    desc: "An intelligent code audit workspace. Find vulnerabilities, bugs, and quality issues in seconds — entirely on your machine.",
  },
  {
    icon: Zap,
    title: "How it works",
    desc: "Paste your code snippet, select a language, and hit Scan. The engine analyzes 50+ patterns covering SQL injection, XSS, weak crypto, and more.",
  },
  {
    icon: Lock,
    title: "Privacy by design",
    desc: "Everything runs locally. No code ever leaves your machine. No telemetry, no cloud storage, no third-party access.",
  },
  {
    icon: Code2,
    title: "Ready to start",
    desc: "Open the scanner to paste your first snippet, or try a preset in the Playground to see it in action.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const current = STEPS[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6"
    >
      <div className="pointer-events-none absolute inset-0 ink-grid opacity-25" />
      <div className="panel-shell relative max-w-4xl w-full overflow-hidden rounded-[2.2rem]">
        <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
          <div className="border-b border-border/70 p-8 lg:border-b-0 lg:border-r">
            <div className="panel-title">Onboarding</div>
            <h2 className="mt-4 text-[clamp(2.2rem,4vw,4rem)] font-display uppercase leading-[0.9] tracking-[-0.1em] text-foreground">
              Enter the
              <br />
              audit room.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              A short guided sequence for developers who want the product language before the first scan.
            </p>
          </div>

          <div className="p-8">
        <div className="mb-10 flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-[4px] rounded-full transition-all duration-300",
                i === step ? "w-10 bg-primary" : i < step ? "w-4 bg-primary/40" : "w-4 bg-border"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: duration.normal }}
            className="text-center"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-primary/20 bg-primary/10">
              <current.icon className="h-7 w-7 text-primary" strokeWidth={1.6} />
            </div>
            <h1 className="mb-2 text-2xl font-display uppercase tracking-[-0.08em] text-foreground">{current.title}</h1>
            <p className="mb-8 text-[14px] leading-relaxed text-muted-foreground text-balance">{current.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors duration-150"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="magnetic-hover flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/app")}
              className="magnetic-hover flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground"
            >
              Open scanner <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
