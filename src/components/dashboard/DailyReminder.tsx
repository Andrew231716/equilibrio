"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { todayKey } from "@/lib/utils";

export function DailyReminder() {
  const preferences = useAppStore((s) => s.preferences);
  const checkIns = useAppStore((s) => s.checkIns);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    const refresh = () => setNow(new Date());
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const today = todayKey(now);
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const done = checkIns.some((c) => c.date === today);
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const activeDays = new Set(checkIns.filter((c) => c.date >= todayKey(weekStart) && c.date <= today).map((c) => c.date)).size;

  return (
    <div className="space-y-2 text-sm">
      <p className="text-[var(--muted)]">Check-in questa settimana: {activeDays} / {preferences.weeklyGoalDays} giorni</p>
      {preferences.remindersEnabled && !done && time >= preferences.reminderTime ? (
        <p role="status" className="rounded-xl border border-[var(--sage-deep)] p-3">
          È il momento del tuo check-in: dedica un minuto a osservare come ti senti.
        </p>
      ) : null}
    </div>
  );
}
