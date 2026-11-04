"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { getLesson } from "@/data/lessons";
import { useAppStore } from "@/stores/app-store";

export default function LessonDayPage() {
  const params = useParams<{ day: string }>();
  const router = useRouter();
  const day = Number(params.day);
  const lesson = getLesson(day);
  const progress = useAppStore((s) => s.lessonProgress[day]);
  const upsert = useAppStore((s) => s.upsertLessonProgress);
  const completeLesson = useAppStore((s) => s.completeLesson);

  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>(
    progress?.exerciseAnswers ?? {},
  );
  const [reflectionAnswers, setReflectionAnswers] = useState<Record<string, string>>(
    progress?.reflectionAnswers ?? {},
  );
  const [completedActivities, setCompletedActivities] = useState<string[]>(
    progress?.completedActivities ?? [],
  );
  const [notes, setNotes] = useState(progress?.notes ?? "");
  const [message, setMessage] = useState("");

  const canComplete = useMemo(() => {
    if (!lesson) return false;
    const exercisesFilled = lesson.exercise.prompts.every(
      (_, i) => (exerciseAnswers[`p${i}`] ?? "").trim().length > 0,
    );
    const reflectionsFilled = lesson.reflectionQuestions.every(
      (_, i) => (reflectionAnswers[`r${i}`] ?? "").trim().length > 0,
    );
    const activitiesDone = lesson.activities.every((a) => completedActivities.includes(a.id));
    return exercisesFilled && reflectionsFilled && activitiesDone;
  }, [lesson, exerciseAnswers, reflectionAnswers, completedActivities]);

  if (!lesson || Number.isNaN(day) || day < 1 || day > 30) {
    return (
      <Card>
        <p>Giorno non trovato.</p>
        <Link href="/percorso" className="btn btn-secondary mt-3 inline-flex">
          Torna al percorso
        </Link>
      </Card>
    );
  }

  function saveProgress(completed = false) {
    upsert(day, {
      exerciseAnswers,
      reflectionAnswers,
      completedActivities,
      notes,
    });
    if (completed) {
      completeLesson(day);
      setMessage("Giorno completato e salvato.");
    } else {
      setMessage("Progresso salvato.");
    }
  }

  function toggleActivity(id: string) {
    setCompletedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-[var(--muted)]"
          onClick={() => router.push("/percorso")}
        >
          <ArrowLeft size={16} /> Percorso
        </button>
        <span className="text-sm text-[var(--muted)]">
          Modulo {lesson.module} · Giorno {lesson.day}
        </span>
      </div>

      <header className="rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--sage)_10%,var(--bg-elevated))] p-5">
        <p className="text-sm text-[var(--muted)]">{lesson.moduleTitle}</p>
        <h1 className="font-display mt-1 text-3xl text-[var(--forest)]">{lesson.title}</h1>
        <p className="mt-3 text-[var(--muted)]">
          <strong className="text-[var(--fg)]">Obiettivo:</strong> {lesson.objective}
        </p>
        {progress?.completed ? (
          <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--sage-deep)] px-3 py-1 text-sm text-white">
            <Check size={14} /> Completato
          </p>
        ) : null}
      </header>

      <Card>
        <SectionTitle title="Spiegazione" />
        <div className="prose-eq whitespace-pre-line text-sm">{lesson.theory}</div>
      </Card>

      <Card>
        <SectionTitle title="Esempio concreto" />
        <p className="text-sm text-[var(--muted)]">{lesson.example}</p>
      </Card>

      <Card>
        <SectionTitle title={`Esercizio: ${lesson.exercise.title}`} subtitle={lesson.exercise.instructions} />
        <div className="space-y-3">
          {lesson.exercise.prompts.map((prompt, i) => (
            <div key={prompt}>
              <label className="label" htmlFor={`p${i}`}>
                {prompt}
              </label>
              <textarea
                id={`p${i}`}
                className="textarea"
                value={exerciseAnswers[`p${i}`] ?? ""}
                onChange={(e) => setExerciseAnswers((s) => ({ ...s, [`p${i}`]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Domande di riflessione" />
        <div className="space-y-3">
          {lesson.reflectionQuestions.map((q, i) => (
            <div key={q}>
              <label className="label" htmlFor={`r${i}`}>
                {q}
              </label>
              <textarea
                id={`r${i}`}
                className="textarea"
                value={reflectionAnswers[`r${i}`] ?? ""}
                onChange={(e) => setReflectionAnswers((s) => ({ ...s, [`r${i}`]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Attività da completare" />
        <ul className="space-y-2">
          {lesson.activities.map((a) => {
            const done = completedActivities.includes(a.id);
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => toggleActivity(a.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] px-3 py-2 text-left"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border ${done ? "border-[var(--sage-deep)] bg-[var(--sage-deep)] text-white" : "border-[var(--border)]"}`}
                  >
                    {done ? <Check size={12} /> : null}
                  </span>
                  {a.label}
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <SectionTitle title="Riepilogo del giorno" subtitle={lesson.summary} />
        <label className="label" htmlFor="notes">
          Note personali
        </label>
        <textarea
          id="notes"
          className="textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Cosa vuoi ricordare di oggi?"
        />
      </Card>

      {message ? <p className="text-sm text-[var(--sage-deep)]">{message}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => saveProgress(false)}>
          Salva progresso
        </Button>
        <Button
          type="button"
          onClick={() => saveProgress(true)}
          disabled={!canComplete && !progress?.completed}
          title={!canComplete ? "Completa esercizio, riflessioni e attività" : undefined}
        >
          Segna come completato
        </Button>
      </div>

      <div className="flex justify-between pt-2">
        {day > 1 ? (
          <Link href={`/percorso/${day - 1}`} className="btn btn-ghost">
            <ArrowLeft size={16} /> Giorno {day - 1}
          </Link>
        ) : (
          <span />
        )}
        {day < 30 ? (
          <Link href={`/percorso/${day + 1}`} className="btn btn-ghost">
            Giorno {day + 1} <ArrowRight size={16} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
