"use client";

import { useState } from "react";
import { EMOTIONS } from "@/lib/constants";
import { todayKey } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import type { EmotionId } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { IntensitySlider } from "@/components/ui/IntensitySlider";

export function CheckInCard() {
  const checkIns = useAppStore((s) => s.checkIns);
  const addCheckIn = useAppStore((s) => s.addCheckIn);
  const today = todayKey();
  const existing = checkIns.find((c) => c.date === today);

  const [emotion, setEmotion] = useState<EmotionId>(existing?.emotion ?? "sereno");
  const [intensity, setIntensity] = useState(existing?.intensity ?? 5);
  const [note, setNote] = useState(existing?.note ?? "");
  const [situation, setSituation] = useState(existing?.situation ?? "");
  const [saved, setSaved] = useState(false);

  function submit() {
    addCheckIn({ date: today, emotion, intensity, note, situation });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card>
      <SectionTitle
        title="Come ti senti oggi?"
        subtitle={existing ? "Puoi aggiornare il check-in di oggi." : "Un check-in rapido per osservarti."}
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {EMOTIONS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setEmotion(e.id)}
            className="rounded-xl border px-2 py-2 text-sm transition"
            style={{
              borderColor: emotion === e.id ? e.color : "var(--border)",
              background:
                emotion === e.id ? `color-mix(in oklab, ${e.color} 22%, transparent)` : "transparent",
            }}
          >
            {e.label}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        <IntensitySlider label="Intensità" value={intensity} onChange={setIntensity} />
        <div>
          <label className="label" htmlFor="situation">
            Situazione (opzionale)
          </label>
          <input
            id="situation"
            className="input"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="Cosa sta succedendo?"
          />
        </div>
        <div>
          <label className="label" htmlFor="note">
            Nota
          </label>
          <textarea
            id="note"
            className="textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Un pensiero breve…"
          />
        </div>
        <Button type="button" onClick={submit} className="w-full sm:w-auto">
          {saved ? "Salvato" : existing ? "Aggiorna check-in" : "Salva check-in"}
        </Button>
      </div>
    </Card>
  );
}
