"use client";

import { useState } from "react";
import { ToolField, ToolShell } from "@/components/tools/ToolShell";

export default function ControlloPage() {
  const [situation, setSituation] = useState("");
  const [control, setControl] = useState("");
  const [influence, setInfluence] = useState("");
  const [accept, setAccept] = useState("");
  const [action, setAction] = useState("");

  return (
    <ToolShell
      toolId="controllo"
      title="Cerchio del controllo"
      description="Separa ciò che puoi controllare, influenzare o accettare."
      canSave={situation.trim().length > 0 && control.trim().length > 0}
      collect={() => ({ situation, control, influence, accept, action })}
    >
      <ToolField label="Situazione" value={situation} onChange={setSituation} />
      <ToolField label="Posso controllare" value={control} onChange={setControl} />
      <ToolField label="Posso influenzare" value={influence} onChange={setInfluence} />
      <ToolField label="Non controllo (accettare)" value={accept} onChange={setAccept} />
      <ToolField label="Azione sul controllabile" value={action} onChange={setAction} />
    </ToolShell>
  );
}
