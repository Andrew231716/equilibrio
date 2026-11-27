import type {
  DailyLog,
  Habits,
  PhaseInfo,
  ProgramDayInfo,
  SexForFormula,
  WaistEntry,
  WeightEntry,
} from '../types'
import { daysBetween, weekKey } from './dates'

export const PHASES: PhaseInfo[] = [
  {
    id: 1,
    label: 'Partenza',
    range: 'Giorni 1–7',
    focus: 'Organizza i pasti, raccogli peso iniziale e prima misura vita.',
  },
  {
    id: 2,
    label: 'Regolarità',
    range: 'Giorni 8–14',
    focus: 'Stabilisci una routine e verifica fame ed energia.',
  },
  {
    id: 3,
    label: 'Consolidamento',
    range: 'Giorni 15–21',
    focus: 'Rafforza le abitudini e aggiorna le misure.',
  },
  {
    id: 4,
    label: 'Valutazione',
    range: 'Giorni 22–30',
    focus: 'Mantieni le abitudini e prepara il report finale.',
  },
]

export function getPhaseForDay(dayNumber: number): PhaseInfo {
  if (dayNumber <= 7) return PHASES[0]
  if (dayNumber <= 14) return PHASES[1]
  if (dayNumber <= 21) return PHASES[2]
  return PHASES[3]
}

export function getProgramDay(startDate: string, currentDate: string): ProgramDayInfo {
  const diff = daysBetween(startDate, currentDate) + 1
  if (diff < 1) {
    return { kind: 'before', startDate }
  }
  if (diff > 30) {
    return { kind: 'after', dayNumber: diff }
  }
  return { kind: 'active', dayNumber: diff, phase: getPhaseForDay(diff) }
}

export function dateForProgramDay(startDate: string, dayNumber: number): string {
  const [y, m, d] = startDate.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + (dayNumber - 1))
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

export function calcBmi(weightKg: number, heightCm: number): number | null {
  if (!weightKg || !heightCm || heightCm <= 0) return null
  const h = heightCm / 100
  return Math.round((weightKg / (h * h)) * 10) / 10
}

export function calcBmr(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: SexForFormula,
): number | null {
  if (!weightKg || !heightCm || !age || sex === 'unspecified') return null
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return Math.round(sex === 'male' ? base + 5 : base - 161)
}

export function calcSedentaryTdee(bmr: number | null): number | null {
  if (bmr == null) return null
  return Math.round(bmr * 1.2)
}

export function habitCompletionCount(habits: Habits): number {
  return Object.values(habits).filter(Boolean).length
}

export function deriveDayStatus(habits: Habits): DailyLog['dayStatus'] {
  const done = habitCompletionCount(habits)
  if (done === 0) return 'not-started'
  if (done === 6) return 'completed'
  return 'partial'
}

export function weeklyWeightAverages(
  entries: WeightEntry[],
): { week: string; average: number; count: number }[] {
  const groups = new Map<string, number[]>()
  for (const entry of entries) {
    const key = weekKey(entry.date)
    const list = groups.get(key) ?? []
    list.push(entry.weightKg)
    groups.set(key, list)
  }
  return [...groups.entries()]
    .map(([week, values]) => ({
      week,
      count: values.length,
      average:
        values.length >= 2
          ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
          : NaN,
    }))
    .sort((a, b) => a.week.localeCompare(b.week))
}

export function waistVariation(entries: WaistEntry[]): number | null {
  if (entries.length < 2) return null
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted[0].waistCm
  const last = sorted[sorted.length - 1].waistCm
  return Math.round((last - first) * 10) / 10
}

export function weightDelta(startKg: number, latestKg: number | null): number | null {
  if (latestKg == null) return null
  return Math.round((latestKg - startKg) * 10) / 10
}

export function latestWeight(entries: WeightEntry[]): WeightEntry | null {
  if (!entries.length) return null
  return [...entries].sort((a, b) => a.date.localeCompare(b.date)).at(-1) ?? null
}

export function latestWaist(entries: WaistEntry[]): WaistEntry | null {
  if (!entries.length) return null
  return [...entries].sort((a, b) => a.date.localeCompare(b.date)).at(-1) ?? null
}

export function canShowPrescribedActivity(
  clinicianClearedActivity: boolean | null,
): boolean {
  return clinicianClearedActivity === true
}

export function adherenceSummary(logs: DailyLog[]): {
  completed: number
  partial: number
  notStarted: number
  habitTotals: Record<keyof Habits, number>
} {
  const habitTotals: Record<keyof Habits, number> = {
    portions: 0,
    protein: 0,
    fruitVegetables: 0,
    sweetsManaged: 0,
    hydration: 0,
    restAndAllowedActivity: 0,
  }
  let completed = 0
  let partial = 0
  let notStarted = 0
  for (const log of logs) {
    if (log.dayStatus === 'completed') completed += 1
    else if (log.dayStatus === 'partial') partial += 1
    else notStarted += 1
    for (const key of Object.keys(habitTotals) as (keyof Habits)[]) {
      if (log.habits[key]) habitTotals[key] += 1
    }
  }
  return { completed, partial, notStarted, habitTotals }
}
