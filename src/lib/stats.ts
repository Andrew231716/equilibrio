import { format, parseISO, subDays, startOfDay } from "date-fns";
import type { DailyCheckIn, EmotionId, StressEntry, DiaryCategory } from "@/types";
import { average, emotionLabel, categoryLabel } from "./utils";

export type RangeKey = "7" | "30" | "90" | "all";

export function filterByRange<T extends { datetime?: string; date?: string; createdAt?: string }>(
  items: T[],
  range: RangeKey,
  field: "datetime" | "date" | "createdAt" = "createdAt",
): T[] {
  if (range === "all") return items;
  const days = Number(range);
  const from = startOfDay(subDays(new Date(), days - 1));
  return items.filter((item) => {
    const raw = (item[field] as string | undefined) ?? item.createdAt ?? "";
    if (!raw) return false;
    const d = startOfDay(parseISO(raw.length === 10 ? raw : raw));
    return d >= from;
  });
}

export function stressSeries(entries: StressEntry[], range: RangeKey) {
  const filtered = filterByRange(entries, range, "datetime");
  const map = new Map<string, number[]>();
  for (const e of filtered) {
    const key = e.datetime.slice(0, 10);
    const arr = map.get(key) ?? [];
    arr.push(e.stressIntensity);
    map.set(key, arr);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({ date, label: format(parseISO(date), "dd/MM"), media: average(vals) ?? 0 }));
}

export function emotionFrequency(entries: StressEntry[], checkIns: DailyCheckIn[], range: RangeKey) {
  const diary = filterByRange(entries, range, "datetime");
  const checks = filterByRange(checkIns, range, "date");
  const counts = new Map<EmotionId, number>();
  for (const e of diary) {
    counts.set(e.primaryEmotion, (counts.get(e.primaryEmotion) ?? 0) + 1);
  }
  for (const c of checks) {
    counts.set(c.emotion, (counts.get(c.emotion) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([emotion, count]) => ({ emotion, label: emotionLabel(emotion), count }))
    .sort((a, b) => b.count - a.count);
}

export function categoryFrequency(entries: StressEntry[], range: RangeKey) {
  const filtered = filterByRange(entries, range, "datetime");
  const counts = new Map<DiaryCategory, number>();
  for (const e of filtered) {
    counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, label: categoryLabel(category), count }))
    .sort((a, b) => b.count - a.count);
}

export function weeklyAverage(entries: StressEntry[]) {
  const last7 = filterByRange(entries, "7", "datetime");
  return average(last7.map((e) => e.stressIntensity));
}

export function checkInAverage(checkIns: DailyCheckIn[], range: RangeKey = "7") {
  const filtered = filterByRange(checkIns, range, "date");
  return average(filtered.map((c) => c.intensity));
}

export function descriptiveObservations(params: {
  entries: StressEntry[];
  checkIns: DailyCheckIn[];
  range: RangeKey;
}): string[] {
  const { entries, checkIns, range } = params;
  const notes: string[] = [];
  const diary = filterByRange(entries, range, "datetime");
  const checks = filterByRange(checkIns, range, "date");

  if (!diary.length && !checks.length) {
    return ["Non ci sono ancora dati sufficienti in questo periodo per formulare osservazioni."];
  }

  const avg = average(diary.map((e) => e.stressIntensity));
  if (avg != null) {
    notes.push(`Intensità media dello stress annotato: ${avg}/10 su ${diary.length} voci del diario.`);
  }

  const emotions = emotionFrequency(entries, checkIns, range);
  if (emotions[0]) {
    notes.push(`Emozione più frequente: ${emotions[0].label} (${emotions[0].count} volte).`);
  }

  const cats = categoryFrequency(entries, range);
  if (cats[0]) {
    notes.push(`Ambito più presente nel diario: ${cats[0].label}.`);
  }

  const withStrategy = diary.filter((e) => e.strategy && e.strategy.trim()).length;
  if (diary.length) {
    notes.push(
      withStrategy
        ? `Hai indicato una strategia in ${withStrategy} su ${diary.length} voci.`
        : `Nelle voci di questo periodo non risultano ancora strategie annotate.`,
    );
  }

  notes.push("Queste osservazioni descrivono i tuoi dati: non sono diagnosi né relazioni causali.");
  return notes;
}
