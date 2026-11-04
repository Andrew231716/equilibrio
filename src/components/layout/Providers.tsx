"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";

function applyTheme(theme: "light" | "dark" | "system") {
  const root = document.documentElement;
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.preferences.theme);
  const hydrated = useAppStore((s) => s.hydrated);
  const setHydrated = useAppStore((s) => s.setHydrated);

  useEffect(() => {
    // ensure hydration flag if persist already done
    if (!hydrated && useAppStore.persist.hasHydrated()) {
      setHydrated(true);
    }
  }, [hydrated, setHydrated]);

  useEffect(() => {
    applyTheme(theme);
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center page-pad">
        <div className="text-center">
          <p className="font-display text-2xl text-[var(--forest)]">EQUILIBRIO</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Caricamento…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
