"use client";

import { BottomNav } from "./BottomNav";
import { Providers } from "./Providers";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col">
        <BottomNav />
        <main className="flex-1 page-pad">{children}</main>
        <footer className="hidden px-4 pb-6 text-center text-xs text-[var(--muted)] md:block">
          EQUILIBRIO è uno strumento educativo di benessere personale. Non sostituisce professionisti
          della salute.
        </footer>
      </div>
    </Providers>
  );
}
