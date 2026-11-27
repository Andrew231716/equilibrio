import { useMemo, useState } from 'react'
import { Ruler, Scale } from 'lucide-react'
import { Checklist } from '../components/Checklist'
import { Modal } from '../components/Modal'
import { SafetyBanner } from '../components/SafetyBanner'
import { useAppState } from '../context/AppStateContext'
import {
  canShowPrescribedActivity,
  getProgramDay,
  habitCompletionCount,
  latestWaist,
  latestWeight,
  weightDelta,
} from '../lib/calculations'
import { COPY, ENCOURAGEMENTS } from '../lib/content'
import { formatItalianDateLong, todayIso } from '../lib/dates'
import { validateWaistCm, validateWeightKg } from '../lib/validation'

export function Today() {
  const {
    state,
    getLogForDate,
    toggleHabit,
    upsertLog,
    addWeight,
    addWaist,
    setTab,
    startNewCycle,
  } = useAppState()
  const today = todayIso()
  const program = getProgramDay(state.profile.startDate, today)
  const log = getLogForDate(today)
  const weight = latestWeight(state.weightEntries)
  const waist = latestWaist(state.waistEntries)
  const delta = weightDelta(state.profile.startWeightKg, weight?.weightKg ?? null)
  const encouragement = useMemo(() => {
    const day = Number(today.slice(-2))
    return ENCOURAGEMENTS[day % ENCOURAGEMENTS.length]
  }, [today])

  const [weightOpen, setWeightOpen] = useState(false)
  const [waistOpen, setWaistOpen] = useState(false)
  const [weightValue, setWeightValue] = useState(String(weight?.weightKg ?? state.profile.startWeightKg))
  const [waistValue, setWaistValue] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const done = habitCompletionCount(log.habits)
  const progress =
    program.kind === 'active' ? Math.round((program.dayNumber / 30) * 100) : program.kind === 'after' ? 100 : 0

  const focusText =
    program.kind === 'active'
      ? program.phase.focus
      : program.kind === 'before'
        ? `Il percorso inizia il ${formatItalianDateLong(program.startDate)}.`
        : COPY.endOfPlan

  const saveWeight = () => {
    const value = Number(weightValue)
    const err = validateWeightKg(value)
    if (err) {
      setFormError(err)
      return
    }
    addWeight({ date: today, weightKg: value })
    setWeightOpen(false)
    setFormError(null)
  }

  const saveWaist = () => {
    const value = Number(waistValue)
    const err = validateWaistCm(value)
    if (err) {
      setFormError(err)
      return
    }
    addWaist({ date: today, waistCm: value })
    setWaistOpen(false)
    setFormError(null)
  }

  return (
    <div className="stack">
      <header className="panel">
        <p className="muted tiny">Ciao · {formatItalianDateLong(today)}</p>
        {program.kind === 'active' && (
          <>
            <h1 style={{ fontSize: '1.8rem', marginTop: 4 }}>
              Giorno {program.dayNumber} di 30
            </h1>
            <span className="phase-chip" style={{ marginTop: 10 }}>
              {program.phase.label} · {program.phase.range}
            </span>
          </>
        )}
        {program.kind === 'before' && (
          <h1 style={{ fontSize: '1.6rem', marginTop: 4 }}>Ancora non iniziato</h1>
        )}
        {program.kind === 'after' && (
          <h1 style={{ fontSize: '1.6rem', marginTop: 4 }}>Ciclo completato</h1>
        )}
        <div className="progress-bar" style={{ marginTop: 16 }} aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="muted tiny" style={{ marginTop: 8 }}>
          {encouragement}
        </p>
      </header>

      <section className="panel">
        <h2>Focus di oggi</h2>
        <p className="lede">{focusText}</p>
        {program.kind === 'after' && (
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={() => setTab('progressi')}>
              Vedi report
            </button>
            <button type="button" className="btn btn-secondary" onClick={startNewCycle}>
              Nuovo ciclo
            </button>
          </div>
        )}
      </section>

      <section className="metric-row">
        <div className="metric">
          <div className="label">Peso recente</div>
          <div className="value">
            {weight ? `${weight.weightKg} kg` : 'Da inserire'}
          </div>
          <p className="tiny muted">
            {delta == null
              ? 'Rispetto all’inizio: —'
              : `Δ inizio: ${delta > 0 ? '+' : ''}${delta} kg`}
          </p>
        </div>
        <div className="metric">
          <div className="label">Girovita</div>
          <div className="value">{waist ? `${waist.waistCm} cm` : 'Da misurare'}</div>
          <p className="tiny muted">Una volta a settimana</p>
        </div>
      </section>

      <section className="btn-row">
        <button type="button" className="btn btn-secondary" onClick={() => setWeightOpen(true)}>
          <Scale size={16} aria-hidden="true" /> Registra peso
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setWaistOpen(true)}>
          <Ruler size={16} aria-hidden="true" /> Registra girovita
        </button>
      </section>

      {program.kind === 'active' && (
        <section className="panel">
          <div className="section-title">
            <h2>Checklist</h2>
            <span className={`status-pill ${log.dayStatus}`}>
              {done}/6 ·{' '}
              {log.dayStatus === 'completed'
                ? 'Completata'
                : log.dayStatus === 'partial'
                  ? 'Parziale'
                  : 'Da fare'}
            </span>
          </div>
          <Checklist
            habits={log.habits}
            onToggle={(key) => toggleHabit(today, key)}
          />
          <div className="field" style={{ marginTop: 14 }}>
            <label htmlFor="notes">Note del giorno</label>
            <textarea
              id="notes"
              value={log.notes ?? ''}
              onChange={(e) => upsertLog(today, { notes: e.target.value })}
              placeholder="Cosa ha funzionato oggi?"
            />
          </div>
          <p className="muted tiny">{COPY.endOfDay}</p>
        </section>
      )}

      <section className="panel">
        <h2>Attività</h2>
        <SafetyBanner health={state.profile.health} />
        {canShowPrescribedActivity(state.profile.health.clinicianClearedActivity) ? (
          <div style={{ marginTop: 12 }}>
            <div className="field">
              <label htmlFor="activityType">Attività autorizzata svolta</label>
              <input
                id="activityType"
                value={log.activity?.type ?? ''}
                onChange={(e) =>
                  upsertLog(today, {
                    activity: {
                      type: e.target.value,
                      durationMinutes: log.activity?.durationMinutes,
                      symptomsDuringOrAfter: log.activity?.symptomsDuringOrAfter,
                    },
                  })
                }
                list="allowed-activities"
              />
              <datalist id="allowed-activities">
                {state.profile.health.allowedActivities.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </div>
            <div className="field">
              <label htmlFor="duration">Durata (minuti)</label>
              <input
                id="duration"
                type="number"
                value={log.activity?.durationMinutes ?? ''}
                onChange={(e) =>
                  upsertLog(today, {
                    activity: {
                      type: log.activity?.type ?? '',
                      durationMinutes: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                      symptomsDuringOrAfter: log.activity?.symptomsDuringOrAfter,
                    },
                  })
                }
              />
            </div>
            <div className="field">
              <label htmlFor="symptoms">Sintomi durante/dopo (se presenti)</label>
              <input
                id="symptoms"
                value={log.activity?.symptomsDuringOrAfter ?? ''}
                onChange={(e) =>
                  upsertLog(today, {
                    activity: {
                      type: log.activity?.type ?? '',
                      durationMinutes: log.activity?.durationMinutes,
                      symptomsDuringOrAfter: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        ) : (
          <p className="muted tiny" style={{ marginTop: 10 }}>
            Puoi solo annotare movimento spontaneo nelle note, senza obiettivi prescrittivi.
          </p>
        )}
      </section>

      <Modal
        open={weightOpen}
        title="Registra peso"
        onClose={() => {
          setWeightOpen(false)
          setFormError(null)
        }}
      >
        <p className="lede">{COPY.weightNote}</p>
        <div className="field">
          <label htmlFor="w">Peso (kg)</label>
          <input
            id="w"
            type="number"
            step="0.1"
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
          />
          {formError && <span className="error">{formError}</span>}
        </div>
        <button type="button" className="btn btn-primary" onClick={saveWeight}>
          Salva
        </button>
      </Modal>

      <Modal
        open={waistOpen}
        title="Registra girovita"
        onClose={() => {
          setWaistOpen(false)
          setFormError(null)
        }}
      >
        <p className="lede">{COPY.waistNote}</p>
        <div className="field">
          <label htmlFor="waist">Circonferenza (cm)</label>
          <input
            id="waist"
            type="number"
            step="0.1"
            value={waistValue}
            onChange={(e) => setWaistValue(e.target.value)}
          />
          {formError && <span className="error">{formError}</span>}
        </div>
        <button type="button" className="btn btn-primary" onClick={saveWaist}>
          Salva
        </button>
      </Modal>
    </div>
  )
}
