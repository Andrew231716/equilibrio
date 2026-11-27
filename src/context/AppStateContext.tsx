import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  deriveDayStatus,
  getProgramDay,
} from '../lib/calculations'
import { todayIso } from '../lib/dates'
import {
  clearState,
  createDefaultState,
  exportStateJson,
  exportWeightsCsv,
  importStateJson,
  loadState,
  saveState,
} from '../lib/storage'
import type {
  AppState,
  DailyLog,
  Habits,
  TabId,
  UserProfile,
  WaistEntry,
  WeightEntry,
} from '../types'
import { EMPTY_HABITS } from '../types'

type AppContextValue = {
  state: AppState
  tab: TabId
  setTab: (tab: TabId) => void
  selectedPlanDay: number | null
  setSelectedPlanDay: (day: number | null) => void
  updateProfile: (patch: Partial<UserProfile>) => void
  completeOnboarding: (profile: UserProfile) => void
  getLogForDate: (date: string) => DailyLog
  upsertLog: (date: string, patch: Partial<DailyLog>) => void
  toggleHabit: (date: string, key: keyof Habits) => void
  addWeight: (entry: Omit<WeightEntry, 'id'>) => void
  updateWeight: (id: string, patch: Partial<WeightEntry>) => void
  deleteWeight: (id: string) => void
  addWaist: (entry: Omit<WaistEntry, 'id'>) => void
  updateWaist: (id: string, patch: Partial<WaistEntry>) => void
  deleteWaist: (id: string) => void
  exportJson: () => string
  exportCsv: () => string
  importJson: (json: string) => boolean
  resetAll: () => void
  startNewCycle: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

function ensureLog(state: AppState, date: string): DailyLog {
  const existing = state.dailyLogs.find((l) => l.date === date)
  if (existing) return existing
  const info = getProgramDay(state.profile.startDate, date)
  const dayNumber =
    info.kind === 'active'
      ? info.dayNumber
      : info.kind === 'after'
        ? Math.min(30, info.dayNumber)
        : 0
  return {
    date,
    dayNumber,
    habits: { ...EMPTY_HABITS },
    dayStatus: 'not-started',
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())
  const [tab, setTab] = useState<TabId>('oggi')
  const [selectedPlanDay, setSelectedPlanDay] = useState<number | null>(null)

  useEffect(() => {
    saveState(state)
  }, [state])

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
    }))
  }, [])

  const completeOnboarding = useCallback((profile: UserProfile) => {
    setState((prev) => {
      const hasInitial = prev.weightEntries.some(
        (w) => w.note === 'Peso iniziale' || w.date === profile.startDate,
      )
      const weightEntries = hasInitial
        ? prev.weightEntries.map((w) =>
            w.note === 'Peso iniziale'
              ? { ...w, date: profile.startDate, weightKg: profile.startWeightKg }
              : w,
          )
        : [
            {
              id: crypto.randomUUID(),
              date: profile.startDate,
              weightKg: profile.startWeightKg,
              note: 'Peso iniziale',
            },
            ...prev.weightEntries,
          ]
      return {
        ...prev,
        profile: { ...profile, onboarded: true },
        weightEntries,
      }
    })
    setTab('oggi')
  }, [])

  const getLogForDate = useCallback(
    (date: string) => ensureLog(state, date),
    [state],
  )

  const upsertLog = useCallback((date: string, patch: Partial<DailyLog>) => {
    setState((prev) => {
      const base = ensureLog(prev, date)
      const next: DailyLog = {
        ...base,
        ...patch,
        date,
        habits: patch.habits ?? base.habits,
      }
      if (!patch.dayStatus && patch.habits) {
        next.dayStatus = deriveDayStatus(next.habits)
      }
      const others = prev.dailyLogs.filter((l) => l.date !== date)
      return { ...prev, dailyLogs: [...others, next] }
    })
  }, [])

  const toggleHabit = useCallback((date: string, key: keyof Habits) => {
    setState((prev) => {
      const base = ensureLog(prev, date)
      const habits = { ...base.habits, [key]: !base.habits[key] }
      const next: DailyLog = {
        ...base,
        habits,
        dayStatus: deriveDayStatus(habits),
      }
      const others = prev.dailyLogs.filter((l) => l.date !== date)
      return { ...prev, dailyLogs: [...others, next] }
    })
  }, [])

  const addWeight = useCallback((entry: Omit<WeightEntry, 'id'>) => {
    setState((prev) => ({
      ...prev,
      weightEntries: [
        ...prev.weightEntries,
        { ...entry, id: crypto.randomUUID() },
      ],
    }))
  }, [])

  const updateWeight = useCallback((id: string, patch: Partial<WeightEntry>) => {
    setState((prev) => ({
      ...prev,
      weightEntries: prev.weightEntries.map((w) =>
        w.id === id ? { ...w, ...patch } : w,
      ),
    }))
  }, [])

  const deleteWeight = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      weightEntries: prev.weightEntries.filter((w) => w.id !== id),
    }))
  }, [])

  const addWaist = useCallback((entry: Omit<WaistEntry, 'id'>) => {
    setState((prev) => ({
      ...prev,
      waistEntries: [
        ...prev.waistEntries,
        { ...entry, id: crypto.randomUUID() },
      ],
    }))
  }, [])

  const updateWaist = useCallback((id: string, patch: Partial<WaistEntry>) => {
    setState((prev) => ({
      ...prev,
      waistEntries: prev.waistEntries.map((w) =>
        w.id === id ? { ...w, ...patch } : w,
      ),
    }))
  }, [])

  const deleteWaist = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      waistEntries: prev.waistEntries.filter((w) => w.id !== id),
    }))
  }, [])

  const exportJson = useCallback(() => exportStateJson(state), [state])
  const exportCsv = useCallback(() => exportWeightsCsv(state), [state])

  const importJson = useCallback((json: string) => {
    const imported = importStateJson(json)
    if (!imported) return false
    setState(imported)
    return true
  }, [])

  const resetAll = useCallback(() => {
    clearState()
    setState(createDefaultState())
    setTab('oggi')
    setSelectedPlanDay(null)
  }, [])

  const startNewCycle = useCallback(() => {
    setState((prev) => {
      const startDate = todayIso()
      const latest =
        [...prev.weightEntries].sort((a, b) => a.date.localeCompare(b.date)).at(-1)
          ?.weightKg ?? prev.profile.startWeightKg
      return {
        profile: {
          ...prev.profile,
          startDate,
          startWeightKg: latest,
          onboarded: true,
        },
        weightEntries: [
          {
            id: crypto.randomUUID(),
            date: startDate,
            weightKg: latest,
            note: 'Inizio nuovo ciclo',
          },
        ],
        waistEntries: [],
        dailyLogs: [],
      }
    })
    setTab('oggi')
    setSelectedPlanDay(null)
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      tab,
      setTab,
      selectedPlanDay,
      setSelectedPlanDay,
      updateProfile,
      completeOnboarding,
      getLogForDate,
      upsertLog,
      toggleHabit,
      addWeight,
      updateWeight,
      deleteWeight,
      addWaist,
      updateWaist,
      deleteWaist,
      exportJson,
      exportCsv,
      importJson,
      resetAll,
      startNewCycle,
    }),
    [
      state,
      tab,
      selectedPlanDay,
      updateProfile,
      completeOnboarding,
      getLogForDate,
      upsertLog,
      toggleHabit,
      addWeight,
      updateWeight,
      deleteWeight,
      addWaist,
      updateWaist,
      deleteWaist,
      exportJson,
      exportCsv,
      importJson,
      resetAll,
      startNewCycle,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppState deve essere usato dentro AppStateProvider')
  return ctx
}
