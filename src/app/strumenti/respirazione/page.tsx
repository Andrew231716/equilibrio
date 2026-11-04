"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ToolField, ToolShell } from "@/components/tools/ToolShell";
import { Button } from "@/components/ui/Button";

export default function RespirazionePage() {
  const [inhale, setInhale] = useState(4);
  const [exhale, setExhale] = useState(6);
  const [cycles, setCycles] = useState(4);
  const [phase, setPhase] = useState<"idle" | "inhale" | "exhale">("idle");
  const [cycle, setCycle] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (phase === "idle") return;
    const duration = (phase === "inhale" ? inhale : exhale) * 1000;
    const t = setTimeout(() => {
      if (phase === "inhale") {
        setPhase("exhale");
      } else {
        const next = cycle + 1;
        if (next >= cycles) {
          setPhase("idle");
          setCycle(0);
        } else {
          setCycle(next);
          setPhase("inhale");
        }
      }
    }, duration);
    return () => clearTimeout(t);
  }, [phase, inhale, exhale, cycles, cycle]);

  return (
    <ToolShell
      toolId="respirazione"
      title="Respirazione guidata"
      description="Ritmi personalizzabili, senza apnee forzate. Preferisci un espirio più lungo dell'inspiro."
      canSave={true}
      collect={() => ({ inhale, exhale, cycles, note, completedCycles: cycle })}
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <NumberField label="Inspiro (s)" value={inhale} min={2} max={8} onChange={setInhale} />
        <NumberField label="Espirio (s)" value={exhale} min={3} max={10} onChange={setExhale} />
        <NumberField label="Cicli" value={cycles} min={1} max={12} onChange={setCycles} />
      </div>
      <div className="mb-5 flex flex-col items-center py-6">
        <motion.div
          className="flex h-40 w-40 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--sage)_30%,transparent)]"
          animate={{
            scale: phase === "inhale" ? 1.25 : phase === "exhale" ? 0.85 : 1,
          }}
          transition={{ duration: phase === "inhale" ? inhale : phase === "exhale" ? exhale : 0.4, ease: "easeInOut" }}
        >
          <span className="font-display text-xl text-[var(--forest)]">
            {phase === "idle" ? "Pronto" : phase === "inhale" ? "Inspira" : "Espira"}
          </span>
        </motion.div>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Ciclo {Math.min(cycle + (phase === "idle" ? 0 : 1), cycles)} / {cycles}
        </p>
        <div className="mt-4 flex gap-2">
          <Button type="button" onClick={() => { setCycle(0); setPhase("inhale"); }}>
            Avvia
          </Button>
          <Button type="button" variant="secondary" onClick={() => setPhase("idle")}>
            Ferma
          </Button>
        </div>
      </div>
      <ToolField label="Come ti senti dopo?" value={note} onChange={setNote} />
    </ToolShell>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        className="input"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
