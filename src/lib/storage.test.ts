import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '../types'
import {
  createDefaultState,
  exportStateJson,
  importStateJson,
  loadState,
  saveState,
} from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads defaults when empty', () => {
    const state = loadState()
    expect(state.profile.startWeightKg).toBe(88)
    expect(state.profile.heightCm).toBe(180)
    expect(state.profile.goalWeightKg).toBe(80)
    expect(state.profile.calorieTargetKcal).toBe(1900)
    expect(state.waistEntries).toEqual([])
  })

  it('persists and reloads', () => {
    const state = createDefaultState()
    state.profile.onboarded = true
    state.profile.age = 27
    saveState(state)
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy()
    const loaded = loadState()
    expect(loaded.profile.age).toBe(27)
    expect(loaded.profile.onboarded).toBe(true)
  })

  it('survives malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')
    const state = loadState()
    expect(state.profile.startWeightKg).toBe(88)
  })

  it('exports and imports JSON roundtrip', () => {
    const state = createDefaultState()
    state.dailyLogs.push({
      date: state.profile.startDate,
      dayNumber: 1,
      habits: {
        portions: true,
        protein: false,
        fruitVegetables: false,
        sweetsManaged: false,
        hydration: true,
        restAndAllowedActivity: false,
      },
      dayStatus: 'partial',
    })
    const json = exportStateJson(state)
    const imported = importStateJson(json)
    expect(imported?.dailyLogs).toHaveLength(1)
    expect(imported?.dailyLogs[0].habits.portions).toBe(true)
  })

  it('rejects invalid import payload', () => {
    expect(importStateJson('[]')).toBeNull()
  })
})
