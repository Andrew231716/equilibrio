import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Modal } from '../components/Modal'
import { useAppState } from '../context/AppStateContext'
import {
  adherenceSummary,
  getProgramDay,
  latestWaist,
  latestWeight,
  waistVariation,
  weeklyWeightAverages,
  weightDelta,
} from '../lib/calculations'
import { COPY } from '../lib/content'
import { formatItalianDate, todayIso } from '../lib/dates'
import { validateWaistCm, validateWeightKg } from '../lib/validation'

export function Progress() {
  const {
    state,
    addWeight,
    addWaist,
    deleteWeight,
    deleteWaist,
    startNewCycle,
  } = useAppState()
  const [tab, setTab] = useState<'grafici' | 'tabella' | 'report'>('grafici')
  const [weightOpen, setWeightOpen] = useState(false)
  const [waistOpen, setWaistOpen] = useState(false)
  const [weightValue, setWeightValue] = useState('')
  const [waistValue, setWaistValue] = useState('')
  const [dateValue, setDateValue] = useState(todayIso())
  const [error, setError] = useState<string | null>(null)

  const sortedWeights = useMemo(
    () => [...state.weightEntries].sort((a, b) => a.date.localeCompare(b.date)),
    [state.weightEntries],
  )
  const sortedWaists = useMemo(
    () => [...state.waistEntries].sort((a, b) => a.date.localeCompare(b.date)),
    [state.waistEntries],
  )
  const averages = weeklyWeightAverages(state.weightEntries)
  const program = getProgramDay(state.profile.startDate, todayIso())
  const weight = latestWeight(state.weightEntries)
  const waist = latestWaist(state.waistEntries)
  const delta = weightDelta(state.profile.startWeightKg, weight?.weightKg ?? null)
  const waistDelta = waistVariation(state.waistEntries)
  const adherence = adherenceSummary(state.dailyLogs)

  const saveWeight = () => {
    const value = Number(weightValue)
    const err = validateWeightKg(value)
    if (err) {
      setError(err)
      return
    }
    addWeight({ date: dateValue, weightKg: value })
    setWeightOpen(false)
    setError(null)
    setWeightValue('')
  }

  const saveWaist = () => {
    const value = Number(waistValue)
    const err = validateWaistCm(value)
    if (err) {
      setError(err)
      return
    }
    addWaist({ date: dateValue, waistCm: value })
    setWaistOpen(false)
    setError(null)
    setWaistValue('')
  }

  return (
    <div className="stack">
      <header className="panel">
        <h1 style={{ fontSize: '1.7rem' }}>Progressi</h1>
        <p className="lede">{COPY.weightNote}</p>
        <div className="btn-row">
          <button type="button" className="btn btn-secondary" onClick={() => setWeightOpen(true)}>
            Aggiungi peso
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setWaistOpen(true)}>
            Aggiungi girovita
          </button>
        </div>
      </header>

      <div className="tabs-inline">
        {(
          [
            ['grafici', 'Grafici'],
            ['tabella', 'Misurazioni'],
            ['report', 'Report'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'active' : ''}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'grafici' && (
        <>
          <section className="panel fade-in">
            <h2>Peso (kg)</h2>
            {sortedWeights.length === 0 ? (
              <p className="muted">Inserisci il peso iniziale per vedere il grafico.</p>
            ) : (
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedWeights}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,40,38,0.08)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => formatItalianDate(String(v))}
                      fontSize={11}
                    />
                    <YAxis domain={['auto', 'auto']} unit=" kg" width={48} fontSize={11} />
                    <Tooltip
                      labelFormatter={(v) => formatItalianDate(String(v))}
                      formatter={(value) => [`${value} kg`, 'Peso']}
                    />
                    <Line
                      type="monotone"
                      dataKey="weightKg"
                      stroke="#1f6b63"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>Medie settimanali</h3>
              <p className="muted tiny" style={{ marginBottom: 8 }}>
                Calcolate solo con almeno 2 misurazioni nella stessa settimana.
              </p>
              {averages.length === 0 ? (
                <p className="muted">Dati insufficienti.</p>
              ) : (
                <ul className="list-plain">
                  {averages.map((a) => (
                    <li key={a.week}>
                      {a.week}:{' '}
                      {Number.isFinite(a.average)
                        ? `${a.average} kg`
                        : 'dati insufficienti'}{' '}
                      <span className="muted">({a.count} misure)</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="panel fade-in">
            <h2>Girovita (cm)</h2>
            {sortedWaists.length === 0 ? (
              <p className="muted">La prima misura è ancora da inserire.</p>
            ) : (
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedWaists}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,40,38,0.08)" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => formatItalianDate(String(v))}
                      fontSize={11}
                    />
                    <YAxis domain={['auto', 'auto']} unit=" cm" width={48} fontSize={11} />
                    <Tooltip
                      labelFormatter={(v) => formatItalianDate(String(v))}
                      formatter={(value) => [`${value} cm`, 'Girovita']}
                    />
                    <Line
                      type="monotone"
                      dataKey="waistCm"
                      stroke="#e07a5f"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="muted tiny" style={{ marginTop: 10 }}>
              Variazione complessiva:{' '}
              {waistDelta == null
                ? 'serve almeno 2 misure'
                : `${waistDelta > 0 ? '+' : ''}${waistDelta} cm`}
            </p>
          </section>
        </>
      )}

      {tab === 'tabella' && (
        <section className="panel fade-in">
          <h2>Peso</h2>
          {sortedWeights.length === 0 ? (
            <p className="muted">Nessuna misura.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>kg</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {sortedWeights.map((w) => (
                  <tr key={w.id}>
                    <td>{formatItalianDate(w.date)}</td>
                    <td>{w.weightKg}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => deleteWeight(w.id)}
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2 style={{ marginTop: 20 }}>Girovita</h2>
          {sortedWaists.length === 0 ? (
            <p className="muted">Nessuna misura.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>cm</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {sortedWaists.map((w) => (
                  <tr key={w.id}>
                    <td>{formatItalianDate(w.date)}</td>
                    <td>{w.waistCm}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => deleteWaist(w.id)}
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {tab === 'report' && (
        <section className="panel fade-in">
          <h2>Report del ciclo</h2>
          {program.kind !== 'after' && (
            <p className="lede">
              Il report completo ha più senso al giorno 30. Ecco comunque lo stato
              attuale.
            </p>
          )}
          <p style={{ marginBottom: 12 }}>{COPY.endOfPlan}</p>
          <div className="metric-row">
            <div className="metric">
              <div className="label">Peso inizio → recente</div>
              <div className="value" style={{ fontSize: '1.1rem' }}>
                {state.profile.startWeightKg} → {weight ? weight.weightKg : '—'} kg
              </div>
              <p className="tiny muted">
                {delta == null
                  ? 'Variazione: da inserire'
                  : `Δ ${delta > 0 ? '+' : ''}${delta} kg (non tutto è grasso)`}
              </p>
            </div>
            <div className="metric">
              <div className="label">Girovita</div>
              <div className="value" style={{ fontSize: '1.1rem' }}>
                {waist ? `${waist.waistCm} cm` : 'Da misurare'}
              </div>
              <p className="tiny muted">
                {waistDelta == null
                  ? 'Serve una seconda misura'
                  : `Δ ${waistDelta > 0 ? '+' : ''}${waistDelta} cm`}
              </p>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <h3 style={{ fontSize: '1rem' }}>Aderenza alle abitudini</h3>
            <p className="muted tiny" style={{ marginBottom: 8 }}>
              Senza punteggio punitivo: solo conteggio.
            </p>
            <ul className="list-plain">
              <li>Giornate completate: {adherence.completed}</li>
              <li>Giornate parziali: {adherence.partial}</li>
              <li>Non iniziate (tra quelle toccate): {adherence.notStarted}</li>
            </ul>
          </div>
          {program.kind === 'after' && (
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 16 }}
              onClick={startNewCycle}
            >
              Inizia un nuovo ciclo
            </button>
          )}
        </section>
      )}

      <Modal
        open={weightOpen}
        title="Nuova misura peso"
        onClose={() => {
          setWeightOpen(false)
          setError(null)
        }}
      >
        <div className="field">
          <label htmlFor="pd">Data</label>
          <input
            id="pd"
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="pw">Peso (kg)</label>
          <input
            id="pw"
            type="number"
            step="0.1"
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
          />
          {error && <span className="error">{error}</span>}
        </div>
        <button type="button" className="btn btn-primary" onClick={saveWeight}>
          Salva
        </button>
      </Modal>

      <Modal
        open={waistOpen}
        title="Nuova misura girovita"
        onClose={() => {
          setWaistOpen(false)
          setError(null)
        }}
      >
        <p className="lede">{COPY.waistNote}</p>
        <div className="field">
          <label htmlFor="wd">Data</label>
          <input
            id="wd"
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="ww">Circonferenza (cm)</label>
          <input
            id="ww"
            type="number"
            step="0.1"
            value={waistValue}
            onChange={(e) => setWaistValue(e.target.value)}
          />
          {error && <span className="error">{error}</span>}
        </div>
        <button type="button" className="btn btn-primary" onClick={saveWaist}>
          Salva
        </button>
      </Modal>
    </div>
  )
}
