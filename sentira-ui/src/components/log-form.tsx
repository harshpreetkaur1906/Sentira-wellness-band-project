import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, RotateCcw, Save, HeartPulse, Moon, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

type Values = { heartRate: string; sleepHours: string; moodScore: string };
const empty: Values = { heartRate: "", sleepHours: "", moodScore: "" };

export function LogForm({
  onSubmit,
}: {
  onSubmit: (v: { heartRate: number; sleepHours: number; moodScore: number }) => void;
}) {
  const [v, setV] = useState<Values>(empty);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});

  const validate = (): boolean => {
    const e: Partial<Record<keyof Values, string>> = {};
    const hr = Number(v.heartRate);
    const sl = Number(v.sleepHours);
    const md = Number(v.moodScore);
    if (!v.heartRate || isNaN(hr) || hr < 30 || hr > 220) e.heartRate = "30 – 220 bpm";
    if (!v.sleepHours || isNaN(sl) || sl < 0 || sl > 14) e.sleepHours = "0 – 14 hrs";
    if (!v.moodScore || isNaN(md) || md < 1 || md > 10) e.moodScore = "1 – 10";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    onSubmit({
      heartRate: Number(v.heartRate),
      sleepHours: Number(v.sleepHours),
      moodScore: Number(v.moodScore),
    });
    setLoading(false);
    setV(empty);
    toast.success("Today’s wellness logged", {
      description: "Your dashboard has been refreshed with the new reading.",
    });
  };

  const fields: { key: keyof Values; label: string; placeholder: string; icon: typeof HeartPulse; suffix: string }[] = [
    { key: "heartRate", label: "Heart Rate", placeholder: "72", icon: HeartPulse, suffix: "bpm" },
    { key: "sleepHours", label: "Sleep Hours", placeholder: "7.5", icon: Moon, suffix: "hrs" },
    { key: "moodScore", label: "Mood Score", placeholder: "8", icon: Smile, suffix: "/ 10" },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass relative overflow-hidden rounded-3xl p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-[oklch(0.78_0.13_295/0.4)] blur-3xl"
      />
      <div className="relative">
        <h3 className="font-display text-xl font-semibold">Log Today’s Wellness</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          A few seconds of input keeps your insights sharp.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {fields.map((f) => {
            const Icon = f.icon;
            const err = errors[f.key];
            return (
              <label key={f.key} className="group relative block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </span>
                <div
                  className={`flex items-center gap-2 rounded-2xl border bg-background/60 px-3.5 py-2.5 transition-all focus-within:border-primary/60 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_18%,transparent)] ${
                    err ? "border-destructive/60" : "border-border"
                  }`}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <input
                    inputMode="decimal"
                    value={v[f.key]}
                    onChange={(e) => setV({ ...v, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
                  />
                  <span className="text-xs text-muted-foreground">{f.suffix}</span>
                </div>
                {err && <span className="mt-1 block text-xs text-destructive">{err}</span>}
              </label>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="group relative h-11 rounded-2xl bg-gradient-primary px-6 text-primary-foreground shadow-[0_8px_30px_color-mix(in_oklab,var(--primary)_30%,transparent)] hover:opacity-95"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Data
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setV(empty);
              setErrors({});
            }}
            className="h-11 rounded-2xl"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
