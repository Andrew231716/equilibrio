"use client";

import { useState } from "react";
import { ToolField, ToolShell } from "@/components/tools/ToolShell";

export default function PensieriPage() {
  const [situation, setSituation] = useState("");
  const [automatic, setAutomatic] = useState("");
  const [evidenceFor, setEvidenceFor] = useState("");
  const [evidenceAgainst, setEvidenceAgainst] = useState("");
  const [alternative, setAlternative] = useState("");

  return (
    <ToolShell
      toolId="pensieri"
      title="Analisi dei pensieri"
      description="Distingui fatti, interpretazioni e alternative più utili."
      canSave={situation.trim().length > 0 && automatic.trim().length > 0}
      collect={() => ({ situation, automatic, evidenceFor, evidenceAgainst, alternative })}
    >
      <ToolField label="Situazione" value={situation} onChange={setSituation} />
      <ToolField label="Pensiero automatico" value={automatic} onChange={setAutomatic} />
      <ToolField label="Prove a favore" value={evidenceFor} onChange={setEvidenceFor} />
      <ToolField label="Prove contro" value={evidenceAgainst} onChange={setEvidenceAgainst} />
      <ToolField label="Pensiero alternativo equilibrato" value={alternative} onChange={setAlternative} />
    </ToolShell>
  );
}
