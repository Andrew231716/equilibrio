"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Home,
  Library,
  LineChart,
  NotebookPen,
  Route,
  UserRound,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/percorso", label: "Percorso", icon: Route },
  { href: "/diario", label: "Diario", icon: NotebookPen },
  { href: "/strumenti", label: "Strumenti", icon: Wrench },
  { href: "/progressi", label: "Progressi", icon: LineChart },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/profilo", label: "Profilo", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile bottom nav — primary items */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--bg-elevated)_92%,transparent)] backdrop-blur-md md:hidden"
        style={{ height: "var(--nav-height)" }}
        aria-label="Navigazione principale"
      >
        <ul className="mx-auto grid h-full max-w-lg grid-cols-5 px-1">
          {items.slice(0, 5).map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href} className="flex">
                <Link
                  href={href}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px]",
                    active ? "text-[var(--forest)]" : "text-[var(--muted)]",
                  )}
                >
                  <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop side / top nav */}
      <aside className="sticky top-0 z-30 hidden border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg-elevated)_90%,transparent)] backdrop-blur-md md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="font-display text-xl tracking-tight text-[var(--forest)]">
            EQUILIBRIO
          </Link>
          <nav aria-label="Navigazione desktop">
            <ul className="flex flex-wrap items-center gap-1">
              {items.map(({ href, label, icon: Icon }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition",
                        active
                          ? "bg-[color-mix(in_oklab,var(--sage)_22%,transparent)] text-[var(--forest)]"
                          : "text-[var(--muted)] hover:text-[var(--fg)]",
                      )}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <BookOpen className="text-[var(--sage)]" size={18} aria-hidden />
        </div>
      </aside>

      {/* Extra mobile links for biblioteca/profilo */}
      <div className="fixed bottom-[calc(var(--nav-height)+0.4rem)] right-3 z-40 flex flex-col gap-2 md:hidden">
        <Link
          href="/biblioteca"
          className="inline-flex items-center gap-1 rounded-full bg-[var(--forest)] px-3 py-2 text-xs text-white shadow-lg"
        >
          <Library size={14} /> Biblioteca
        </Link>
        <Link
          href="/profilo"
          className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-elevated)] px-3 py-2 text-xs text-[var(--forest)] shadow-lg border border-[var(--border)]"
        >
          <UserRound size={14} /> Profilo
        </Link>
      </div>
    </>
  );
}
