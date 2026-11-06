"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DiaryForm } from "@/components/forms/DiaryForm";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { DiaryFormValues } from "@/lib/schemas";
import { localDateTime } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

export default function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const entry = useAppStore((s) => s.diary.find((d) => d.id === id));
  const updateDiaryEntry = useAppStore((s) => s.updateDiaryEntry);
  const deleteDiaryEntry = useAppStore((s) => s.deleteDiaryEntry);
  const [confirm, setConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!entry) {
    return (
      <Card>
        <p>Voce non trovata.</p>
        <Button className="mt-3" type="button" onClick={() => router.push("/diario")}>
          Torna al diario
        </Button>
      </Card>
    );
  }

  function onSubmit(values: DiaryFormValues) {
    updateDiaryEntry(entry!.id, {
      ...values,
      datetime: new Date(values.datetime).toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-[var(--forest)]">Modifica voce</h1>
        <Button variant="danger" type="button" onClick={() => setConfirm(true)}>
          Elimina
        </Button>
      </div>
      <Card>
        <SectionTitle title="Dettaglio" subtitle={saved ? "Salvato." : "Modifica e salva."} />
        <DiaryForm
          key={entry.id}
          defaultValues={{
            ...entry,
            datetime: localDateTime(entry.datetime),
          }}
          onSubmit={onSubmit}
          submitLabel="Aggiorna voce"
        />
      </Card>
      <ConfirmDialog
        open={confirm}
        title="Eliminare definitivamente?"
        description="Questa voce del diario verrà rimossa dal dispositivo."
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          deleteDiaryEntry(entry.id);
          router.push("/diario");
        }}
      />
    </div>
  );
}
