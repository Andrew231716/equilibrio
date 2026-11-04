"use client";

import { useState } from "react";
import { ToolField, ToolShell } from "@/components/tools/ToolShell";
import { IntensitySlider } from "@/components/ui/IntensitySlider";

export default function FrustrazionePage() {
  const [trigger, setTrigger] = useState("");
  const [intensity, setIntensity] = useState(6);
  const [obstacle, setObstacle] = useState("");
  const [need, setNeed] = useState("");
  const [step, setStep] = useState("");

  return (
    <ToolShell
      toolId="frustrazione"
      title="Gestione frustrazione"
      description="Trasforma l'irritazione in chiarezza e un passo concreto."
      canSave={trigger.trim().length > 0 && step.trim().length > 0}
      collect={() => ({ trigger, intensity, obstacle, need, step })}
    >
      <ToolField label="Cosa mi frustra" value={trigger} onChange={setTrigger} />
      <div className="mb-3">
        <IntensitySlider label="Intensità" value={intensity} onChange={setIntensity} />
      </div>
      <ToolField label="Ostacolo concreto" value={obstacle} onChange={setObstacle} />
      <ToolField label="Bisogno sottostante" value={need} onChange={setNeed} />
      <ToolField label="Passo da 5 minuti" value={step} onChange={setStep} />
    </ToolShell>
  );
}
