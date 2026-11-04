"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { IntensitySlider } from "@/components/ui/IntensitySlider";
import { EMOTIONS } from "@/lib/constants";
import type { EmotionId } from "@/types";
import { useAppStore } from "@/stores/app-store";

const STEPS = [
  {
    key: "stop",
    title: "Stop",
    help: "Interrompi il pilota automatico. Nota cosa sta succedendo prima di reagire.",
  },
  {
    key: "observe",
    title: "Tieni sotto osservazione",
    help: "Osserva emozioni, intensità, pensieri e fatti senza giudicare.",
  },
  {
    key: "analyze",
    title: "Analizza",
    help: "Separa problema reale, pensieri automatici, interpretazioni e ciò che puoi controllare.",
  },
  {
    key: "respond",
    title: "Rispondi",
    help: "Scegli una risposta utile, un pensiero più equilibrato e un prossimo passo.",
  },
] as const;

export default function StarPage() {
  const router = useRouter();
  const saveStarSession = useAppStore((s) => s.saveStarSession);
  const addDiaryEntry = useAppStore((s) => s.addDiaryEntry);
  const [step, setStep] = useState(0);
  const [doneId, setDoneId] = useState<string | null>(null);

  const [stop, setStop] = useState({ situation: "", bodySignals: "", urge: "" });
  const [observe, setObserve] = useState({
    emotion: "stressato" as EmotionId,
    intensity: 5,
    thoughts: "",
    facts: "",
  });
  const [analyze, setAnalyze] = useState({
    realProblem: "",
    automaticThoughts: "",
    interpretations: "",
    controllable: "",
    notControllable: "",
  });
  const [respond, setRespond] = useState({
    chosenAction: "",
    helpfulThought: "",
    nextStep: "",
  });

  function canNext() {
    if (step === 0) return stop.situation.trim().length > 2;
    if (step === 1) return observe.facts.trim().length > 0;
    if (step === 2) return analyze.realProblem.trim().length > 0;
    if (step === 3) return respond.chosenAction.trim().length > 0 && respond.nextStep.trim().length > 0;
    return false;
  }

  function save(toDiary: boolean) {
    let diaryEntryId: string | undefined;
    if (toDiary) {
      diaryEntryId = addDiaryEntry({
        datetime: new Date().toISOString(),
        category: "altro",
        description: stop.situation,
        primaryEmotion: observe.emotion,
        secondaryEmotions: [],
        emotionIntensity: observe.intensity,
        stressIntensity: observe.intensity,
        thoughts: `${observe.thoughts}\n\nAutomatici: ${analyze.automaticThoughts}`,
        reaction: respond.chosenAction,
        physicalSymptoms: stop.bodySignals,
        strategy: `S.T.A.R. → ${respond.nextStep}`,
        outcome: respond.helpfulThought,
        couldDoDifferently: analyze.interpretations,
        learned: `Controllabile: ${analyze.controllable}. Non controllabile: ${analyze.notControllable}.`,
        source: "star",
      });
    }
    const sessionId = saveStarSession({
      stop,
      observe,
      analyze,
      respond,
      savedToDiary: toDiary,
      diaryEntryId,
    });
    setDoneId(sessionId);
  }

  if (doneId) {
    return (
      <Card>
        <SectionTitle title="Sessione S.T.A.R. salvata" subtitle="Puoi rivedere i dati nel diario e negli strumenti usati." />
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={() => router.push("/diario")}>
            Vai al diario
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/strumenti")}>
            Altri strumenti
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-3xl text-[var(--forest)]">Metodo S.T.A.R.</h1>
        <p className="mt-2 text-[var(--muted)]">Passo {step + 1} di 4 · {STEPS[step].title}</p>
      </header>

      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[var(--sage-deep)]" : "bg-[var(--sand)]"}`}
          />
        ))}
      </div>

      <Card>
        <SectionTitle title={STEPS[step].title} subtitle={STEPS[step].help} />

        {step === 0 && (
          <div className="space-y-3">
            <Field label="Cosa sta succedendo?" value={stop.situation} onChange={(v) => setStop({ ...stop, situation: v })} />
            <Field label="Segnali del corpo" value={stop.bodySignals} onChange={(v) => setStop({ ...stop, bodySignals: v })} />
            <Field label="Impulso di reazione" value={stop.urge} onChange={(v) => setStop({ ...stop, urge: v })} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p className="label">Emozione</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {EMOTIONS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className="rounded-xl border px-2 py-2 text-sm"
                  style={{
                    borderColor: observe.emotion === e.id ? e.color : "var(--border)",
                    background:
                      observe.emotion === e.id
                        ? `color-mix(in oklab, ${e.color} 20%, transparent)`
                        : "transparent",
                  }}
                  onClick={() => setObserve({ ...observe, emotion: e.id })}
                >
                  {e.label}
                </button>
              ))}
            </div>
            <IntensitySlider
              label="Intensità"
              value={observe.intensity}
              onChange={(intensity) => setObserve({ ...observe, intensity })}
            />
            <Field label="Pensieri presenti" value={observe.thoughts} onChange={(v) => setObserve({ ...observe, thoughts: v })} />
            <Field label="Fatti osservabili" value={observe.facts} onChange={(v) => setObserve({ ...observe, facts: v })} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Field label="Problema reale" value={analyze.realProblem} onChange={(v) => setAnalyze({ ...analyze, realProblem: v })} />
            <Field label="Pensieri automatici" value={analyze.automaticThoughts} onChange={(v) => setAnalyze({ ...analyze, automaticThoughts: v })} />
            <Field label="Interpretazioni" value={analyze.interpretations} onChange={(v) => setAnalyze({ ...analyze, interpretations: v })} />
            <Field label="Cosa posso controllare" value={analyze.controllable} onChange={(v) => setAnalyze({ ...analyze, controllable: v })} />
            <Field label="Cosa non posso controllare" value={analyze.notControllable} onChange={(v) => setAnalyze({ ...analyze, notControllable: v })} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="rounded-xl bg-[color-mix(in_oklab,var(--sage)_12%,transparent)] p-3 text-sm text-[var(--muted)]">
              <p>
                <strong className="text-[var(--fg)]">Situazione:</strong> {stop.situation}
              </p>
              <p className="mt-1">
                <strong className="text-[var(--fg)]">Problema reale:</strong> {analyze.realProblem}
              </p>
            </div>
            <Field label="Risposta scelta" value={respond.chosenAction} onChange={(v) => setRespond({ ...respond, chosenAction: v })} />
            <Field label="Pensiero più utile" value={respond.helpfulThought} onChange={(v) => setRespond({ ...respond, helpfulThought: v })} />
            <Field label="Prossimo passo concreto" value={respond.nextStep} onChange={(v) => setRespond({ ...respond, nextStep: v })} />
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Indietro
        </Button>
        {step < 3 ? (
          <Button type="button" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
            Avanti
          </Button>
        ) : (
          <>
            <Button type="button" disabled={!canNext()} onClick={() => save(false)}>
              Salva sessione
            </Button>
            <Button type="button" variant="secondary" disabled={!canNext()} onClick={() => save(true)}>
              Salva anche nel diario
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea className="textarea" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
