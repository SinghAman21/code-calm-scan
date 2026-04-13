import { motion } from "framer-motion";
import { pageTransition, fadeUp, staggerContainer, staggerItem } from "@/animations/motion-presets";
import { Link } from "react-router-dom";
import { Shield, Lock, Zap, Code2, Eye, GitBranch, ArrowRight, CheckCircle2 } from "lucide-react";
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
    <nav className="fixed top-0 w-full z-50 border-b border-border/50 backdrop-blur-md" style={{ backgroundColor: "hsl(var(--background) / 0.8)" }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">CodeAudit</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/playground" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Playground</Link>
          <Link to="/rules" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rules</Link>
          <Link
            to="/app"
            className="text-sm px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Start scanning
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-6 text-balance"
        >
          Find vulnerabilities
          <br />
          <span className="text-primary">before they find you</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-balance"
        >
          Intelligent code audit workspace. Paste your code, get instant security analysis,
          bug detection, and minimal safe patches — all running locally.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="flex items-center justify-center gap-3"
        >
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all"
          >
            Start scanning
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/playground"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
          >
            Try demo
          </Link>
        </motion.div>

        {/* Code mockup */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-16 rounded-xl border border-border overflow-hidden shadow-2xl shadow-primary/5"
          style={{ backgroundColor: "hsl(var(--surface-1))" }}
        >
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
            <span className="ml-3 text-xs text-muted-foreground font-mono">scan-results.js</span>
          </div>
          <div className="grid md:grid-cols-2 divide-x divide-border">
            <div className="p-4 font-mono text-xs leading-relaxed text-left">
              <div className="text-muted-foreground">1  <span className="text-foreground">const query = </span><span className="text-destructive">{"`SELECT * FROM users WHERE id = ${id}`"}</span></div>
              <div className="text-muted-foreground">2  <span className="text-foreground">db.query(query)</span></div>
              <div className="mt-3 px-2 py-1 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                ⚠ SQL Injection — Critical
              </div>
            </div>
            <div className="p-4 font-mono text-xs leading-relaxed text-left">
              <div className="text-muted-foreground">1  <span className="text-success">const [rows] = await pool.execute(</span></div>
              <div className="text-muted-foreground">2  <span className="text-success">  'SELECT * FROM users WHERE id = ?', [id]</span></div>
              <div className="text-muted-foreground">3  <span className="text-success">)</span></div>
              <div className="mt-3 px-2 py-1 rounded bg-success/10 border border-success/20 text-success text-xs">
                ✓ Parameterized query — Fixed
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: Lock, label: "Local-first" },
    { icon: Shield, label: "Privacy-focused" },
    { icon: Zap, label: "Instant results" },
    { icon: Code2, label: "Developer friendly" },
  ];

  return (
    <section className="border-y border-border py-6">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 flex-wrap px-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <item.icon className="h-4 w-4 text-primary" />
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Shield, title: "Vulnerability Detection", desc: "SQL injection, XSS, CSRF, insecure crypto, and 50+ vulnerability patterns." },
    { icon: Eye, title: "Bug Finding", desc: "Null references, missing error handling, race conditions, and logic errors." },
    { icon: Code2, title: "Code Quality", desc: "Anti-patterns, complexity hotspots, maintainability issues, and best practices." },
    { icon: GitBranch, title: "Safe Patches", desc: "Minimal, targeted fixes as git-diff patches you can review and apply." },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-bold text-foreground text-center mb-12"
        >
          Everything you need for code security
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="rounded-xl border border-border p-6 bg-card hover:border-primary/20 transition-colors"
            >
              <f.icon className="h-5 w-5 text-primary mb-3" />
              <h3 className="text-base font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { num: "01", title: "Paste code", desc: "Drop your snippet into the Monaco editor." },
    { num: "02", title: "Inspect findings", desc: "Review categorized issues by severity." },
    { num: "03", title: "Apply fix", desc: "Copy the minimal safe patch from the diff view." },
  ];

  return (
    <section className="py-20 px-6" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-bold text-foreground text-center mb-12"
        >
          Three steps to safer code
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary/20 font-mono mb-3">{s.num}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Languages() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-bold text-foreground mb-8"
        >
          10+ languages supported
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <motion.div
              key={l.id}
              variants={staggerItem}
              className="px-4 py-2 rounded-lg border border-border text-sm text-foreground font-mono bg-card"
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
    <section className="py-20 px-6" style={{ backgroundColor: "hsl(var(--surface-1))" }}>
      <div className="max-w-3xl mx-auto text-center">
        <Lock className="h-8 w-8 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-foreground mb-4">Your code stays yours</h2>
        <p className="text-muted-foreground mb-6">
          CodeAudit runs entirely on your machine. No code is sent to external servers.
          No telemetry, no cloud storage, no third-party access.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          {["Zero data collection", "Local processing", "Open detection rules"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAFooter() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to audit your code?</h2>
        <p className="text-muted-foreground mb-8">Start scanning in seconds. No signup, no API keys.</p>
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-lg"
        >
          Start scanning <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
      <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          CodeAudit
        </div>
        <span>Built for developers who care about security.</span>
      </div>
    </section>
  );
}
