import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type WellnessLog } from "@/lib/wellness-data";

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: "short" });

function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={`glass relative overflow-hidden rounded-3xl p-6 hover-lift ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-5 h-[260px]">{children}</div>
    </motion.div>
  );
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  boxShadow: "var(--shadow-soft)",
  fontSize: 12,
  color: "var(--popover-foreground)",
};

export function HeartRateChart({ logs }: { logs: WellnessLog[] }) {
  const data = logs.map((l) => ({ day: dayLabel(l.date), hr: l.heartRate }));
  return (
    <ChartCard title="Weekly Rhythm" subtitle="Heart rate across the last 7 days" delay={0.25}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="hrLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.7 0.2 15)" />
              <stop offset="100%" stopColor="oklch(0.7 0.18 320)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
          <Line
            type="monotone"
            dataKey="hr"
            stroke="url(#hrLine)"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 0, fill: "oklch(0.7 0.2 15)" }}
            activeDot={{ r: 6 }}
            animationDuration={1100}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SleepChart({ logs }: { logs: WellnessLog[] }) {
  const data = logs.map((l) => ({ day: dayLabel(l.date), sleep: l.sleepHours }));
  return (
    <ChartCard title="Sleep Trend" subtitle="Hours of restorative rest" delay={0.3}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.7 0.13 260)" stopOpacity={0.55} />
              <stop offset="100%" stopColor="oklch(0.7 0.13 260)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
          <Area
            type="monotone"
            dataKey="sleep"
            stroke="oklch(0.6 0.14 260)"
            strokeWidth={3}
            fill="url(#sleepFill)"
            animationDuration={1100}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MoodChart({ logs }: { logs: WellnessLog[] }) {
  const data = logs.map((l) => ({ day: dayLabel(l.date), mood: l.moodScore }));
  return (
    <ChartCard title="Mood Wave" subtitle="Daily mood scores out of 10" delay={0.35}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.82 0.15 80)" />
              <stop offset="100%" stopColor="oklch(0.78 0.16 45)" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
          <YAxis domain={[0, 10]} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "color-mix(in oklab, var(--foreground) 5%, transparent)" }} />
          <Bar dataKey="mood" fill="url(#moodBar)" radius={[10, 10, 4, 4]} animationDuration={1100} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function StressDonut({ logs }: { logs: WellnessLog[] }) {
  const calm = logs.filter((l) => l.stress < 33).length;
  const elevated = logs.filter((l) => l.stress >= 33 && l.stress < 66).length;
  const high = logs.filter((l) => l.stress >= 66).length;
  const data = [
    { name: "Calm", value: calm, color: "oklch(0.72 0.16 155)" },
    { name: "Elevated", value: elevated, color: "oklch(0.8 0.16 75)" },
    { name: "High", value: high, color: "oklch(0.65 0.22 25)" },
  ];

  return (
    <ChartCard title="Stress Distribution" subtitle="How your week balanced out" delay={0.4}>
      <div className="grid h-full grid-cols-[1fr_auto] items-center gap-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={tooltipStyle} />
            <Pie
              data={data}
              dataKey="value"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={3}
              stroke="none"
              animationDuration={1100}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <ul className="space-y-3 pr-2 text-sm">
          {data.map((d) => (
            <li key={d.name} className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="ml-auto font-medium">{d.value}d</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}
