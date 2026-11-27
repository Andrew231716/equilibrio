import { describe, expect, it } from 'vitest'
import {
  calcBmr,
  calcSedentaryTdee,
  canShowPrescribedActivity,
  dateForProgramDay,
  deriveDayStatus,
  getPhaseForDay,
  getProgramDay,
  waistVariation,
  weeklyWeightAverages,
} from './calculations'
import { EMPTY_HABITS } from '../types'

describe('getProgramDay', () => {
  it('returns before when current date precedes start', () => {
    expect(getProgramDay('2026-03-10', '2026-03-09')).toEqual({
      kind: 'before',
      startDate: '2026-03-10',
    })
  })

  it('returns day 1 on start date', () => {
    const info = getProgramDay('2026-03-10', '2026-03-10')
    expect(info).toMatchObject({ kind: 'active', dayNumber: 1 })
  })

  it('clamps after day 30', () => {
    const info = getProgramDay('2026-03-01', '2026-04-05')
    expect(info.kind).toBe('after')
  })

  it('maps phases correctly', () => {
    expect(getPhaseForDay(3).id).toBe(1)
    expect(getPhaseForDay(10).id).toBe(2)
    expect(getPhaseForDay(18).id).toBe(3)
    expect(getPhaseForDay(25).id).toBe(4)
  })
})

describe('energy estimates', () => {
  it('matches Mifflin-St Jeor male baseline (~1860)', () => {
    const bmr = calcBmr(88, 180, 26, 'male')
    expect(bmr).toBe(1880)
    expect(calcSedentaryTdee(bmr)).toBe(2256)
  })

  it('does not invent BMR when sex unspecified', () => {
    expect(calcBmr(88, 180, 26, 'unspecified')).toBeNull()
  })
})

describe('weekly averages and waist', () => {
  it('requires at least 2 measurements for weekly average', () => {
    const result = weeklyWeightAverages([
      { id: '1', date: '2026-03-02', weightKg: 88 },
      { id: '2', date: '2026-03-04', weightKg: 87.5 },
      { id: '3', date: '2026-03-10', weightKg: 87 },
    ])
    const withTwo = result.find((r) => r.count >= 2)
    expect(withTwo?.average).toBe(87.8)
    const single = result.find((r) => r.count === 1)
    expect(Number.isNaN(single?.average)).toBe(true)
  })

  it('computes waist variation from first to last', () => {
    expect(
      waistVariation([
        { id: 'a', date: '2026-03-01', waistCm: 96 },
        { id: 'b', date: '2026-03-15', waistCm: 94.5 },
      ]),
    ).toBe(-1.5)
  })
})

describe('habits and safety', () => {
  it('derives day status from habit counts', () => {
    expect(deriveDayStatus(EMPTY_HABITS)).toBe('not-started')
    expect(
      deriveDayStatus({ ...EMPTY_HABITS, portions: true, protein: true }),
    ).toBe('partial')
    expect(
      deriveDayStatus({
        portions: true,
        protein: true,
        fruitVegetables: true,
        sweetsManaged: true,
        hydration: true,
        restAndAllowedActivity: true,
      }),
    ).toBe('completed')
  })

  it('blocks prescribed activity without clinical clearance', () => {
    expect(canShowPrescribedActivity(null)).toBe(false)
    expect(canShowPrescribedActivity(false)).toBe(false)
    expect(canShowPrescribedActivity(true)).toBe(true)
  })

  it('maps program day to calendar date', () => {
    expect(dateForProgramDay('2026-03-01', 1)).toBe('2026-03-01')
    expect(dateForProgramDay('2026-03-01', 30)).toBe('2026-03-30')
  })
})
