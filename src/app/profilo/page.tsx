"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { downloadJson } from "@/lib/utils";
import type { ThemeMode } from "@/types";
import { useAppStore } from "@/stores/app-store";

export default function ProfiloPage() {
  const preferences = useAppStore((s) => s.preferences);
  const updatePreferences = useAppStore((s) => s.updatePreferences);
  const setTheme = useAppStore((s) => s.setTheme);
  const addGoal = useAppStore((s) => s.addGoal);
  const toggleGoal = useAppStore((s) => s.toggleGoal);
  const deleteGoal = useAppStore((s) => s.deleteGoal);
  const exportData = useAppStore((s) => s.exportData);
  const importData = useAppStore((s) => s.importData);
  const resetAllData = useAppStore((s) => s.resetAllData);
  const restartPath = useAppStore((s) => s.restartPath);
  const fileRef = useRef<HTMLInputElement>(null);
  const [goalText, setGoalText] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [pendingImport, setPendingImport] = useState<string | null>(null);
  const [importMsg, setImportMsg] = useState("");

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl text-[var(--forest)]">Profilo e impostazioni</h1>
        <p className="mt-2 text-[var(--muted)]">
          I tuoi dati restano sul dispositivo. Nessun account obbligatorio.
        </p>
      </header>

      <Card>
        <SectionTitle title="Profilo" />
        <div className="space-y-3">
          <div>
            <label className="label" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              className="input"
              value={preferences.name}
              onChange={(e) => updatePreferences({ name: e.target.value })}
              placeholder="Come vuoi essere chiamato/a?"
            />
          </div>
          <div>
            <label className="label" htmlFor="startDate">
              Data inizio percorso
            </label>
            <input
              id="startDate"
              type="date"
              className="input"
              value={preferences.startDate}
              onChange={(e) => updatePreferences({ startDate: e.target.value })}
            />
          </div>
          <p className="text-sm text-[var(--muted)]">Ciclo percorso attuale: {preferences.pathCycle}</p>
        </div>
      </Card>

      <Card>
        <SectionTitle title="Obiettivi personali" />
        <div className="mb-3 flex gap-2">
          <input
            className="input"
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            placeholder="Nuovo obiettivo"
          />
          <Button
            type="button"
            onClick={() => {
              if (!goalText.trim()) return;
              addGoal(goalText.trim());
              setGoalText("");
            }}
          >
            Aggiungi
          </Button>
        </div>
        <ul className="space-y-2">
          {preferences.goals.map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] px-3 py-2">
              <button type="button" className="text-left text-sm" onClick={() => toggleGoal(g.id)}>
                <span className={g.completed ? "line-through text-[var(--muted)]" : ""}>{g.text}</span>
              </button>
              <button type="button" className="text-xs text-[var(--danger)]" onClick={() => deleteGoal(g.id)}>
                Elimina
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionTitle title="Tema" />
        <div className="flex flex-wrap gap-2">
          {([
            ["light", "Chiaro"],
            ["dark", "Scuro"],
            ["system", "Sistema"],
          ] as [ThemeMode, string][]).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={`rounded-full border px-3 py-1.5 text-sm ${preferences.theme === value ? "border-[var(--sage-deep)] bg-[color-mix(in_oklab,var(--sage)_16%,transparent)]" : "border-[var(--border)]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle title="Promemoria locali" subtitle="Solo preferenza locale: nessuna notifica push remota." />
        <label className="mb-3 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={preferences.remindersEnabled}
            onChange={(e) => updatePreferences({ remindersEnabled: e.target.checked })}
          />
          Attiva promemoria (promemoria visuale in-app)
        </label>
        <div>
          <label className="label" htmlFor="reminderTime">
            Orario preferito
          </label>
          <input
            id="reminderTime"
            type="time"
            className="input"
            value={preferences.reminderTime}
            onChange={(e) => updatePreferences({ reminderTime: e.target.value })}
          />
        </div>
        <div className="mt-3">
          <label className="label" htmlFor="weeklyGoal">
            Obiettivo giorni/settimana
          </label>
          <input
            id="weeklyGoal"
            type="number"
            min={1}
            max={7}
            className="input"
            value={preferences.weeklyGoalDays}
            onChange={(e) => updatePreferences({ weeklyGoalDays: Math.min(7, Math.max(1, Number(e.target.value) || 1)) })}
          />
        </div>
      </Card>

      <Card>
        <SectionTitle title="Privacy e backup" />
        <p className="mb-3 text-sm text-[var(--muted)]">
          I dati sono salvati nel browser di questo dispositivo. Esporta un backup prima di cambiare
          dispositivo o cancellare i dati del browser. Importare un backup sostituisce i dati attuali.
        </p>
        <label className="mb-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={preferences.aiConsent}
            onChange={(e) => updatePreferences({ aiConsent: e.target.checked })}
          />
          Consenso futuro ad assistenza AI (disattivato di default; nessuna AI attiva ora)
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => downloadJson(`equilibrio-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.parse(exportData()))}
          >
            Esporta backup
          </Button>
          <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
            Importa backup
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                if (file.size > 10 * 1024 * 1024) {
                  setImportMsg("File troppo grande: massimo 10 MB.");
                  return;
                }
                const text = await file.text();
                setPendingImport(text);
              } catch {
                setImportMsg("Impossibile leggere il file. Riprova.");
              } finally {
                e.target.value = "";
              }
            }}
          />
        </div>
        {importMsg ? <p className="mt-2 text-sm text-[var(--sage-deep)]">{importMsg}</p> : null}
      </Card>

      <Card>
        <SectionTitle title="Percorso e dati" />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => setConfirmRestart(true)}>
            Ripeti percorso 30 giorni
          </Button>
          <Button type="button" variant="danger" onClick={() => setConfirmReset(true)}>
            Elimina tutti i dati
          </Button>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">
          Ripetere il percorso azzera solo i progressi delle lezioni e incrementa il ciclo, senza cancellare
          diario, check-in e sessioni.
        </p>
      </Card>

      <ConfirmDialog
        open={pendingImport !== null}
        title="Importare il backup?"
        description="Il backup sostituirà tutti i dati attuali su questo dispositivo. Esporta prima una copia se vuoi conservarli."
        confirmLabel="Importa e sostituisci"
        onCancel={() => setPendingImport(null)}
        onConfirm={() => {
          const result = importData(pendingImport ?? "");
          setImportMsg(result.ok ? "Importazione completata." : result.error ?? "Errore importazione");
          setPendingImport(null);
        }}
      />
      <ConfirmDialog
        open={confirmReset}
        title="Eliminare tutti i dati?"
        description="Check-in, diario, progressi, revisioni e preferenze verranno rimossi definitivamente da questo dispositivo."
        confirmLabel="Elimina tutto"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetAllData();
          setConfirmReset(false);
        }}
      />
      <ConfirmDialog
        open={confirmRestart}
        title="Ripetere il percorso?"
        description="I progressi delle 30 lezioni verranno azzerati. Diario e storico restano."
        confirmLabel="Ripeti percorso"
        onCancel={() => setConfirmRestart(false)}
        onConfirm={() => {
          restartPath();
          setConfirmRestart(false);
        }}
      />
    </div>
  );
}
