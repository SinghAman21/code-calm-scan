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
      className="min-h-screen bg-background flex items-center justify-center p-6"
    >
      <div className="max-w-sm w-full">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-10 justify-center">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-[3px] rounded-full transition-all duration-300",
                i === step ? "w-8 bg-primary" : i < step ? "w-3 bg-primary/40" : "w-3 bg-border"
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
            <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5">
              <current.icon className="h-7 w-7 text-primary" strokeWidth={1.6} />
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight mb-2">{current.title}</h1>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-8 text-balance">{current.desc}</p>
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:brightness-110 active:scale-[0.97] transition-all duration-150"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/app")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:brightness-110 active:scale-[0.97] transition-all duration-150"
            >
              Open scanner <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
