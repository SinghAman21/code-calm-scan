import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { pageTransition, fadeUp, staggerContainer, staggerItem } from "@/animations/motion-presets";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Zap,
  Code2,
  ShieldAlert,
  Bug,
  GitCompareArrows,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Fingerprint,
  Cpu,
  Layers3,
  Waypoints,
  Radar,
} from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/data/mock-data";

const trustItems = [
  { icon: Lock, label: "Local-only execution" },
  { icon: Fingerprint, label: "Zero collection layer" },
  { icon: Zap, label: "Fast enough for flow state" },
  { icon: Terminal, label: "Built for code-native teams" },
];

const featureRows = [
  {
    icon: ShieldAlert,
    title: "Security patterns with editorial clarity",
    desc: "Critical issues are staged like lead stories, with line context, confidence, and patch intent visible at once.",
  },
  {
    icon: Bug,
    title: "Bug and quality signals in the same room",
    desc: "Operational risks, correctness failures, and maintainability drift share one narrative instead of fragmented tabs.",
  },
  {
    icon: GitCompareArrows,
    title: "Patch review that respects your architecture",
    desc: "Diffs stay minimal, explainable, and developer-readable so the engine feels collaborative rather than invasive.",
  },
];

export default function LandingPage() {
  return (
    <motion.div {...pageTransition} className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 ink-grid opacity-25" />
      <HeroNav />
      <Hero />
      <TrustStrip />
      <FeatureSpread />
      <ProcessBand />
      <LanguageWall />
      <PrivacyBand />
      <CTAFooter />
    </motion.div>
  );
}

function HeroNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/72 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-primary/20 bg-primary/12 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-sm uppercase tracking-[0.26em] text-foreground">Calm Scan</div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Local Security Desk</div>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/rules" className="text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground">
            Rules
          </Link>
          <Link
            to="/app"
            className="magnetic-hover inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Enter deck
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative px-4 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="relative">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
          >
            <Cpu className="h-3.5 w-3.5 text-primary" />
            Built for developers in review loops
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
            <p aria-hidden="true" className="mb-3 text-[clamp(1rem,1.9vw,1.35rem)] uppercase tracking-[0.65em] text-primary/45">
              scan calm
            </p>
            <h1 className="max-w-5xl text-[clamp(3.6rem,11vw,9.2rem)] font-display uppercase leading-[0.82] tracking-[-0.11em] text-foreground">
              See
              <span className="ml-[0.08em] inline-block text-transparent [-webkit-text-stroke:1px_hsl(var(--foreground)/0.45)]">
                risk
              </span>
              <br />
              before it
              <span className="ml-[0.06em] inline-block italic text-primary">narrates</span>
              your release.
            </h1>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.35} className="mt-8 grid gap-6 lg:grid-cols-[0.78fr_0.22fr]">
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Calm Scan turns static analysis into an atmospheric command room: a place where risky lines, safer fixes,
              and review confidence all arrive with shape, hierarchy, and signal. Everything stays on your machine.
            </p>
            <div className="hidden lg:flex lg:items-end lg:justify-end">
              <div className="rounded-[1.4rem] border border-border/80 px-4 py-3 text-right shadow-[var(--shadow-soft)]" style={{ backgroundColor: "hsl(var(--surface-1) / 0.85)" }}>
                <div className="panel-title">Tone</div>
                <div className="mt-2 text-sm uppercase tracking-[0.22em] text-foreground">Industrial editorial</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.55} className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/app"
              className="magnetic-hover inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground"
            >
              Open scanner
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/history"
              className="magnetic-hover inline-flex items-center gap-2 rounded-full border border-border/80 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground"
              style={{ backgroundColor: "hsl(var(--surface-1) / 0.86)" }}
            >
              View archive
            </Link>
          </motion.div>

          <div aria-hidden="true" className="pointer-events-none absolute -left-6 top-24 hidden text-[12rem] font-display uppercase tracking-[-0.12em] text-primary/[0.04] xl:block">
            CODE
          </div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.65}
          className="relative noise-overlay"
        >
          <div className="panel-shell relative overflow-hidden rounded-[2rem]">
            <div className="grid gap-px bg-border/50 md:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-6 p-5 md:p-6" style={{ backgroundColor: "hsl(var(--surface-2) / 0.88)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="panel-title">Threat board</div>
                    <div className="mt-2 text-xl font-display uppercase tracking-[-0.08em] text-foreground">Session 04</div>
                  </div>
                  <Radar className="h-5 w-5 text-primary/70" />
                </div>

                <div className="space-y-3">
                  <CodeLine n={18} label="critical">{'const query = `SELECT * FROM users WHERE id = ${id}`'}</CodeLine>
                  <CodeLine n={27} label="high">{'const token = Buffer.from(username + ":" + password)'}</CodeLine>
                  <CodeLine n={37}>{'const query = "SELECT * FROM users WHERE id = " + req.params.id'}</CodeLine>
                </div>

                <div className="rounded-[1.4rem] border border-destructive/15 bg-destructive/8 p-4">
                  <div className="mb-1 text-xs uppercase tracking-[0.18em] text-destructive">Line 18 surfaced first</div>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    The system ranks blast radius and exploitability before visual emphasis, so teams act on the right problem first.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden p-5 md:p-6" style={{ backgroundColor: "hsl(var(--surface-1) / 0.92)" }}>
                <svg viewBox="0 0 320 180" className="absolute right-0 top-0 h-full w-full opacity-70" aria-hidden="true">
                  <defs>
                    <linearGradient id="hero-grid" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary) / 0.28)" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path d="M24 24H296V156H24Z" fill="none" stroke="url(#hero-grid)" strokeWidth="1" />
                  <path d="M24 92H296M160 24V156" stroke="hsl(var(--border) / 0.35)" strokeWidth="1" />
                  <circle cx="254" cy="68" r="34" fill="hsl(var(--primary) / 0.1)" />
                  <path d="M54 138C118 110 154 74 252 88" fill="none" stroke="hsl(var(--primary) / 0.55)" strokeWidth="2" strokeDasharray="4 8" />
                </svg>

                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <div className="panel-title">Patch intent</div>
                      <div className="mt-2 text-xl font-display uppercase tracking-[-0.08em] text-foreground">Minimal fix</div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <PatchLine sign="+" text="const [rows] = await pool.execute(" />
                    <PatchLine sign="+" text="'SELECT * FROM users WHERE id = ?'," />
                    <PatchLine sign="+" text="[id]" />
                    <PatchLine sign="+" text=")" />
                  </div>

                  <div className="mt-8 rounded-[1.4rem] border border-success/15 bg-success/8 p-4">
                    <div className="mb-1 text-xs uppercase tracking-[0.18em] text-success">Safer query path</div>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      Same route, lower risk surface. The UI treats the diff as a design artifact, not a buried utility panel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CodeLine({ n, children, label }: { n: number; children: React.ReactNode; label?: "critical" | "high" }) {
  return (
    <div className={cn(
      "flex items-start gap-3 rounded-[1rem] border px-3 py-3 font-mono text-xs",
      label === "critical" && "border-destructive/15 bg-destructive/8 text-destructive",
      label === "high" && "border-warning/15 bg-warning/8 text-warning",
      !label && "border-border/70 bg-background/55 text-foreground/75"
    )}>
      <span className="mt-0.5 text-[10px] text-muted-foreground/60">{String(n).padStart(2, "0")}</span>
      <span className="leading-6">{children}</span>
    </div>
  );
}

function PatchLine({ sign, text }: { sign: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[1rem] border border-success/12 bg-success/8 px-3 py-3 text-diff-add-text">
      <span className="mt-0.5 text-success/70">{sign}</span>
      <span className="leading-6">{text}</span>
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-border/60 px-4 py-5 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-5 md:gap-10">
        {trustItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <item.icon className="h-4 w-4 text-primary/70" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureSpread() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="panel-title">LOCK</div>
          <h2 className="mt-3 text-[clamp(2.7rem,5vw,5rem)] font-display uppercase leading-[0.88] tracking-[-0.1em] text-foreground">
            The audit tool
            <br />
            as editorial architecture.
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground">
            We fused command-room instrumentation with magazine-scale type. The result feels like a security desk, not another pastel dashboard.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-4 md:grid-cols-[1fr_0.88fr]"
        >
          <motion.div variants={staggerItem} className="panel-shell rounded-[2rem] p-6">
            <Layers3 className="h-5 w-5 text-primary" />
            <div className="mt-5 text-2xl font-display uppercase tracking-[-0.08em] text-foreground">
              Dense by design, calm in hierarchy.
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Type scale does the heavy lifting. Dangerous states are bright, but the background stays disciplined so long sessions do not fatigue the eye.
            </p>
          </motion.div>

          <motion.div variants={staggerItem} className="panel-shell rounded-[2rem] p-6">
            <Waypoints className="h-5 w-5 text-primary" />
            <div className="mt-5 text-2xl font-display uppercase tracking-[-0.08em] text-foreground">
              One route language.
            </div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Marketing, workspace, history, rules, and settings all share the same cinematic token set, just re-composed for their job.
            </p>
          </motion.div>

          {featureRows.map((item) => (
            <motion.div key={item.title} variants={staggerItem} className="panel-shell rounded-[2rem] p-6 md:col-span-2">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl">
                  <div className="panel-title">Feature</div>
                  <h3 className="mt-3 text-2xl font-display uppercase tracking-[-0.08em] text-foreground">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.desc}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-primary/15 bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProcessBand() {
  const steps = [
    { num: "01", title: "Drop code into the deck", desc: "The editor is the stage, not a side panel. Paste production snippets, choose a language, and stay in context." },
    { num: "02", title: "Read the pressure points", desc: "Findings rank by risk and confidence, with visual weight calibrated for triage rather than decoration." },
    { num: "03", title: "Review the patch story", desc: "Diffs and recommendations arrive together so your team sees both the change and the reasoning." },
  ];

  return (
    <section className="relative overflow-hidden border-y border-border/60 px-4 py-20 md:px-8 md:py-28" style={{ backgroundColor: "hsl(var(--surface-1) / 0.76)" }}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-border/45 lg:block" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.76fr_1.24fr]">
        <div>
          <div className="panel-title">Workflow</div>
          <h2 className="mt-4 text-[clamp(2.8rem,4vw,4.9rem)] font-display uppercase leading-[0.88] tracking-[-0.1em] text-foreground">
            Audit,
            <br />
            don't meander.
          </h2>
          <p className="mt-5 max-w-md text-base leading-8 text-muted-foreground">
            The expected approach would be another center-stacked three-step feature block. Instead, the process reads like a spread from an incident review manual.
          </p>
        </div>

        <div className="space-y-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
              className="panel-shell magnetic-hover rounded-[2rem] p-6"
            >
              <div className="grid gap-5 md:grid-cols-[140px_1fr] md:items-start">
                <div className="text-[4rem] font-display leading-none tracking-[-0.12em] text-primary/22">{step.num}</div>
                <div>
                  <h3 className="text-2xl font-display uppercase tracking-[-0.08em] text-foreground">{step.title}</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LanguageWall() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="panel-title">Coverage</div>
            <h2 className="mt-3 text-[clamp(2.4rem,4vw,4rem)] font-display uppercase leading-[0.9] tracking-[-0.1em] text-foreground">
              Multi-language,
              <br />
              single atmosphere.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            The visual system flexes from JavaScript to Rust without changing product character.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {SUPPORTED_LANGUAGES.map((language) => (
            <motion.div
              key={language.id}
              variants={staggerItem}
              className="magnetic-hover panel-shell rounded-[1.6rem] px-4 py-5"
            >
              <div className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">language</div>
              <div className="mt-3 font-mono text-sm text-foreground">{language.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PrivacyBand() {
  return (
    <section className="border-y border-border/60 px-4 py-20 md:px-8 md:py-28" style={{ backgroundColor: "hsl(var(--surface-1) / 0.82)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel-shell rounded-[2rem] p-6">
          <Lock className="h-6 w-6 text-primary" />
          <h2 className="mt-5 text-[clamp(2rem,3vw,3.4rem)] font-display uppercase leading-[0.9] tracking-[-0.09em] text-foreground">
            Your code does
            <br />
            not leave the room.
          </h2>
        </div>

        <div className="panel-shell rounded-[2rem] p-6 md:p-8">
          <p className="max-w-2xl text-base leading-8 text-muted-foreground">
            Calm Scan runs like an internal atelier: private, intentional, and free from telemetry theater. The product makes privacy visible,
            not just promised in tiny footer text.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {["No cloud copy", "Offline-friendly", "Inspectable rules"].map((item) => (
              <div key={item} className="rounded-[1.3rem] border border-border/70 bg-background/50 px-4 py-4">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <div className="mt-3 text-sm font-medium text-foreground">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTAFooter() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl rounded-[2.4rem] border border-primary/15 bg-[linear-gradient(135deg,hsl(var(--primary)/0.18),transparent_58%),linear-gradient(180deg,hsl(var(--surface-2)/0.82),hsl(var(--surface-1)/0.92))] p-8 shadow-[var(--shadow-hard)] md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="panel-title">Launch</div>
            <h2 className="mt-4 text-[clamp(2.6rem,4.8vw,5rem)] font-display uppercase leading-[0.86] tracking-[-0.1em] text-foreground">
              Make review
              <br />
              feel expensive.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
              No signup. No account choreography. Paste code, trace risk, and leave with a patch your team can actually trust.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Link
              to="/app"
              className="magnetic-hover inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground"
            >
              Open command deck
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Shield className="h-4 w-4 text-primary/70" />
              Calm Scan for developers who like evidence.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
