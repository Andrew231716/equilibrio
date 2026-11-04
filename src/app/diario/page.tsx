"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { it } from "date-fns/locale";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { DIARY_CATEGORIES, EMOTIONS } from "@/lib/constants";
import { categoryLabel, emotionLabel, formatDateIT } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import type { DiaryCategory, EmotionId } from "@/types";

export default function DiarioPage() {
  const diary = useAppStore((s) => s.diary);
  const deleteDiaryEntry = useAppStore((s) => s.deleteDiaryEntry);

  const [q, setQ] = useState("");
  const [emotion, setEmotion] = useState<EmotionId | "">("");
  const [category, setCategory] = useState<DiaryCategory | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [month, setMonth] = useState(new Date());

  const filtered = useMemo(() => {
    return diary.filter((e) => {
      if (emotion && e.primaryEmotion !== emotion) return false;
      if (category && e.category !== category) return false;
      if (from && e.datetime.slice(0, 10) < from) return false;
      if (to && e.datetime.slice(0, 10) > to) return false;
      if (q) {
        const hay = `${e.description} ${e.thoughts ?? ""} ${e.strategy ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [diary, emotion, category, from, to, q]);

  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-[var(--forest)]">Diario dello stress</h1>
          <p className="mt-2 text-[var(--muted)]">Privato e salvato solo sul tuo dispositivo.</p>
        </div>
        <Link href="/diario/nuovo" className="btn btn-primary">
          <Plus size={16} /> Nuova voce
        </Link>
      </header>

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-3 text-[var(--muted)]" size={16} />
            <input
              className="input pl-9"
              placeholder="Cerca…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className="select" value={emotion} onChange={(e) => setEmotion(e.target.value as EmotionId | "")}>
            <option value="">Tutte le emozioni</option>
            {EMOTIONS.map((em) => (
              <option key={em.id} value={em.id}>
                {em.label}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value as DiaryCategory | "")}
          >
            <option value="">Tutti gli ambiti</option>
            {DIARY_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              className={`btn flex-1 ${view === "list" ? "btn-secondary" : "btn-ghost"}`}
              onClick={() => setView("list")}
            >
              Lista
            </button>
            <button
              type="button"
              className={`btn flex-1 ${view === "calendar" ? "btn-secondary" : "btn-ghost"}`}
              onClick={() => setView("calendar")}
            >
              Calendario
            </button>
          </div>
          <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </Card>

      {view === "calendar" ? (
        <Card>
          <SectionTitle
            title={format(month, "MMMM yyyy", { locale: it })}
            action={
              <div className="flex gap-2">
                <Button variant="ghost" type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
                  ←
                </Button>
                <Button variant="ghost" type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
                  →
                </Button>
              </div>
            }
          />
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--muted)]">
            {["L", "M", "M", "G", "V", "S", "D"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
            {Array.from({ length: (days[0].getDay() + 6) % 7 }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {days.map((d) => {
              const has = diary.some((e) => isSameDay(parseISO(e.datetime), d));
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  className={`rounded-lg py-2 ${has ? "bg-[color-mix(in_oklab,var(--sage)_28%,transparent)] text-[var(--forest)]" : ""}`}
                  onClick={() => {
                    setFrom(format(d, "yyyy-MM-dd"));
                    setTo(format(d, "yyyy-MM-dd"));
                    setView("list");
                  }}
                >
                  {format(d, "d")}
                </button>
              );
            })}
          </div>
        </Card>
      ) : null}

      {!filtered.length ? (
        <EmptyState
          title="Nessuna voce"
          description="Scrivi la prima situazione o modifica i filtri."
          action={
            <Link href="/diario/nuovo" className="btn btn-primary">
              Nuova voce
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((e) => (
            <li key={e.id}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <Link href={`/diario/${e.id}`} className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--muted)]">
                    {formatDateIT(e.datetime, "d MMM yyyy · HH:mm")} · {categoryLabel(e.category)}
                  </p>
                  <p className="mt-1 font-medium text-[var(--forest)]">{emotionLabel(e.primaryEmotion)} · stress {e.stressIntensity}/10</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{e.description}</p>
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 self-start text-sm text-[var(--danger)]"
                  onClick={() => setDeleteId(e.id)}
                >
                  <Trash2 size={14} /> Elimina
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminare questa voce?"
        description="L'azione è definitiva. La voce verrà rimossa dal dispositivo."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteDiaryEntry(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
