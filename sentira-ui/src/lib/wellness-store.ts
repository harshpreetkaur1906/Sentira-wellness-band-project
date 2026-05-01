import { useEffect, useState, useCallback } from "react";
import { deriveStress, seedLogs, type WellnessLog } from "./wellness-data";

const KEY = "sentira-logs";
const AUTH_KEY = "sentira-user";

type Listener = (logs: WellnessLog[]) => void;
const listeners = new Set<Listener>();
let cache: WellnessLog[] | null = null;

function read(): WellnessLog[] {
  if (cache) return cache;
  if (typeof window === "undefined") return seedLogs;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      cache = seedLogs;
      localStorage.setItem(KEY, JSON.stringify(seedLogs));
      return cache;
    }
    cache = JSON.parse(raw) as WellnessLog[];
    return cache;
  } catch {
    cache = seedLogs;
    return cache;
  }
}

function write(next: WellnessLog[]) {
  cache = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l(next));
}

export function useWellnessLogs() {
  const [logs, setLogs] = useState<WellnessLog[]>(() => read());

  useEffect(() => {
    setLogs(read());
    const l: Listener = (v) => setLogs([...v]);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const addLog = useCallback(
    (input: { heartRate: number; sleepHours: number; moodScore: number }) => {
      const newLog: WellnessLog = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        heartRate: input.heartRate,
        sleepHours: input.sleepHours,
        moodScore: input.moodScore,
        stress: deriveStress(input.heartRate, input.sleepHours, input.moodScore),
      };
      const next = [...read(), newLog].slice(-30);
      write(next);
      return newLog;
    },
    [],
  );

  return { logs, addLog };
}

// --- Mock auth ---
export type SentiraUser = { name: string; email: string };

export function getUser(): SentiraUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as SentiraUser) : null;
  } catch {
    return null;
  }
}

export function signIn(user: SentiraUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY);
}

export function useUser() {
  const [user, setUser] = useState<SentiraUser | null>(null);
  useEffect(() => setUser(getUser()), []);
  return user;
}
