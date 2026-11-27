import type { AppState, UserProfile } from '../types'
import { SCHEMA_VERSION, STORAGE_KEY } from '../types'
import { todayIso } from './dates'
import { parseAppState } from './validation'

export function createDefaultProfile(): UserProfile {
  return {
    schemaVersion: SCHEMA_VERSION,
    onboarded: false,
    age: 26,
    sexForFormula: 'male',
    heightCm: 180,
    startWeightKg: 88,
    goalWeightKg: 80,
    startDate: todayIso(),
    calorieTargetKcal: 1900,
    proteinTargetG: 130,
    carbsTargetG: 200,
    fatTargetG: 65,
    lunchRoutine: 'home',
    weekendMealsOut: 2,
    sweetsPreference: true,
    health: {
      lumbarDiscHernia: true,
      radiatingLegPain: true,
      previousInguinalHerniaRepair: true,
      clinicianClearedActivity: null,
      allowedActivities: [],
      restrictedMovements: [],
    },
  }
}

export function createDefaultState(): AppState {
  const profile = createDefaultProfile()
  return {
    profile,
    weightEntries: [
      {
        id: crypto.randomUUID(),
        date: profile.startDate,
        weightKg: profile.startWeightKg,
        note: 'Peso iniziale',
      },
    ],
    waistEntries: [],
    dailyLogs: [],
  }
}

export function loadState(): AppState {
  const fallback = createDefaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as unknown
    const state = parseAppState(parsed, fallback)
    return state ?? fallback
  } catch {
    return fallback
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function exportStateJson(state: AppState): string {
  return JSON.stringify(state, null, 2)
}

export function importStateJson(json: string): AppState | null {
  try {
    const parsed = JSON.parse(json) as unknown
    return parseAppState(parsed, createDefaultState())
  } catch {
    return null
  }
}

export function exportWeightsCsv(state: AppState): string {
  const lines = ['tipo,data,valore,unita,nota']
  for (const w of state.weightEntries) {
    lines.push(
      `peso,${w.date},${w.weightKg},kg,"${(w.note ?? '').replace(/"/g, '""')}"`,
    )
  }
  for (const w of state.waistEntries) {
    lines.push(
      `girovita,${w.date},${w.waistCm},cm,"${(w.note ?? '').replace(/"/g, '""')}"`,
    )
  }
  return lines.join('\n')
}
