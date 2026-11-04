import { format, isToday, parseISO, startOfDay, subDays } from "date-fns";
import { it } from "date-fns/locale";
import { MOTIVATIONAL_MESSAGES } from "./constants";
import type { EmotionId } from "@/types";
import { EMOTIONS, DIARY_CATEGORIES } from "./constants";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function todayKey(date = new Date()): string {
  return format(date, "yyyy-MM-dd");
}

export function formatDateIT(date: string | Date, pattern = "d MMMM yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, pattern, { locale: it });
}

export function greetingForNow(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Buongiorno";
  if (h < 18) return "Buon pomeriggio";
  return "Buonasera";
}

export function motivationalMessage(seed = todayKey()): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i) * (i + 1)) % 997;
  return MOTIVATIONAL_MESSAGES[hash % MOTIVATIONAL_MESSAGES.length];
}

export function emotionLabel(id: EmotionId): string {
  return EMOTIONS.find((e) => e.id === id)?.label ?? id;
}

export function emotionColor(id: EmotionId): string {
  return EMOTIONS.find((e) => e.id === id)?.color ?? "#7FA88A";
}

export function categoryLabel(id: string): string {
  return DIARY_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function average(nums: number[]): number | null {
  if (!nums.length) return null;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

export function inLastDays(isoDate: string, days: number, now = new Date()): boolean {
  const d = startOfDay(typeof isoDate === "string" && isoDate.length === 10 ? parseISO(isoDate) : parseISO(isoDate));
  const from = startOfDay(subDays(now, days - 1));
  return d >= from && d <= startOfDay(now);
}

export function isSameDayISO(iso: string, day = new Date()): boolean {
  try {
    if (iso.length === 10) return iso === todayKey(day);
    return isToday(parseISO(iso));
  } catch {
    return false;
  }
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
