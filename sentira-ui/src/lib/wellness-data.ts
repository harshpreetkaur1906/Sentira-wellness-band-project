export type WellnessLog = {
  id?: string;
  heartRate?: number;
  sleepHours?: number;
  moodScore?: number;

  // ✅ ADD THIS
  stressStatus?: string;

  // (optional fallback for old data)
  stress?: number;
};

const dayLabel = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString();
};

export function deriveStress(hr: number, sleep: number, mood: number): number {
  const hrPart = Math.max(0, Math.min(100, (hr - 55) * 1.6));
  const sleepPart = Math.max(0, Math.min(100, (8 - sleep) * 14));
  const moodPart = Math.max(0, Math.min(100, (10 - mood) * 9));
  return Math.round(hrPart * 0.35 + sleepPart * 0.35 + moodPart * 0.3);
}

export const seedLogs: WellnessLog[] = [
  { id: "1", date: dayLabel(6), heartRate: 74, sleepHours: 6.2, moodScore: 6, stress: 0 },
  { id: "2", date: dayLabel(5), heartRate: 71, sleepHours: 7.0, moodScore: 7, stress: 0 },
  { id: "3", date: dayLabel(4), heartRate: 78, sleepHours: 5.8, moodScore: 5, stress: 0 },
  { id: "4", date: dayLabel(3), heartRate: 69, sleepHours: 7.6, moodScore: 8, stress: 0 },
  { id: "5", date: dayLabel(2), heartRate: 67, sleepHours: 8.1, moodScore: 9, stress: 0 },
  { id: "6", date: dayLabel(1), heartRate: 72, sleepHours: 7.2, moodScore: 7, stress: 0 },
  { id: "7", date: dayLabel(0), heartRate: 68, sleepHours: 7.8, moodScore: 8, stress: 0 },
].map((l) => ({ ...l, stress: deriveStress(l.heartRate, l.sleepHours, l.moodScore) }));

export const moodEmoji = (score: number) => {
  if (score >= 9) return "🤩";
  if (score >= 7) return "😊";
  if (score >= 5) return "🙂";
  if (score >= 3) return "😕";
  return "😣";
};

export const stressLabel = (s: number) => {
  if (s < 33) return { label: "Calm", tone: "success" as const };
  if (s < 66) return { label: "Elevated", tone: "warning" as const };
  return { label: "High", tone: "danger" as const };
};

export const insights = [
  "Your sleep rhythm has improved 12% this week — keep your wind-down routine consistent.",
  "Heart rate variability suggests recovery is on track. Try a 4-7-8 breath cycle tonight.",
  "Mood and sleep are highly correlated for you. Aim for 7.5h tonight to hold momentum.",
  "Stress signal is calm. A short walk outside could deepen your reset.",
];

export const quotes = [
  { q: "Almost everything will work again if you unplug it for a few minutes — including you.", a: "Anne Lamott" },
  { q: "Rest when you’re weary. Refresh and renew yourself.", a: "Ralph Marston" },
  { q: "Within you, there is a stillness and a sanctuary you can retreat to anytime.", a: "Hermann Hesse" },
];
