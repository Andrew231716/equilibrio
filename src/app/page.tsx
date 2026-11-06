"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { DailyReminder } from "@/components/dashboard/DailyReminder";
import { CheckInCard } from "@/components/dashboard/CheckInCard";
import { Card, SectionTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LESSONS } from "@/data/lessons";
import {
  formatDateIT,
  greetingForNow,
  motivationalMessage,
  emotionLabel,
  todayKey,
} from "@/lib/utils";
import { checkInAverage, weeklyAverage } from "@/lib/stats";
import { useAppStore } from "@/stores/app-store";

export default function HomePage() {
  const preferences = useAppStore((s) => s.preferences);
  const checkIns = useAppStore((s) => s.checkIns);
  const diary = useAppStore((s) => s.diary);
  const lessonProgress = useAppStore((s) => s.lessonProgress);
  const currentPathDay = useAppStore((s) => s.currentPathDay);
  const completedLessonsCount = useAppStore((s) => s.completedLessonsCount);

  const day = currentPathDay();
  const completed = completedLessonsCount();
  const pct = Math.round((completed / LESSONS.length) * 100);
  const lesson = LESSONS.find((l) => l.day === day);
  const progress = lessonProgress[day];
  const remainingActivities =
    (lesson?.activities.length ?? 0) - (progress?.completedActivities.length ?? 0);

  const recentEmotions = checkIns.slice(0, 5);
  const avgStress7 = weeklyAverage(diary);
  const avgCheck7 = checkInAverage(checkIns, "7");
  const name = preferences.name?.trim();

  return (
    <div className="space-y-5">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--sage)_12%,var(--bg-elevated))] p-5 md:p-7"
      >
        <p className="font-display text-3xl tracking-tight text-[var(--forest)] md:text-4xl">
          EQUILIBRIO
        </p>
        <p className="mt-3 text-lg text-[var(--fg)]">
          {greetingForNow()}
          {name ? `, ${name}` : ""}
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">{formatDateIT(new Date())}</p>
        <p className="mt-4 max-w-xl text-[var(--muted)]">{motivationalMessage()}</p>
        <Sparkles className="absolute right-4 top-4 text-[var(--sage)] opacity-60" size={28} />
      </motion.header>

      <Card>
        <SectionTitle title="Il tuo percorso" subtitle={`Giorno ${day} di 30 · Ciclo ${preferences.pathCycle}`} />
        <div className="mb-3 h-2 overflow-hidden rounded-full bg-[var(--sand)]">
          <motion.div
            className="h-full rounded-full bg-[var(--sage-deep)]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div>
            <p className="text-2xl font-medium text-[var(--forest)]">{pct}%</p>
            <p className="text-[var(--muted)]">Completato</p>
          </div>
          <div>
            <p className="text-2xl font-medium text-[var(--forest)]">{completed}</p>
            <p className="text-[var(--muted)]">Giorni fatti</p>
          </div>
          <div>
            <p className="text-2xl font-medium text-[var(--forest)]">{Math.max(0, remainingActivities)}</p>
            <p className="text-[var(--muted)]">Attività residue</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          La continuità non penalizza i salti: riprendi dal giorno corrente quando vuoi.
        </p>
        {lesson ? (
          <Link
            href={`/percorso/${day}`}
            className="btn btn-primary mt-4 inline-flex w-full sm:w-auto"
          >
            Continua: {lesson.title} <ArrowRight size={16} />
          </Link>
        ) : null}
      </Card>

      <DailyReminder />
      <CheckInCard />

      <Card>
        <SectionTitle title="Attività di oggi" />
        <ul className="space-y-2 text-sm">
          <li className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2">
            <span>Lezione del giorno</span>
            <Link href={`/percorso/${day}`} className="text-[var(--forest)]">
              {progress?.completed ? "Completata" : "Apri"}
            </Link>
          </li>
          <li className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2">
            <span>Esercizio pratico</span>
            <Link href={`/percorso/${day}`} className="text-[var(--forest)]">
              Vai
            </Link>
          </li>
          <li className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2">
            <span>Riflessione / diario</span>
            <Link href="/diario/nuovo" className="text-[var(--forest)]">
              Scrivi
            </Link>
          </li>
          <li className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2">
            <span>Strumento rapido</span>
            <Link href="/strumenti" className="text-[var(--forest)]">
              Apri
            </Link>
          </li>
        </ul>
      </Card>

      <Card>
        <SectionTitle
          title="Riepilogo"
          action={
            <Link href="/diario" className="text-sm text-[var(--forest)]">
              Diario
            </Link>
          }
        />
        {!recentEmotions.length && !diary.length ? (
          <EmptyState
            title="Ancora nessun dato"
            description="Quando farai check-in o scriverai nel diario, qui vedrai un riepilogo reale."
          />
        ) : (
          <div className="space-y-3 text-sm">
            {recentEmotions.length ? (
              <div>
                <p className="mb-1 text-[var(--muted)]">Ultime emozioni</p>
                <div className="flex flex-wrap gap-2">
                  {recentEmotions.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-full bg-[color-mix(in_oklab,var(--sage)_16%,transparent)] px-2.5 py-1"
                    >
                      {emotionLabel(c.emotion)} · {c.intensity}/10
                      {c.date === todayKey() ? " (oggi)" : ""}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <p>
              Intensità media stress (7 giorni):{" "}
              <strong>{avgStress7 != null ? `${avgStress7}/10` : "n/d"}</strong>
            </p>
            <p>
              Intensità media check-in (7 giorni):{" "}
              <strong>{avgCheck7 != null ? `${avgCheck7}/10` : "n/d"}</strong>
            </p>
            <p className="text-xs text-[var(--muted)]">
              Nessun miglioramento inventato: solo dati che hai registrato.
            </p>
          </div>
        )}
      </Card>

      <Card className="flex items-start gap-3">
        <BookOpen className="mt-0.5 text-[var(--sage-deep)]" />
        <div>
          <p className="font-medium text-[var(--forest)]">Promemoria</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            EQUILIBRIO è uno strumento educativo e di benessere personale. Non è diagnostico e non
            sostituisce professionisti della salute mentale.
          </p>
        </div>
      </Card>
    </div>
  );
}
