import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { pageTransition, fadeUp, staggerContainer, staggerItem, duration } from "@/animations/motion-presets";
import { Link } from "react-router-dom";
import {
  Shield, Lock, Zap, Code2, ShieldAlert, Bug, GitCompareArrows,
  ArrowRight, CheckCircle2, Terminal, Fingerprint, Cpu,
} from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/data/mock-data";

export default function LandingPage() {
  return (
    <motion.div {...pageTransition} className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <TrustStrip />
      <Features />
      <Workflow />
      <Languages />
      <Privacy />
      <CTAFooter />
    </motion.div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 backdrop-blur-xl" style={{ backgroundColor: "hsl(var(--background) / 0.85)" }}>
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-[18px] w-[18px] text-primary" />
          <span className="text-[14px] font-semibold text-foreground tracking-tight">CodeAudit</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/rules" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-150">Rules</Link>
          <Link to="/playground" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-150">Playground</Link>
          <Link
            to="/app"
            className="text-[13px] px-3.5 py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:brightness-110 transition-all duration-150"
          >
            Open scanner
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-2xs text-muted-foreground mb-6"
        >
          <Cpu className="h-3 w-3 text-primary" />
          Local-first static analysis
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="text-4xl sm:text-5xl md:text-[56px] font-bold text-foreground tracking-[-0.035em] leading-[1.08] mb-5 text-balance"
        >
          Catch vulnerabilities
          <br />
          <span className="text-primary">before they ship</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-base md:text-[17px] text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed text-balance"
        >
          Paste code. Get instant security analysis, bug detection, and minimal safe patches.
          Everything runs locally — your code never leaves your machine.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.5}
          className="flex items-center justify-center gap-3"
        >
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-[14px] hover:brightness-110 active:scale-[0.98] transition-all duration-150"
          >
            Open scanner
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/playground"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-[14px] text-foreground hover:bg-accent transition-colors duration-150"
          >
            Try a demo
          </Link>
        </motion.div>

        {/* Code mockup */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-14 rounded-xl border border-border overflow-hidden shadow-xl"
          style={{ backgroundColor: "hsl(var(--surface-1))" }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border" style={{ backgroundColor: "hsl(var(--surface-2))" }}>
            <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
            <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
            <span className="ml-3 text-2xs text-muted-foreground font-mono tracking-tight">audit-results.js</span>
          </div>

          <div className="grid md:grid-cols-2 divide-x divide-border">
            {/* Vulnerable */}
            <div className="p-4 text-left">
              <div className="text-2xs uppercase tracking-wider text-muted-foreground/60 font-medium mb-2">Source</div>
              <div className="font-mono text-xs leading-6 space-y-0.5">
                <CodeLine n={17} dim>{'const query ='}</CodeLine>
                <CodeLine n={18} severity="critical">
                  {' `SELECT * FROM users WHERE id = ${id}`'}
                </CodeLine>
                <CodeLine n={19} dim>{'db.query(query, (err, res) => {'}</CodeLine>
              </div>
              <div className="mt-3 flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-destructive/8 border border-destructive/15">
                <ShieldAlert className="h-3 w-3 text-destructive shrink-0" />
                <span className="text-2xs text-destructive font-medium">SQL Injection · Critical · Line 18</span>
              </div>
            </div>

            {/* Fixed */}
            <div className="p-4 text-left">
              <div className="text-2xs uppercase tracking-wider text-muted-foreground/60 font-medium mb-2">Patched</div>
              <div className="font-mono text-xs leading-6 space-y-0.5">
                <CodeLine n={17} add>{'const [rows] = await pool.execute('}</CodeLine>
                <CodeLine n={18} add>{"  'SELECT * FROM users WHERE id = ?',"}</CodeLine>
                <CodeLine n={19} add>{'  [id]'}</CodeLine>
                <CodeLine n={20} add>{')'}</CodeLine>
              </div>
              <div className="mt-3 flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-success/8 border border-success/15">
                <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                <span className="text-2xs text-success font-medium">Parameterized query · Safe</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CodeLine({ n, children, dim, severity, add }: {
  n: number;
  children: React.ReactNode;
  dim?: boolean;
  severity?: "critical";
  add?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center rounded-[2px] -mx-1 px-1",
      severity === "critical" && "bg-destructive/8",
      add && "bg-success/8",
    )}>
      <span className="w-5 text-right mr-2 select-none text-muted-foreground/30 text-2xs font-mono tabular-nums shrink-0">{n}</span>
      <span className={cn(
        "text-xs",
        dim && "text-muted-foreground/60",
        severity === "critical" && "text-destructive",
        add && "text-success",
        !dim && !severity && !add && "text-foreground/80",
      )}>
        {add && <span className="text-success/50 mr-1 select-none">+</span>}
        {children}
      </span>
    </div>
  );
}


function TrustStrip() {
  const items = [
    { icon: Lock, label: "Local-first processing" },
    { icon: Fingerprint, label: "Zero data collection" },
    { icon: Zap, label: "Sub-second scans" },
    { icon: Terminal, label: "Developer-native UX" },
  ];

  return (
    <section className="border-y border-border/60 py-5">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-8 md:gap-12 flex-wrap px-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <item.icon className="h-3.5 w-3.5 text-primary/70" strokeWidth={1.8} />
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: ShieldAlert,
      title: "Security analysis",
      desc: "SQL injection, XSS, CSRF, insecure crypto, hardcoded secrets — 50+ patterns, zero false-positive tolerance.",
    },
    {
      icon: Bug,
      title: "Bug detection",
      desc: "Null dereferences, unhandled errors, race conditions, missing return statements, and logic flaws.",
    },
    {
      icon: Code2,
      title: "Quality insights",
      desc: "Anti-patterns, complexity hotspots, dead code, and maintainability warnings with actionable context.",
    },
    {
      icon: GitCompareArrows,
      title: "Minimal safe patches",
      desc: "Git-diff style patches that fix only what's broken. Review changes line-by-line before applying.",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
            Static analysis, reimagined
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-lg">
            Not another linter. A focused audit workspace that surfaces what matters and shows you exactly how to fix it.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-3"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="rounded-lg border border-border p-5 bg-card hover:border-border/80 hover:bg-accent/30 transition-colors duration-150 group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center mb-3 group-hover:bg-primary/12 transition-colors">
                <f.icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
              </div>
              <h3 className="text-[14px] font-semibold text-foreground mb-1 tracking-tight">{f.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { num: "01", title: "Paste code", desc: "Drop any snippet into the Monaco editor. Auto-detects language." },
    { num: "02", title: "Review findings", desc: "Browse categorized issues. Click to highlight affected lines." },
    { num: "03", title: "Apply the fix", desc: "Inspect the diff, copy the patch, and ship with confidence." },
  ];

  return (
    <section className="py-16 md:py-24 px-6 border-y border-border/40" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-foreground tracking-tight text-center mb-12"
        >
          Three steps to safer code
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="text-center md:text-left"
            >
              <div className="text-[32px] font-bold font-mono text-primary/15 leading-none mb-2">{s.num}</div>
              <h3 className="text-[15px] font-semibold text-foreground mb-1.5">{s.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Languages() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8"
        >
          Multi-language support
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <motion.div
              key={l.id}
              variants={staggerItem}
              className="px-3 py-1.5 rounded-md border border-border text-[13px] text-foreground/80 font-mono bg-card hover:border-primary/20 transition-colors duration-150"
            >
              {l.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section className="py-16 md:py-24 px-6 border-y border-border/40" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-5 w-5 text-primary" strokeWidth={1.8} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">Your code stays yours</h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
          CodeAudit runs entirely on your machine. No code is sent to external servers.
          No telemetry, no cloud storage, no third-party access. Ever.
        </p>
        <div className="flex items-center justify-center gap-5 md:gap-8 text-[13px] text-muted-foreground">
          {["Zero data collection", "Offline capable", "Open rules"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" strokeWidth={2} /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAFooter() {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">Ready to audit your code?</h2>
        <p className="text-[15px] text-muted-foreground mb-7">No signup required. No API keys. Just paste and scan.</p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-[15px] hover:brightness-110 active:scale-[0.98] transition-all duration-150"
        >
          Open scanner <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto mt-14 pt-6 border-t border-border/50 flex items-center justify-between text-2xs text-muted-foreground/60">
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-primary/50" />
          <span className="font-medium">CodeAudit</span>
        </div>
        <span>Built for developers who ship secure code.</span>
      </div>
    </section>
  );
}
