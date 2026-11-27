import { useState } from 'react'
import { useAppState } from '../context/AppStateContext'
import {
  calcBmr,
  calcSedentaryTdee,
} from '../lib/calculations'
import {
  COPY,
  LUNCH_ROTATION,
  MEAL_EXAMPLES,
  SHOPPING_LIST,
} from '../lib/content'

const TABS = [
  'Target',
  'Esempio giornata',
  'Pranzi',
  'Weekend e dolci',
  'Spesa',
] as const

export function Nutrition() {
  const { state, updateProfile } = useAppState()
  const [tab, setTab] = useState<(typeof TABS)[number]>('Target')
  const { profile } = state
  const bmr = calcBmr(
    profile.startWeightKg,
    profile.heightCm,
    profile.age,
    profile.sexForFormula,
  )
  const tdee = calcSedentaryTdee(bmr)

  return (
    <div className="stack">
      <header className="panel">
        <h1 style={{ fontSize: '1.7rem' }}>Alimentazione</h1>
        <p className="lede">{COPY.calorieTarget}</p>
      </header>

      <div className="tabs-inline" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={tab === t ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Target' && (
        <section className="panel fade-in">
          <h2>Target giornaliero stimato</h2>
          <div className="metric-row" style={{ marginBottom: 14 }}>
            <div className="metric">
              <div className="label">BMR indicativo</div>
              <div className="value">{bmr != null ? `${bmr}` : '—'}</div>
              <p className="tiny muted">kcal/die (Mifflin-St Jeor)</p>
            </div>
            <div className="metric">
              <div className="label">TDEE sedentario</div>
              <div className="value">{tdee != null ? `${tdee}` : '—'}</div>
              <p className="tiny muted">stima orientativa</p>
            </div>
          </div>

          <div className="field">
            <label htmlFor="kcal">Target calorico (kcal)</label>
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
              onChange={(e) =>
                updateProfile({ fatTargetG: Number(e.target.value) })
              }
            />
          </div>
          <p className="muted tiny">
            Totale matematico circa{' '}
            {profile.proteinTargetG * 4 +
              profile.carbsTargetG * 4 +
              profile.fatTargetG * 9}{' '}
            kcal. Non sono obblighi medici.
          </p>
          <div className="banner" style={{ marginTop: 12 }}>
            In caso di fame intensa, debolezza, capogiri o malessere, interrompi la
            restrizione e rivolgiti a un professionista. Non saltare pasti per
            compensare.
          </div>
        </section>
      )}

      {tab === 'Esempio giornata' && (
        <section className="panel fade-in">
          <h2>Esempio di giornata</h2>
          <p className="lede">
            Porzioni esemplificative da personalizzare. Non sono un piano clinico
            individuale.
          </p>
          <ul className="list-plain">
            {MEAL_EXAMPLES.map((meal) => (
              <li key={meal.title}>
                <strong>{meal.title}</strong>
                <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                  {meal.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'Pranzi' && (
        <section className="panel fade-in">
          <h2>Idee pranzo meal-prep</h2>
          <p className="lede">
            Rotazione suggerita per 5 giorni. Puoi cambiarla liberamente.
          </p>
          <ul className="list-plain">
            {LUNCH_ROTATION.map((item) => (
              <li key={item.day}>
                <strong>{item.day}</strong>
                <div className="muted">{item.meal}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'Weekend e dolci' && (
        <section className="panel fade-in">
          <h2>Weekend e dolci</h2>
          <p className="lede">{COPY.mealsOut}</p>
          <p style={{ marginBottom: 12 }}>{COPY.sweets}</p>
          <div className="field">
            <label htmlFor="weekend">Pasti fuori previsti nel weekend</label>
            <input
              id="weekend"
              type="number"
              min={0}
              max={10}
              value={profile.weekendMealsOut}
              onChange={(e) =>
                updateProfile({ weekendMealsOut: Number(e.target.value) })
              }
            />
          </div>
          <label className="check-item" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={profile.sweetsPreference}
              onChange={(e) =>
                updateProfile({ sweetsPreference: e.target.checked })
              }
              style={{ width: 18, height: 18, marginTop: 2 }}
            />
            <span>Mi piace includere dolci nel piano in modo consapevole</span>
          </label>
        </section>
      )}

      {tab === 'Spesa' && (
        <section className="panel fade-in">
          <h2>Lista della spesa</h2>
          <p className="lede">Suggerimenti facoltativi per la settimana.</p>
          <ul className="list-plain">
            {SHOPPING_LIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
