import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useUser } from "@/lib/wellness-store";
import { Button } from "./ui/button";
import { useState } from "react"; // ✅ added

export function Navbar() {
  const { theme, toggle } = useTheme();
  const user = useUser();
  const userName = localStorage.getItem("userName") || "S";
  const navigate = useNavigate();

  const [open, setOpen] = useState(false); // ✅ added

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-glass-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight">
            Sentira
          </span>
        </Link>

        {/* NAV */}
        <nav className="ml-6 hidden items-center gap-1 text-sm md:flex">
          <Link
            to="/dashboard"
            className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            activeProps={{
              className:
                "rounded-full px-3 py-1.5 bg-muted text-foreground",
            }}
          >
            Dashboard
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-1.5 relative">

          {/* THEME TOGGLE */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-10 w-10 rounded-2xl"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* 🔔 NOTIFICATIONS  */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)} 
              className="relative h-10 w-10 rounded-2xl"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[oklch(0.78_0.16_45)] shadow-[0_0_8px_oklch(0.78_0.16_45)]" />
            </Button>

            {/* 🔽 DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-black/80 backdrop-blur p-4 text-sm shadow-lg z-50">
                <p className="text-muted-foreground">
                  No notifications yet 🔔
                </p>
              </div>
            )}
          </div>

          {/* LOGOUT */}
          {localStorage.getItem("token") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userName");
                window.location.href = "/"; // ✅ safer redirect
              }}
              className="h-10 w-10 rounded-2xl"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}

          {/* USER AVATAR */}
          <div className="ml-1 grid h-10 w-10 place-items-center rounded-2xl bg-gradient-warm text-sm font-semibold text-foreground/80 ring-soft">
            {initials}
          </div>

        </div>
      </div>
    </header>
  );
}