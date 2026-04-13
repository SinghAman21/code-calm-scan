import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Zap, Code2, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Shield,
    title: "Welcome to CodeAudit",
    desc: "An intelligent code audit workspace that finds vulnerabilities, bugs, and code quality issues — instantly.",
  },
  {
    icon: Zap,
    title: "How scanning works",
    desc: "Paste your code, select a language, and click Scan. Our engine analyzes your snippet for 50+ vulnerability patterns, common bugs, and anti-patterns.",
  },
  {
    icon: Lock,
    title: "Your code stays private",
    desc: "Everything runs locally. No code leaves your machine, no telemetry, no cloud storage. Your code is yours.",
  },
  {
    icon: Code2,
    title: "Try it now",
    desc: "Head to the workspace to paste your first snippet, or try a preset in the Playground.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const current = STEPS[step];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8 justify-center">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === step ? "w-8 bg-primary" : "w-2 bg-border"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <current.icon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">{current.title}</h1>
            <p className="text-muted-foreground mb-8 text-balance">{current.desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/app")}
              className="flex items-center gap-1 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Enter workspace <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
