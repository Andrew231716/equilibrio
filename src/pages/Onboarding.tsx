import { useState } from 'react'
import { useAppState } from '../context/AppStateContext'
import { COPY } from '../lib/content'
import { todayIso } from '../lib/dates'
import {
  validateAge,
  validateDate,
  validateHeightCm,
  validateWeightKg,
} from '../lib/validation'
import type { SexForFormula, UserProfile } from '../types'

export function Onboarding() {
  const { state, completeOnboarding } = useAppState()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<UserProfile>({ ...state.profile })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [allowedText, setAllowedText] = useState(
    draft.health.allowedActivities.join(', '),
  )
  const [restrictedText, setRestrictedText] = useState(
    draft.health.restrictedMovements.join(', '),
  )

  const patch = (partial: Partial<UserProfile>) =>
    setDraft((prev) => ({ ...prev, ...partial }))

  const validateBasics = () => {
    const next: Record<string, string> = {}
    const ageErr = validateAge(draft.age)
    const hErr = validateHeightCm(draft.heightCm)
    const wErr = validateWeightKg(draft.startWeightKg)
    const gErr = validateWeightKg(draft.goalWeightKg)
    const dErr = validateDate(draft.startDate || todayIso())
    if (ageErr) next.age = ageErr
    if (hErr) next.heightCm = hErr
    if (wErr) next.startWeightKg = wErr
    if (gErr) next.goalWeightKg = gErr
    if (dErr) next.startDate = dErr
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const finish = () => {
    if (!validateBasics()) {
      setStep(1)
      return
    }
    completeOnboarding({
      ...draft,
      startDate: draft.startDate || todayIso(),
      health: {
        ...draft.health,
        allowedActivities: allowedText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        restrictedMovements: restrictedText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      },
      onboarded: true,
    })
  }

  return (
    <div className="hero-onboarding">
      <section className="hero-visual" aria-label="Introduzione">
        <p className="tiny" style={{ opacity: 0.8, marginBottom: 8, position: 'relative', zIndex: 1 }}>
          Percorso personale · 30 giorni
        </p>
        <h1 className="brand-mark">Piano 30 Giorni</h1>
        <p className="brand-sub">{COPY.welcome}</p>
      </section>

      <section className="hero-body stack">
        <div className="tabs-inline" role="tablist" aria-label="Passi onboarding">
          {['Benvenuto', 'Profilo', 'Salute', 'Conferma'].map((label, i) => (
            <button
              key={label}
              type="button"
              className={step === i ? 'active' : ''}
              onClick={() => setStep(i)}
            >
              {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div className="panel fade-in">
            <h2>Come funziona</h2>
            <p className="lede">
              Monitori abitudini, alimentazione, peso e girovita. I numeri sono stime
              modificabili. Nessun giudizio, nessuna perfezione richiesta.
            </p>
            <p className="muted tiny" style={{ marginBottom: 12 }}>
              {COPY.disclaimer}
            </p>
            <p className="muted tiny" style={{ marginBottom: 16 }}>
              {COPY.localizedFat}
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setStep(1)}>
              Inizia
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="panel fade-in">
            <h2>Il tuo profilo</h2>
            <p className="lede">Puoi modificare tutto in qualsiasi momento.</p>

            <div className="field">
              <label htmlFor="age">Età</label>
              <input
                id="age"
                type="number"
                value={draft.age}
                onChange={(e) => patch({ age: Number(e.target.value) })}
              />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>

            <div className="field">
              <label htmlFor="sex">Sesso per la stima energetica</label>
              <select
                id="sex"
                value={draft.sexForFormula}
                onChange={(e) =>
                  patch({ sexForFormula: e.target.value as SexForFormula })
                }
              >
                <option value="male">Maschile</option>
                <option value="female">Femminile</option>
                <option value="unspecified">Non specificato</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="height">Altezza (cm)</label>
              <input
                id="height"
                type="number"
                value={draft.heightCm}
                onChange={(e) => patch({ heightCm: Number(e.target.value) })}
              />
              {errors.heightCm && <span className="error">{errors.heightCm}</span>}
            </div>

            <div className="field">
              <label htmlFor="startWeight">Peso iniziale (kg)</label>
              <input
                id="startWeight"
                type="number"
                step="0.1"
                value={draft.startWeightKg}
                onChange={(e) => patch({ startWeightKg: Number(e.target.value) })}
              />
              {errors.startWeightKg && (
                <span className="error">{errors.startWeightKg}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="goalWeight">Obiettivo di lungo periodo (kg)</label>
              <input
                id="goalWeight"
                type="number"
                step="0.1"
                value={draft.goalWeightKg}
                onChange={(e) => patch({ goalWeightKg: Number(e.target.value) })}
              />
              {errors.goalWeightKg && (
                <span className="error">{errors.goalWeightKg}</span>
              )}
              <span className="muted tiny">
                Non è un traguardo da raggiungere in 30 giorni.
              </span>
            </div>

            <div className="field">
              <label htmlFor="startDate">Data di inizio</label>
              <input
                id="startDate"
                type="date"
                value={draft.startDate}
                onChange={(e) => patch({ startDate: e.target.value })}
              />
              {errors.startDate && <span className="error">{errors.startDate}</span>}
            </div>

            <div className="btn-row">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
                Indietro
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (validateBasics()) setStep(2)
                }}
              >
                Continua
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="panel fade-in">
            <h2>Salute e attività</h2>
            <p className="lede">
              L’app non prescrive esercizi. Serve solo a rispettare le indicazioni del
              tuo professionista.
            </p>
            <div className="banner danger" style={{ marginBottom: 12 }}>
              {COPY.urgentSymptoms}
            </div>

            <div className="field">
              <label htmlFor="cleared">
                Il medico/fisioterapista ha autorizzato attività fisica?
              </label>
              <select
                id="cleared"
                value={
                  draft.health.clinicianClearedActivity === true
                    ? 'yes'
                    : draft.health.clinicianClearedActivity === false
                      ? 'no'
                      : 'unknown'
                }
                onChange={(e) => {
                  const v = e.target.value
                  patch({
                    health: {
                      ...draft.health,
                      clinicianClearedActivity:
                        v === 'yes' ? true : v === 'no' ? false : null,
                    },
                  })
                }}
              >
                <option value="unknown">Non ancora / non so</option>
                <option value="yes">Sì, autorizzato</option>
                <option value="no">No, non autorizzato</option>
              </select>
            </div>

            {draft.health.clinicianClearedActivity === true && (
              <>
                <div className="field">
                  <label htmlFor="allowed">Attività autorizzate (separate da virgola)</label>
                  <input
                    id="allowed"
                    value={allowedText}
                    onChange={(e) => setAllowedText(e.target.value)}
                    placeholder="es. camminata"
                  />
                </div>
                <div className="field">
                  <label htmlFor="restricted">
                    Movimenti sconsigliati (separate da virgola)
                  </label>
                  <input
                    id="restricted"
                    value={restrictedText}
                    onChange={(e) => setRestrictedText(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="field">
              <label htmlFor="healthNotes">Note (facoltative)</label>
              <textarea
                id="healthNotes"
                value={draft.health.notes ?? ''}
                onChange={(e) =>
                  patch({ health: { ...draft.health, notes: e.target.value } })
                }
              />
            </div>

            <div className="btn-row">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                Indietro
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                Continua
              </button>
              <button type="button" className="btn btn-secondary" onClick={finish}>
                Salta e avvia
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="panel fade-in">
            <h2>Pronto a partire</h2>
            <p className="lede">{COPY.calorieTarget}</p>
            <div className="metric-row" style={{ marginBottom: 16 }}>
              <div className="metric">
                <div className="label">Target stimato</div>
                <div className="value">{draft.calorieTargetKcal} kcal</div>
              </div>
              <div className="metric">
                <div className="label">Macro orientativi</div>
                <div className="value" style={{ fontSize: '1rem' }}>
                  {draft.proteinTargetG}/{draft.carbsTargetG}/{draft.fatTargetG} g
                </div>
              </div>
            </div>
            <p className="muted tiny" style={{ marginBottom: 16 }}>
              Girovita: da misurare. Peso iniziale: {draft.startWeightKg} kg · Altezza:{' '}
              {draft.heightCm} cm
            </p>
            <div className="btn-row">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>
                Indietro
              </button>
              <button type="button" className="btn btn-primary" onClick={finish}>
                Avvia il percorso
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
