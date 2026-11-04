"use client";

import { useState } from "react";
import { ToolField, ToolShell } from "@/components/tools/ToolShell";
import { IntensitySlider } from "@/components/ui/IntensitySlider";

export default function PressionePage() {
  const [source, setSource] = useState("");
  const [intensity, setIntensity] = useState(6);
  const [goal, setGoal] = useState("");
  const [micro, setMicro] = useState("");
  const [when, setWhen] = useState("");

  return (
    <ToolShell
      toolId="pressione"
      title="Pressione → azione"
      description="Converti la pressione in un passo piccolo e realistico."
      canSave={source.trim().length > 0 && micro.trim().length > 0}
      collect={() => ({ source, intensity, goal, micro, when })}
    >
      <ToolField label="Da dove arriva la pressione?" value={source} onChange={setSource} />
      <div className="mb-3">
        <IntensitySlider label="Intensità pressione" value={intensity} onChange={setIntensity} />
      </div>
      <ToolField label="Obiettivo minimo" value={goal} onChange={setGoal} />
      <ToolField label="Micro-azione (≤10 minuti)" value={micro} onChange={setMicro} />
      <ToolField label="Quando la farò" value={when} onChange={setWhen} />
    </ToolShell>
  );
}
