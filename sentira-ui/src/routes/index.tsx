import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Lock, User, Sparkles, Sun, Moon } from "lucide-react";
import { AuroraBackground } from "@/components/aurora-background";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentira — Track your wellness with clarity" },
      {
        name: "description",
        content:
          "Sign in to Sentira: a calm, premium wellness dashboard for heart rate, sleep, mood and stress.",
      },
    ],
  }),
  component: AuthLanding,
});

function AuthLanding() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme(); 

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate({ to: "/dashboard" as any });
    }
  }, [navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password || (mode === "register" && !name)) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      if (mode === "register") {
        await axios.post("http://localhost:5000/api/register", {
          name,
          email,
          password,
        });

        setMode("login");
        setError("Account created! Please login.");
        setLoading(false);
        return;
      }

      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name || name || email);

      navigate({ to: "/dashboard" as any });

    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuroraBackground />

      {/*  THEME TOGGLE BUTTON */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggle}
          className="p-2 rounded-xl bg-white/10 backdrop-blur hover:scale-105 transition"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-white" />
          ) : (
            <Moon className="h-5 w-5 text-black" />
          )}
        </button>
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight">
            Sentira
          </span>
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:pt-12">

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            Wellness intelligence, beautifully calm
          </span>

          <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl">
            Track your wellness <br />
            with <span className="text-gradient-primary">clarity</span>.
          </h1>

          <p className="mt-5 text-lg text-muted-foreground">
            Sentira gathers your heart rate, sleep, mood and stress into one view.
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-strong rounded-[2rem] p-8 shadow-elevated">

            <div className="inline-flex rounded-full bg-muted p-1">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 rounded-full ${
                    mode === m ? "bg-gradient-primary text-white" : ""
                  }`}
                >
                  {m === "login" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <h2 className="mt-6 text-3xl font-semibold">
              {mode === "login" ? "Welcome back" : "Begin your rhythm"}
            </h2>

            <form onSubmit={handle} className="mt-6 space-y-4">

              {mode === "register" && (
                <Field icon={User} label="Name" value={name} onChange={setName} />
              )}

              <Field icon={Mail} label="Email" value={email} onChange={setEmail} />

              <label>
                <span className="text-xs text-muted-foreground">Password</span>

                <div className="flex items-center gap-2 border p-3 rounded-xl">
                  <Lock className="h-4 w-4" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </label>

              {error && (
                <p className="text-red-400 text-xs">{error}</p>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? "Loading..."
                  : mode === "login"
                  ? "Login"
                  : "Create Account"}
              </Button>

            </form>
          </div>
        </motion.section>

      </main>
    </div>
  );
}

function Field({ icon: Icon, label, type = "text", value, onChange }: any) {
  return (
    <label>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 border p-3 rounded-xl">
        <Icon className="h-4 w-4" />
        <input
          type={type}
          value={value}
          placeholder={label}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none"
        />
      </div>
    </label>
  );
}