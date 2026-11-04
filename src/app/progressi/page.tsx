"use client";

import { useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { ProgressCharts } from "@/components/charts/ProgressCharts";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { BADGE_DEFS } from "@/lib/constants";
import { exportWeeklyReviewPdf } from "@/lib/pdf";
import type { RangeKey } from "@/lib/stats";
import {
  categoryFrequency,
  emotionFrequency,
  filterByRange,
  weeklyAverage,
} from "@/lib/stats";
import { formatDateIT } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

export default function ProgressiPage() {
  const [range, setRange] = useState<RangeKey>("30");
  const diary = useAppStore((s) => s.diary);
  const checkIns = useAppStore((s) => s.checkIns);
  const badges = useAppStore((s) => s.badges);
  const weeklyReviews = useAppStore((s) => s.weeklyReviews);
  const addWeeklyReview = useAppStore((s) => s.addWeeklyReview);
  const preferences = useAppStore((s) => s.preferences);
  const completedLessons = useAppStore((s) => s.completedLessonsCount)();
  const [notes, setNotes] = useState("");
  const [strengths, setStrengths] = useState("");
  const [focusAreas, setFocusAreas] = useState("");

  const weekDiary = useMemo(() => filterByRange(diary, "7", "datetime"), [diary]);
  const weekChecks = useMemo(() => filterByRange(checkIns, "7", "date"), [checkIns]);

  function createWeeklyReview() {
    const weekEnd = format(new Date(), "yyyy-MM-dd");
    const weekStart = format(subDays(new Date(), 6), "yyyy-MM-dd");
    addWeeklyReview({
      weekStart,
      weekEnd,
      entriesCount: weekDiary.length,
      checkInsCount: weekChecks.length,
      avgStress: weeklyAverage(diary),
      topEmotions: emotionFrequency(diary, checkIns, "7").slice(0, 3),
      topCategories: categoryFrequency(diary, "7").slice(0, 3),
      strategiesUsed: weekDiary.map((e) => e.strategy).filter((s): s is string => !!s && s.trim().length > 0),
      notes,
      strengths,
      focusAreas,
    });
    setNotes("");
    setStrengths("");
    setFocusAreas("");
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl text-[var(--forest)]">Progressi</h1>
        <p className="mt-2 text-[var(--muted)]">
          Grafici e revisioni basati solo sui dati che hai registrato.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(["7", "30", "90", "all"] as RangeKey[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={`rounded-full border px-3 py-1.5 text-sm ${range === r ? "border-[var(--sage-deep)] bg-[color-mix(in_oklab,var(--sage)_18%,transparent)]" : "border-[var(--border)]"}`}
          >
            {r === "all" ? "Tutto" : `${r} giorni`}
          </button>
        ))}
      </div>

      <ProgressCharts range={range} />

      <Card>
        <SectionTitle title="Traguardi" subtitle={`${completedLessons}/30 lezioni · ${badges.length} badge`} />
        <div className="grid gap-2 sm:grid-cols-2">
          {BADGE_DEFS.map((b) => {
            const unlocked = badges.find((x) => x.id === b.id);
            return (
              <div
                key={b.id}
                className={`rounded-xl border px-3 py-3 ${unlocked ? "border-[var(--sage-deep)] bg-[color-mix(in_oklab,var(--sage)_12%,transparent)]" : "border-[var(--border)] opacity-60"}`}
              >
                <p className="font-medium">{b.title}</p>
                <p className="text-xs text-[var(--muted)]">{b.description}</p>
                {unlocked ? (
                  <p className="mt-1 text-xs text-[var(--sage-deep)]">
                    Sbloccato {formatDateIT(unlocked.unlockedAt, "d MMM yyyy")}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <SectionTitle
          title="Revisione settimanale"
          subtitle="Genera un bilancio dagli ultimi 7 giorni di dati."
        />
        <div className="mb-3 grid gap-2 text-sm text-[var(--muted)] sm:grid-cols-3">
          <p>Voci diario: {weekDiary.length}</p>
          <p>Check-in: {weekChecks.length}</p>
          <p>Media stress: {weeklyAverage(diary) ?? "n/d"}</p>
        </div>
        <div className="space-y-3">
          <textarea className="textarea" placeholder="Note" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <textarea className="textarea" placeholder="Punti di forza osservati" value={strengths} onChange={(e) => setStrengths(e.target.value)} />
          <textarea className="textarea" placeholder="Aree di lavoro" value={focusAreas} onChange={(e) => setFocusAreas(e.target.value)} />
          <Button type="button" onClick={createWeeklyReview} disabled={!weekDiary.length && !weekChecks.length}>
            Crea revisione
          </Button>
        </div>
      </Card>

      {!weeklyReviews.length ? (
        <EmptyState title="Nessuna revisione salvata" description="Quando crei una revisione settimanale apparirà qui, con export PDF." />
      ) : (
        <ul className="space-y-3">
          {weeklyReviews.map((r) => (
            <li key={r.id}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-[var(--forest)]">
                    {formatDateIT(r.weekStart)} – {formatDateIT(r.weekEnd)}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Media stress {r.avgStress ?? "n/d"} · {r.entriesCount} voci · {r.checkInsCount} check-in
                  </p>
                </div>
                <Button type="button" variant="secondary" onClick={() => exportWeeklyReviewPdf(r, preferences.name)}>
                  Esporta PDF
                </Button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
