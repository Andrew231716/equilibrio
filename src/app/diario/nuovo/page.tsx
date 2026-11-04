"use client";

import { useRouter } from "next/navigation";
import { DiaryForm } from "@/components/forms/DiaryForm";
import { Card, SectionTitle } from "@/components/ui/Card";
import type { DiaryFormValues } from "@/lib/schemas";
import { useAppStore } from "@/stores/app-store";

export default function NuovoDiarioPage() {
  const router = useRouter();
  const addDiaryEntry = useAppStore((s) => s.addDiaryEntry);

  function onSubmit(values: DiaryFormValues) {
    const id = addDiaryEntry({
      ...values,
      datetime: new Date(values.datetime).toISOString(),
      source: "diario",
    });
    router.push(`/diario/${id}`);
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-[var(--forest)]">Nuova voce</h1>
      <Card>
        <SectionTitle title="Descrivi la situazione" subtitle="Tutti i campi principali aiutano l'osservazione; quelli opzionali approfondiscono." />
        <DiaryForm onSubmit={onSubmit} />
      </Card>
    </div>
  );
}
