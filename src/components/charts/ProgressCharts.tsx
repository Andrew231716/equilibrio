"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RangeKey } from "@/lib/stats";
import {
  categoryFrequency,
  descriptiveObservations,
  emotionFrequency,
  stressSeries,
} from "@/lib/stats";
import { useAppStore } from "@/stores/app-store";
import { Card, SectionTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export function ProgressCharts({ range }: { range: RangeKey }) {
  const diary = useAppStore((s) => s.diary);
  const checkIns = useAppStore((s) => s.checkIns);
  const series = stressSeries(diary, range);
  const emotions = emotionFrequency(diary, checkIns, range).slice(0, 6);
  const categories = categoryFrequency(diary, range).slice(0, 6);
  const observations = descriptiveObservations({ entries: diary, checkIns, range });

  if (!series.length && !emotions.length) {
    return (
      <EmptyState
        title="Nessuna statistica ancora"
        description="Quando annoterai check-in e voci di diario, i grafici si popoleranno con i tuoi dati reali."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle title="Intensità stress nel tempo" />
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" stroke="var(--muted)" fontSize={12} />
              <YAxis domain={[0, 10]} stroke="var(--muted)" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="media" stroke="var(--sage-deep)" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <SectionTitle title="Emozioni frequenti" />
          <div className="h-56 w-full">
            <ResponsiveContainer>
              <BarChart data={emotions}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--muted)" fontSize={11} />
                <YAxis allowDecimals={false} stroke="var(--muted)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--sage)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionTitle title="Situazioni più stressanti" />
          <div className="h-56 w-full">
            <ResponsiveContainer>
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--muted)" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} stroke="var(--muted)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--forest)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle title="Osservazioni dai tuoi dati" />
        <ul className="space-y-2 text-sm text-[var(--muted)]">
          {observations.map((o) => (
            <li key={o}>• {o}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
