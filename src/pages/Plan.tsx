import { ArrowLeft } from 'lucide-react'
import { Checklist } from '../components/Checklist'
import { SafetyBanner } from '../components/SafetyBanner'
import { useAppState } from '../context/AppStateContext'
import {
  canShowPrescribedActivity,
  dateForProgramDay,
  getPhaseForDay,
  getProgramDay,
  PHASES,
} from '../lib/calculations'
import { formatItalianDate, todayIso } from '../lib/dates'
import type { DayStatus } from '../types'

function statusLabel(status: DayStatus): string {
  if (status === 'completed') return 'Completato'
  if (status === 'partial') return 'Parziale'
  return 'Da fare'
}

export function Plan() {
  const {
    state,
    selectedPlanDay,
    setSelectedPlanDay,
    getLogForDate,
    toggleHabit,
    upsertLog,
  } = useAppState()
  const today = todayIso()
  const todayProgram = getProgramDay(state.profile.startDate, today)

  if (selectedPlanDay != null) {
    const date = dateForProgramDay(state.profile.startDate, selectedPlanDay)
    const log = getLogForDate(date)
    const phase = getPhaseForDay(selectedPlanDay)
    const cleared = canShowPrescribedActivity(
      state.profile.health.clinicianClearedActivity,
    )

    return (
      <div className="stack fade-in">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setSelectedPlanDay(null)}
        >
          <ArrowLeft size={16} aria-hidden="true" /> Torna al calendario
        </button>

        <section className="panel">
          <p className="muted tiny">{formatItalianDate(date)}</p>
          <h1 style={{ fontSize: '1.7rem', marginTop: 4 }}>
            Giorno {selectedPlanDay}
          </h1>
          <span className="phase-chip" style={{ marginTop: 10 }}>
            {phase.label}
          </span>
          <p className="lede" style={{ marginTop: 12 }}>
            {phase.focus}
          </p>
          <span className={`status-pill ${log.dayStatus}`}>
            {statusLabel(log.dayStatus)}
          </span>
        </section>

        <section className="panel">
          <h2>Obiettivo alimentare</h2>
          <p className="lede">
            Target stimato: {state.profile.calorieTargetKcal} kcal · P{' '}
            {state.profile.proteinTargetG} g · C {state.profile.carbsTargetG} g · G{' '}
            {state.profile.fatTargetG} g
          </p>
          <p className="muted tiny">Valori modificabili dal profilo. Sono stime, non una prescrizione.</p>
        </section>

        <section className="panel">
          <h2>Checklist del giorno</h2>
          <Checklist
            habits={log.habits}
            onToggle={(key) => toggleHabit(date, key)}
          />
          <div className="field" style={{ marginTop: 12 }}>
            <label htmlFor="day-notes">Note</label>
            <textarea
              id="day-notes"
              value={log.notes ?? ''}
              onChange={(e) => upsertLog(date, { notes: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="meals-out">Pasti fuori (n.)</label>
            <input
              id="meals-out"
              type="number"
              min={0}
              value={log.mealsOut ?? ''}
              onChange={(e) =>
                upsertLog(date, {
                  mealsOut: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="sweets">Nota dolci / pasto fuori</label>
            <input
              id="sweets"
              value={log.sweetsNote ?? ''}
              onChange={(e) => upsertLog(date, { sweetsNote: e.target.value })}
              placeholder="Senza giudizio: solo un appunto"
            />
          </div>
        </section>

        <section className="panel">
          <h2>Attività</h2>
          {cleared ? (
            <p className="lede">
              Solo attività autorizzate:{' '}
              {state.profile.health.allowedActivities.length
                ? state.profile.health.allowedActivities.join(', ')
                : 'inseriscile nel profilo'}
              .
            </p>
          ) : (
            <p className="lede">Attività da concordare con il professionista sanitario.</p>
          )}
          <SafetyBanner health={state.profile.health} />
        </section>
      </div>
    )
  }

  return (
    <div className="stack">
      <header className="panel">
        <h1 style={{ fontSize: '1.7rem' }}>Piano 30 giorni</h1>
        <p className="lede">
          Quattro fasi, senza penalità. Puoi aggiornare anche i giorni precedenti.
        </p>
        <div className="btn-row">
          {PHASES.map((phase) => (
            <span key={phase.id} className="phase-chip">
              {phase.range}: {phase.label}
            </span>
          ))}
        </div>
      </header>

      <section className="panel">
        <div className="day-grid" role="list">
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1
            const date = dateForProgramDay(state.profile.startDate, day)
            const log = state.dailyLogs.find((l) => l.date === date)
            const status = log?.dayStatus ?? 'not-started'
            const isToday =
              todayProgram.kind === 'active' && todayProgram.dayNumber === day
            return (
              <button
                key={day}
                type="button"
                className={`day-cell ${status} ${isToday ? 'today' : ''}`}
                onClick={() => setSelectedPlanDay(day)}
                aria-label={`Giorno ${day}, ${statusLabel(status)}`}
              >
                <span className="n">{day}</span>
                <span className="tiny muted">
                  {status === 'completed' ? '✓' : status === 'partial' ? '·' : ''}
                </span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
