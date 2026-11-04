"use client";

import Link from "next/link";
import {
  Brain,
  CircleDot,
  Flame,
  Leaf,
  Pause,
  Sparkles,
  Target,
  Wind,
} from "lucide-react";
import { Card, SectionTitle } from "@/components/ui/Card";
import { TOOLS } from "@/lib/constants";

const icons = {
  Pause,
  Wind,
  Brain,
  CircleDot,
  Flame,
  Target,
  Leaf,
} as const;

export default function StrumentiPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl text-[var(--forest)]">Strumenti</h1>
        <p className="mt-2 text-[var(--muted)]">
          Pratiche guidate da usare nel momento. Il metodo S.T.A.R. è il percorso completo in 4 passi.
        </p>
      </header>

      <Link
        href="/strumenti/star"
        className="block overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--forest)_10%,var(--bg-elevated))] p-5"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="text-[var(--forest)]" />
          <div>
            <h2 className="font-display text-2xl text-[var(--forest)]">Metodo S.T.A.R.</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Stop → Tieni sotto osservazione → Analizza → Rispondi. Wizard completo con salvataggio nel diario.
            </p>
          </div>
        </div>
      </Link>

      <div className="grid gap-3 sm:grid-cols-2">
        {TOOLS.map((tool) => {
          const Icon = icons[tool.icon as keyof typeof icons] ?? Pause;
          return (
            <Link key={tool.id} href={`/strumenti/${tool.slug}`}>
              <Card className="h-full transition hover:border-[var(--sage-deep)]">
                <div className="flex items-start gap-3">
                  <span className="rounded-2xl bg-[color-mix(in_oklab,var(--sage)_18%,transparent)] p-2 text-[var(--forest)]">
                    <Icon size={20} />
                  </span>
                  <div>
                    <SectionTitle title={tool.title} />
                    <p className="text-sm text-[var(--muted)]">{tool.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
