import { useRef, useState } from 'react'
import { SafetyBanner } from '../components/SafetyBanner'
import { useAppState } from '../context/AppStateContext'
import { calcBmi, calcBmr, calcSedentaryTdee } from '../lib/calculations'
import { COPY } from '../lib/content'
import {
  validateAge,
  validateDate,
  validateHeightCm,
  validateWeightKg,
} from '../lib/validation'
import type { SexForFormula } from '../types'

export function Profile() {
  const {
    state,
    updateProfile,
    exportJson,
    exportCsv,
    importJson,
    resetAll,
  } = useAppState()
  const { profile } = state
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [allowedText, setAllowedText] = useState(
    profile.health.allowedActivities.join(', '),
  )
  const [restrictedText, setRestrictedText] = useState(
    profile.health.restrictedMovements.join(', '),
  )

  const bmi = calcBmi(profile.startWeightKg, profile.heightCm)
  const bmr = calcBmr(
    profile.startWeightKg,
    profile.heightCm,
    profile.age,
    profile.sexForFormula,
  )
  const tdee = calcSedentaryTdee(bmr)

  const download = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const persistHealthLists = () => {
    updateProfile({
      health: {
        ...profile.health,
        allowedActivities: allowedText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        restrictedMovements: restrictedText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      },
    })
    setMessage('Attività aggiornate.')
  }

  return (
    <div className="stack">
      <header className="panel">
        <h1 style={{ fontSize: '1.7rem' }}>Profilo</h1>
        <p className="lede">{COPY.privacy}</p>
        {message && (
          <div className="banner info" role="status">
            {message}
          </div>
        )}
      </header>

      <section className="panel">
        <h2>Dati personali</h2>
        <div className="field">
          <label htmlFor="age">Età</label>
          <input
            id="age"
            type="number"
            value={profile.age}
            onChange={(e) => {
              const age = Number(e.target.value)
              if (!validateAge(age)) updateProfile({ age })
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="sex">Sesso per la stima energetica</label>
          <select
            id="sex"
            value={profile.sexForFormula}
            onChange={(e) =>
              updateProfile({ sexForFormula: e.target.value as SexForFormula })
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
            value={profile.heightCm}
            onChange={(e) => {
              const heightCm = Number(e.target.value)
              if (!validateHeightCm(heightCm)) updateProfile({ heightCm })
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="sw">Peso iniziale (kg)</label>
          <input
            id="sw"
            type="number"
            step="0.1"
            value={profile.startWeightKg}
            onChange={(e) => {
              const startWeightKg = Number(e.target.value)
              if (!validateWeightKg(startWeightKg)) updateProfile({ startWeightKg })
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="gw">Obiettivo lungo periodo (kg)</label>
          <input
            id="gw"
            type="number"
            step="0.1"
            value={profile.goalWeightKg}
            onChange={(e) => {
              const goalWeightKg = Number(e.target.value)
              if (!validateWeightKg(goalWeightKg)) updateProfile({ goalWeightKg })
            }}
          />
        </div>
        <div className="field">
          <label htmlFor="sd">Data di inizio</label>
          <input
            id="sd"
            type="date"
            value={profile.startDate}
            onChange={(e) => {
              if (!validateDate(e.target.value)) {
                updateProfile({ startDate: e.target.value })
              }
            }}
          />
        </div>
        <p className="muted tiny">
          BMI orientativo: {bmi ?? '—'} · BMR: {bmr ?? '—'} · TDEE sedentario:{' '}
          {tdee ?? '—'}
        </p>
        <p className="muted tiny" style={{ marginTop: 4 }}>
          {COPY.localizedFat}
        </p>
      </section>

      <section className="panel">
        <h2>Target alimentari</h2>
        <div className="field">
          <label htmlFor="kcal">Calorie (stima)</label>
          <input
            id="kcal"
            type="number"
            value={profile.calorieTargetKcal}
            onChange={(e) =>
              updateProfile({ calorieTargetKcal: Number(e.target.value) })
            }
          />
        </div>
        <div className="field">
          <label htmlFor="p">Proteine (g)</label>
          <input
            id="p"
            type="number"
            value={profile.proteinTargetG}
            onChange={(e) =>
              updateProfile({ proteinTargetG: Number(e.target.value) })
            }
          />
        </div>
        <div className="field">
          <label htmlFor="c">Carboidrati (g)</label>
          <input
            id="c"
            type="number"
            value={profile.carbsTargetG}
            onChange={(e) =>
              updateProfile({ carbsTargetG: Number(e.target.value) })
            }
          />
        </div>
        <div className="field">
          <label htmlFor="f">Grassi (g)</label>
          <input
            id="f"
            type="number"
            value={profile.fatTargetG}
            onChange={(e) => updateProfile({ fatTargetG: Number(e.target.value) })}
          />
        </div>
      </section>

      <section className="panel">
        <h2>Salute e attività</h2>
        <SafetyBanner health={profile.health} />
        <div className="field" style={{ marginTop: 12 }}>
          <label htmlFor="cleared">Autorizzazione clinica all’attività</label>
          <select
            id="cleared"
            value={
              profile.health.clinicianClearedActivity === true
                ? 'yes'
                : profile.health.clinicianClearedActivity === false
                  ? 'no'
                  : 'unknown'
            }
            onChange={(e) => {
              const v = e.target.value
              updateProfile({
                health: {
                  ...profile.health,
                  clinicianClearedActivity:
                    v === 'yes' ? true : v === 'no' ? false : null,
                },
              })
            }}
          >
            <option value="unknown">Non ancora / non so</option>
            <option value="yes">Sì</option>
            <option value="no">No</option>
          </select>
        </div>
        {profile.health.clinicianClearedActivity === true && (
          <>
            <div className="field">
              <label htmlFor="allowed">Attività autorizzate</label>
              <input
                id="allowed"
                value={allowedText}
                onChange={(e) => setAllowedText(e.target.value)}
                onBlur={persistHealthLists}
              />
            </div>
            <div className="field">
              <label htmlFor="restricted">Movimenti sconsigliati</label>
              <input
                id="restricted"
                value={restrictedText}
                onChange={(e) => setRestrictedText(e.target.value)}
                onBlur={persistHealthLists}
              />
            </div>
          </>
        )}
        <div className="field">
          <label htmlFor="notes">Note</label>
          <textarea
            id="notes"
            value={profile.health.notes ?? ''}
            onChange={(e) =>
              updateProfile({
                health: { ...profile.health, notes: e.target.value },
              })
            }
          />
        </div>
      </section>

      <section className="panel">
        <h2>Dati e privacy</h2>
        <p className="lede">{COPY.disclaimer}</p>
        <div className="btn-row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              download(exportJson(), 'piano30-backup.json', 'application/json')
            }
          >
            Esporta JSON
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => download(exportCsv(), 'piano30-misure.csv', 'text/csv')}
          >
            Esporta CSV
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => fileRef.current?.click()}
          >
            Importa backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const text = await file.text()
              const ok = window.confirm(
                'Importare questo backup sovrascriverà i dati attuali. Continuare?',
              )
              if (!ok) return
              const imported = importJson(text)
              setMessage(
                imported
                  ? 'Backup importato correttamente.'
                  : 'Import fallito: file non valido.',
              )
              e.target.value = ''
            }}
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              const ok = window.confirm(
                'Cancellare definitivamente tutti i dati locali? L’operazione non si può annullare.',
              )
              if (ok) {
                resetAll()
                setMessage('Dati cancellati.')
              }
            }}
          >
            Cancella tutti i dati
          </button>
        </div>
      </section>
    </div>
  )
}
