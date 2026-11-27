import type { AppState, DailyLog, Habits, UserProfile, WaistEntry, WeightEntry } from '../types'
import { EMPTY_HABITS, SCHEMA_VERSION } from '../types'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function validateWeightKg(value: number): string | null {
  if (!Number.isFinite(value)) return 'Inserisci un peso valido'
  if (value < 30 || value > 300) return 'Il peso deve essere tra 30 e 300 kg'
  return null
}

export function validateHeightCm(value: number): string | null {
  if (!Number.isFinite(value)) return 'Inserisci un’altezza valida'
  if (value < 100 || value > 250) return 'L’altezza deve essere tra 100 e 250 cm'
  return null
}

export function validateWaistCm(value: number): string | null {
  if (!Number.isFinite(value)) return 'Inserisci una misura valida'
  if (value < 40 || value > 200) return 'La circonferenza deve essere tra 40 e 200 cm'
  return null
}

export function validateAge(value: number): string | null {
  if (!Number.isFinite(value)) return 'Inserisci un’età valida'
  if (value < 14 || value > 100) return 'L’età deve essere tra 14 e 100 anni'
  return null
}

export function validateDate(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Data non valida'
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return 'Data non valida'
  }
  return null
}

function parseHabits(raw: unknown): Habits {
  if (!isObject(raw)) return { ...EMPTY_HABITS }
  return {
    portions: Boolean(raw.portions),
    protein: Boolean(raw.protein),
    fruitVegetables: Boolean(raw.fruitVegetables),
    sweetsManaged: Boolean(raw.sweetsManaged),
    hydration: Boolean(raw.hydration),
    restAndAllowedActivity: Boolean(raw.restAndAllowedActivity),
  }
}

function parseProfile(raw: unknown, fallback: UserProfile): UserProfile {
  if (!isObject(raw)) return fallback
  const healthRaw = isObject(raw.health) ? raw.health : {}
  return {
    ...fallback,
    ...raw,
    schemaVersion: SCHEMA_VERSION,
    onboarded: Boolean(raw.onboarded),
    age: isFiniteNumber(raw.age) ? raw.age : fallback.age,
    sexForFormula:
      raw.sexForFormula === 'male' ||
      raw.sexForFormula === 'female' ||
      raw.sexForFormula === 'unspecified'
        ? raw.sexForFormula
        : fallback.sexForFormula,
    heightCm: isFiniteNumber(raw.heightCm) ? raw.heightCm : fallback.heightCm,
    startWeightKg: isFiniteNumber(raw.startWeightKg) ? raw.startWeightKg : fallback.startWeightKg,
    goalWeightKg: isFiniteNumber(raw.goalWeightKg) ? raw.goalWeightKg : fallback.goalWeightKg,
    startDate: isString(raw.startDate) ? raw.startDate : fallback.startDate,
    calorieTargetKcal: isFiniteNumber(raw.calorieTargetKcal)
      ? raw.calorieTargetKcal
      : fallback.calorieTargetKcal,
    proteinTargetG: isFiniteNumber(raw.proteinTargetG) ? raw.proteinTargetG : fallback.proteinTargetG,
    carbsTargetG: isFiniteNumber(raw.carbsTargetG) ? raw.carbsTargetG : fallback.carbsTargetG,
    fatTargetG: isFiniteNumber(raw.fatTargetG) ? raw.fatTargetG : fallback.fatTargetG,
    lunchRoutine: raw.lunchRoutine === 'other' ? 'other' : 'home',
    weekendMealsOut: isFiniteNumber(raw.weekendMealsOut)
      ? raw.weekendMealsOut
      : fallback.weekendMealsOut,
    sweetsPreference: Boolean(raw.sweetsPreference ?? fallback.sweetsPreference),
    health: {
      lumbarDiscHernia: Boolean(
        healthRaw.lumbarDiscHernia ?? fallback.health.lumbarDiscHernia,
      ),
      radiatingLegPain: Boolean(
        healthRaw.radiatingLegPain ?? fallback.health.radiatingLegPain,
      ),
      previousInguinalHerniaRepair: Boolean(
        healthRaw.previousInguinalHerniaRepair ??
          fallback.health.previousInguinalHerniaRepair,
      ),
      clinicianClearedActivity:
        healthRaw.clinicianClearedActivity === true
          ? true
          : healthRaw.clinicianClearedActivity === false
            ? false
            : null,
      allowedActivities: Array.isArray(healthRaw.allowedActivities)
        ? healthRaw.allowedActivities.filter(isString)
        : [],
      restrictedMovements: Array.isArray(healthRaw.restrictedMovements)
        ? healthRaw.restrictedMovements.filter(isString)
        : [],
      notes: isString(healthRaw.notes) ? healthRaw.notes : undefined,
    },
  }
}

function parseWeightEntries(raw: unknown): WeightEntry[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(isObject)
    .map((item) => ({
      id: isString(item.id) ? item.id : crypto.randomUUID(),
      date: isString(item.date) ? item.date : '',
      weightKg: isFiniteNumber(item.weightKg) ? item.weightKg : NaN,
      note: isString(item.note) ? item.note : undefined,
    }))
    .filter((e) => e.date && Number.isFinite(e.weightKg))
}

function parseWaistEntries(raw: unknown): WaistEntry[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(isObject)
    .map((item) => ({
      id: isString(item.id) ? item.id : crypto.randomUUID(),
      date: isString(item.date) ? item.date : '',
      waistCm: isFiniteNumber(item.waistCm) ? item.waistCm : NaN,
      note: isString(item.note) ? item.note : undefined,
    }))
    .filter((e) => e.date && Number.isFinite(e.waistCm))
}

function parseDailyLogs(raw: unknown): DailyLog[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(isObject)
    .map((item) => {
      const habits = parseHabits(item.habits)
      const status =
        item.dayStatus === 'completed' ||
        item.dayStatus === 'partial' ||
        item.dayStatus === 'not-started'
          ? item.dayStatus
          : 'not-started'
      return {
        date: isString(item.date) ? item.date : '',
        dayNumber: isFiniteNumber(item.dayNumber) ? item.dayNumber : 0,
        habits,
        dayStatus: status,
        mealsOut: isFiniteNumber(item.mealsOut) ? item.mealsOut : undefined,
        sweetsNote: isString(item.sweetsNote) ? item.sweetsNote : undefined,
        notes: isString(item.notes) ? item.notes : undefined,
        activity: isObject(item.activity)
          ? {
              type: isString(item.activity.type) ? item.activity.type : '',
              durationMinutes: isFiniteNumber(item.activity.durationMinutes)
                ? item.activity.durationMinutes
                : undefined,
              symptomsDuringOrAfter: isString(item.activity.symptomsDuringOrAfter)
                ? item.activity.symptomsDuringOrAfter
                : undefined,
            }
          : undefined,
      } satisfies DailyLog
    })
    .filter((e) => e.date)
}

export function parseAppState(raw: unknown, fallback: AppState): AppState | null {
  if (!isObject(raw)) return null
  try {
    return {
      profile: parseProfile(raw.profile, fallback.profile),
      weightEntries: parseWeightEntries(raw.weightEntries),
      waistEntries: parseWaistEntries(raw.waistEntries),
      dailyLogs: parseDailyLogs(raw.dailyLogs),
    }
  } catch {
    return null
  }
}
