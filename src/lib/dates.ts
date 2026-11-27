/** Local calendar date as YYYY-MM-DD */
export function toLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, days: number): string {
  const date = parseLocalDate(iso)
  date.setDate(date.getDate() + days)
  return toLocalDateString(date)
}

export function daysBetween(startIso: string, endIso: string): number {
  const start = parseLocalDate(startIso)
  const end = parseLocalDate(endIso)
  const ms = end.getTime() - start.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function formatItalianDate(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function formatItalianDateLong(iso: string): string {
  return parseLocalDate(iso).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** ISO week key YYYY-Www for grouping */
export function weekKey(iso: string): string {
  const date = parseLocalDate(iso)
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

export function todayIso(): string {
  return toLocalDateString(new Date())
}
