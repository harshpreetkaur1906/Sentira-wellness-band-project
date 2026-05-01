import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { AuroraBackground } from "@/components/aurora-background";
import { Navbar } from "@/components/navbar";
import {
  HeartRateCard,
  MoodCard,
  SleepCard,
  StressCard,
} from "@/components/metric-cards";
import {
  HeartRateChart,
  MoodChart,
  SleepChart,
  StressDonut,
} from "@/components/charts";
import {
  AIInsightCard,
  HeroInsight,
  MindfulnessQuote,
  RecentLogs,
} from "@/components/dashboard-widgets";
import { LogForm } from "@/components/log-form";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();

  // ✅ STATE (MOVED INSIDE COMPONENT)
  const [logs, setLogs] = useState<any[]>([]);
  const [ready, setReady] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const userName = localStorage.getItem("userName") || "friend";

  // ✅ FETCH DATA FROM BACKEND
  const fetchData = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("https://sentira-project.onrender.com/api/wellness", {
      headers: { Authorization: token },
    });

    setLogs(res.data);
  };

  // ✅ SAVE DATA
  const addLog = async (form: any) => {
    const token = localStorage.getItem("token");

    await axios.post("https://sentira-project.onrender.com/api/wellness", form, {
      headers: { Authorization: token },
    });

    fetchData();
  };

  // ✅ AUTH + LOAD DATA
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate({ to: "/" as any });
      return;
    }

    setAuthChecked(true);
    fetchData(); // 🔥 IMPORTANT

    const t = setTimeout(() => setReady(true), 250);
    return () => clearTimeout(t);
  }, [navigate]);

  if (!authChecked) {
    return (
      <div className="relative min-h-screen">
        <AuroraBackground />
      </div>
    );
  }

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Navbar />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-end justify-between gap-3"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
              {today}
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {greeting}, {userName.split(" ")[0]}.
            </h2>
          </div>

          <a
            href="#log-today"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow transition-transform hover:-translate-y-0.5"
          >
            <PlusCircle className="h-4 w-4" />
            Log today’s data
          </a>
        </motion.div>

        <HeroInsight logs={logs} />

        {!ready ? (
          <SkeletonGrid />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <HeartRateCard logs={logs} />
              <SleepCard logs={logs} />
              <MoodCard logs={logs} />
              <StressCard logs={logs} />
            </div>

            <div id="log-today" className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <LogForm onSubmit={addLog} />
              <AIInsightCard />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <HeartRateChart logs={logs} />
              <SleepChart logs={logs} />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <MoodChart logs={logs} />
              <StressDonut logs={logs} />
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <RecentLogs logs={logs} />
              <MindfulnessQuote />
            </div>
          </>
        )}

        <footer className="pb-8 pt-6 text-center text-xs text-muted-foreground">
          Sentira · Wellness, with clarity.
        </footer>
      </main>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass h-[180px] rounded-3xl">
          <div className="shimmer h-full w-full" />
        </div>
      ))}
    </div>
  );
}