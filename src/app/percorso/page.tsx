"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/Card";
import { LESSONS } from "@/data/lessons";
import { MODULES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

export default function PercorsoPage() {
  const lessonProgress = useAppStore((s) => s.lessonProgress);
  const current = useAppStore((s) => s.currentPathDay)();
  const completed = useAppStore((s) => s.completedLessonsCount)();

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl text-[var(--forest)]">Percorso 30 giorni</h1>
        <p className="mt-2 text-[var(--muted)]">
          Quattro moduli per riconoscere, gestire e trasformare lo stress. Completati: {completed}/30.
        </p>
      </header>

      {MODULES.map((mod) => {
        const lessons = LESSONS.filter((l) => l.module === mod.id);
        return (
          <Card key={mod.id}>
            <SectionTitle title={`Modulo ${mod.id}: ${mod.title}`} subtitle={`Giorni ${mod.days[0]}–${mod.days[1]}`} />
            <ul className="space-y-2">
              {lessons.map((lesson) => {
                const done = lessonProgress[lesson.day]?.completed;
                const isCurrent = lesson.day === current;
                return (
                  <li key={lesson.day}>
                    <Link
                      href={`/percorso/${lesson.day}`}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-3 py-3 transition",
                        isCurrent
                          ? "border-[var(--sage-deep)] bg-[color-mix(in_oklab,var(--sage)_14%,transparent)]"
                          : "border-[var(--border)] hover:bg-[color-mix(in_oklab,var(--sage)_8%,transparent)]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                          done
                            ? "bg-[var(--sage-deep)] text-white"
                            : "bg-[var(--sand)] text-[var(--forest)]",
                        )}
                      >
                        {done ? <Check size={16} /> : lesson.day}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{lesson.title}</p>
                        <p className="truncate text-xs text-[var(--muted)]">{lesson.objective}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
