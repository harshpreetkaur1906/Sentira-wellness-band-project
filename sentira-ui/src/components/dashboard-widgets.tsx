import { motion } from "framer-motion";
import { Sparkles, Wind, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { insights, quotes, stressLabel, type WellnessLog } from "@/lib/wellness-data";

export function HeroInsight({ logs }: { logs: WellnessLog[] }) {
  // ✅ SAFE FIX
  const latest = logs?.length ? logs[logs.length - 1] : null;

  const stressValue =
  typeof latest?.stress === "number"
    ? latest.stress
    : latest?.stressStatus === "High"
    ? 90
    : latest?.stressStatus === "Medium"
    ? 60
    : 30;

const { label } = stressLabel(stressValue);

  const avgSleep = logs.length
    ? (logs.reduce((s, l) => s + (l.sleepHours || 0), 0) / logs.length).toFixed(1)
    : "0.0";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass relative overflow-hidden rounded-[2rem] p-8 sm:p-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-[oklch(0.78_0.13_295/0.45)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-[oklch(0.85_0.13_70/0.35)] blur-3xl"
      />

      <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-background/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.7_0.18_295)]" />
            Today’s Balance
          </span>

          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Your wellness is{" "}
            <span className="text-gradient-primary">{label.toLowerCase()}</span>,
            <br className="hidden sm:block" /> with quiet momentum.
          </h1>

          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            You’re averaging{" "}
            <strong className="text-foreground">{avgSleep}h</strong> of sleep this week
            and your heart rhythm has stayed within a healthy resting band. Keep flowing.
          </p>
        </div>

        <BreathingOrb />
      </div>
    </motion.section>
  );
}

function BreathingOrb() {
  return (
    <div className="relative mx-auto grid h-56 w-56 place-items-center sm:h-64 sm:w-64">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, oklch(0.85 0.13 295 / 0.9), oklch(0.78 0.1 230 / 0.5) 60%, transparent 75%)",
          filter: "blur(2px)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-6 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, oklch(0.85 0.14 80 / 0.7), transparent 65%)",
        }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <div className="relative grid h-28 w-28 place-items-center rounded-full bg-background/50 backdrop-blur ring-soft">
        <Wind className="h-6 w-6 text-foreground/70" />
        <span className="absolute -bottom-7 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Breathe
        </span>
      </div>
    </div>
  );
}

export function AIInsightCard() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % insights.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass relative overflow-hidden rounded-3xl p-6 hover-lift"
    >
      <div className="relative flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Sparkles className="h-4 w-4" />
        </span>
        <h3 className="font-display text-xl font-semibold">AI Wellness Insight</h3>
      </div>

      <motion.p key={idx} className="mt-4 text-base text-foreground/85">
        {insights[idx]}
      </motion.p>
    </motion.div>
  );
}

export function MindfulnessQuote() {
  const q = quotes[new Date().getDay() % quotes.length];

  return (
    <motion.div className="glass rounded-3xl p-6">
      <Quote className="h-6 w-6 text-[oklch(0.7_0.16_75)]" />
      <p className="mt-3 font-display text-lg">“{q.q}”</p>
      <p className="mt-2 text-xs text-muted-foreground">— {q.a}</p>
    </motion.div>
  );
}

export function RecentLogs({ logs }: { logs: WellnessLog[] }) {
  const recent = [...logs].reverse().slice(0, 5);

  return (
    <motion.div className="glass rounded-3xl p-6">
      <h3 className="font-display text-xl font-semibold">Recent Wellness Logs</h3>

      <ul className="mt-5 divide-y">
        {recent.map((l) => {
          const stressValue =
  typeof l.stress === "number"
    ? l.stress
    : l.stressStatus === "High"
    ? 90
    : l.stressStatus === "Medium"
    ? 60
    : 30;

const { label } = stressLabel(stressValue);
          return (
            <li key={l.id} className="py-3 text-sm">
              {l.heartRate} bpm · {l.sleepHours}h · mood {l.moodScore} · {label}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}