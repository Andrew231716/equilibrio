"use client";

import { useEffect, useState } from "react";
import { ToolField, ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/Button";

export default function PausaPage() {
  const [seconds, setSeconds] = useState(60);
  const [left, setLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState("");
  const [body, setBody] = useState("");
  const [intention, setIntention] = useState("");

  useEffect(() => {
    if (!running || left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, left]);

  return (
    <ToolShell
      toolId="pausa"
      title="Pausa consapevole"
      description="Ferma il pilota automatico per 1-3 minuti e riprendi contatto con te stesso."
      canSave={notice.trim().length > 0}
      collect={() => ({ seconds, notice, body, intention })}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="label mb-0">Durata</label>
        {[60, 120, 180].map((s) => (
          <button
            key={s}
            type="button"
            className={`rounded-full border px-3 py-1 text-sm ${seconds === s ? "border-[var(--sage-deep)] bg-[color-mix(in_oklab,var(--sage)_18%,transparent)]" : "border-[var(--border)]"}`}
            onClick={() => {
              setSeconds(s);
              setLeft(s);
              setRunning(false);
            }}
          >
            {s / 60} min
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-col items-center justify-center rounded-3xl bg-[color-mix(in_oklab,var(--sage)_14%,transparent)] py-10">
        <p className="font-display text-5xl text-[var(--forest)]">{left}s</p>
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            onClick={() => {
              if (left === 0) setLeft(seconds);
              setRunning(true);
            }}
          >
            Avvia
          </Button>
          <Button type="button" variant="secondary" onClick={() => setRunning(false)}>
            Pausa
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setRunning(false);
              setLeft(seconds);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <ToolField label="Cosa noti adesso?" value={notice} onChange={setNotice} />
      <ToolField label="Segnali del corpo" value={body} onChange={setBody} />
      <ToolField label="Intenzione per i prossimi minuti" value={intention} onChange={setIntention} />
    </ToolShell>
  );
}
