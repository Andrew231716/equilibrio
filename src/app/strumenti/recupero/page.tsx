"use client";

import { useState } from "react";
import { ToolField, ToolShell } from "@/components/tools/ToolShell";

const SUGGESTIONS = [
  "Bere un bicchiere d'acqua lentamente",
  "Camminare 5 minuti senza telefono",
  "Scrivere 5 righe di scarico",
  "Respirare 4 cicli lunghi",
  "Preparare una sola priorità per domani",
];

export default function RecuperoPage() {
  const [hardDay, setHardDay] = useState("");
  const [chosen, setChosen] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [effect, setEffect] = useState("");

  function toggle(item: string) {
    setChosen((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
  }

  return (
    <ToolShell
      toolId="recupero"
      title="Recupero mentale"
      description="Ripristina energie dopo una giornata impegnativa con un mini-rituale."
      canSave={hardDay.trim().length > 0 && (chosen.length > 0 || custom.trim().length > 0)}
      collect={() => ({ hardDay, chosen, custom, effect })}
    >
      <ToolField label="Cosa ha reso difficile la giornata?" value={hardDay} onChange={setHardDay} />
      <p className="label">Scegli elementi del rituale</p>
      <ul className="mb-3 space-y-2">
        {SUGGESTIONS.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => toggle(s)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${chosen.includes(s) ? "border-[var(--sage-deep)] bg-[color-mix(in_oklab,var(--sage)_16%,transparent)]" : "border-[var(--border)]"}`}
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
      <ToolField label="Altro elemento personale" value={custom} onChange={setCustom} />
      <ToolField label="Effetto dopo il rituale" value={effect} onChange={setEffect} />
    </ToolShell>
  );
}
