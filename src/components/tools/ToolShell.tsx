"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, SectionTitle } from "@/components/ui/Card";
import { useAppStore } from "@/stores/app-store";

export function ToolShell({
  toolId,
  title,
  description,
  children,
  collect,
  canSave,
}: {
  toolId: string;
  title: string;
  description: string;
  children: React.ReactNode;
  collect: () => Record<string, string | number | string[]>;
  canSave: boolean;
}) {
  const saveToolSession = useAppStore((s) => s.saveToolSession);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-4">
      <Link href="/strumenti" className="inline-flex items-center gap-1 text-sm text-[var(--muted)]">
        <ArrowLeft size={16} /> Strumenti
      </Link>
      <header>
        <h1 className="font-display text-3xl text-[var(--forest)]">{title}</h1>
        <p className="mt-2 text-[var(--muted)]">{description}</p>
      </header>
      <Card>
        <SectionTitle title="Esercizio guidato" />
        {children}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={!canSave}
            onClick={() => {
              saveToolSession(toolId, collect());
              setSaved(true);
            }}
          >
            {saved ? "Salvato" : "Salva sessione"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function ToolField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      <label className="label">{label}</label>
      <textarea
        className="textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
