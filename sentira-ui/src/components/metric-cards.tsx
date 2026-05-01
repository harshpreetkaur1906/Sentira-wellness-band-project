import { motion } from "framer-motion";
import { Heart, Moon, Smile, Activity, type LucideIcon } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { CountUp } from "./count-up";
import { moodEmoji, stressLabel, type WellnessLog } from "@/lib/wellness-data";
import { cn } from "@/lib/utils";

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={42}>
      <LineChart data={points}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function getLatest(logs: WellnessLog[]) {
  return logs?.length ? logs[logs.length - 1] : null;
}

function getStressValue(l: WellnessLog | null) {
  if (!l) return 30;

  if (typeof l.stress === "number") return l.stress;

  if (l.stressStatus === "High") return 90;
  if (l.stressStatus === "Medium") return 60;

  return 30;
}

type CardShellProps = {
  title: string;
  icon: LucideIcon;
  accent: string;
  children: React.ReactNode;
  delay?: number;
};

function CardShell({ title, icon: Icon, accent, children, delay = 0 }: CardShellProps) {
  return (
    <motion.div className="glass rounded-3xl p-6">
      <div className="flex justify-between">
        <span>{title}</span>
        <Icon />
      </div>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

export function HeartRateCard({ logs }: { logs: WellnessLog[] }) {
  const latest = getLatest(logs);
  const value = latest?.heartRate ?? 0;

  return (
    <CardShell title="Heart Rate" icon={Heart} accent="">
      <CountUp value={value} />
      <Sparkline
        data={logs.map((l) => l.heartRate ?? 0)}
        color="red"
      />
    </CardShell>
  );
}

export function SleepCard({ logs }: { logs: WellnessLog[] }) {
  const latest = getLatest(logs);
  const value = latest?.sleepHours ?? 0;

  return (
    <CardShell title="Sleep" icon={Moon} accent="">
      <CountUp value={value} />
      <Sparkline
        data={logs.map((l) => l.sleepHours ?? 0)}
        color="blue"
      />
    </CardShell>
  );
}

export function MoodCard({ logs }: { logs: WellnessLog[] }) {
  const latest = getLatest(logs);
  const value = latest?.moodScore ?? 0;

  return (
    <CardShell title="Mood" icon={Smile} accent="">
      <CountUp value={value} />
      <div>{moodEmoji(value)}</div>
      <Sparkline
        data={logs.map((l) => l.moodScore ?? 0)}
        color="orange"
      />
    </CardShell>
  );
}

export function StressCard({ logs }: { logs: WellnessLog[] }) {
  const latest = getLatest(logs);
  const stressValue = getStressValue(latest);

  const { label } = stressLabel(stressValue);

  return (
    <CardShell title="Stress" icon={Activity} accent="">
      <CountUp value={stressValue} />
      <p>{label}</p>
      <Sparkline
        data={logs.map((l) => getStressValue(l))}
        color="green"
      />
    </CardShell>
  );
}