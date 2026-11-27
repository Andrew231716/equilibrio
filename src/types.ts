export const SCHEMA_VERSION = 1
export const STORAGE_KEY = 'piano30.state.v1'

export type SexForFormula = 'male' | 'female' | 'unspecified'
export type DayStatus = 'not-started' | 'partial' | 'completed'
export type LunchRoutine = 'home' | 'other'
export type TabId = 'oggi' | 'piano' | 'alimentazione' | 'progressi' | 'profilo'

export type Habits = {
  portions: boolean
  protein: boolean
  fruitVegetables: boolean
  sweetsManaged: boolean
  hydration: boolean
  restAndAllowedActivity: boolean
}

export type HealthProfile = {
  lumbarDiscHernia: boolean
  radiatingLegPain: boolean
  previousInguinalHerniaRepair: boolean
  clinicianClearedActivity: boolean | null
  allowedActivities: string[]
  restrictedMovements: string[]
  notes?: string
}

export type UserProfile = {
  schemaVersion: number
  onboarded: boolean
  age: number
  sexForFormula: SexForFormula
  heightCm: number
  startWeightKg: number
  goalWeightKg: number
  startDate: string
  calorieTargetKcal: number
  proteinTargetG: number
  carbsTargetG: number
  fatTargetG: number
  lunchRoutine: LunchRoutine
  weekendMealsOut: number
  sweetsPreference: boolean
  health: HealthProfile
}

export type WeightEntry = {
  id: string
  date: string
  weightKg: number
  note?: string
}

export type WaistEntry = {
  id: string
  date: string
  waistCm: number
  note?: string
}

export type DailyActivity = {
  type: string
  durationMinutes?: number
  symptomsDuringOrAfter?: string
}

export type DailyLog = {
  date: string
  dayNumber: number
  habits: Habits
  dayStatus: DayStatus
  mealsOut?: number
  sweetsNote?: string
  notes?: string
  activity?: DailyActivity
}

export type AppState = {
  profile: UserProfile
  weightEntries: WeightEntry[]
  waistEntries: WaistEntry[]
  dailyLogs: DailyLog[]
}

export type ProgramDayInfo =
  | { kind: 'before'; startDate: string }
  | { kind: 'active'; dayNumber: number; phase: PhaseInfo }
  | { kind: 'after'; dayNumber: number }

export type PhaseInfo = {
  id: 1 | 2 | 3 | 4
  label: string
  range: string
  focus: string
}

export const HABIT_LABELS: Record<keyof Habits, string> = {
  portions: 'Ho rispettato le porzioni previste',
  protein: 'Ho assunto proteine nei pasti principali',
  fruitVegetables: 'Ho mangiato frutta e verdura',
  sweetsManaged: 'Ho gestito i dolci senza eccessi',
  hydration: 'Ho bevuto regolarmente',
  restAndAllowedActivity: 'Ho rispettato riposo e attività consentita',
}

export const EMPTY_HABITS: Habits = {
  portions: false,
  protein: false,
  fruitVegetables: false,
  sweetsManaged: false,
  hydration: false,
  restAndAllowedActivity: false,
}
