import { Check } from 'lucide-react'
import type { Habits } from '../types'
import { HABIT_LABELS } from '../types'

type Props = {
  habits: Habits
  onToggle: (key: keyof Habits) => void
}

export function Checklist({ habits, onToggle }: Props) {
  return (
    <div className="checklist" role="group" aria-label="Checklist giornaliera">
      {(Object.keys(HABIT_LABELS) as (keyof Habits)[]).map((key) => {
        const on = habits[key]
        return (
          <button
            key={key}
            type="button"
            className={`check-item ${on ? 'on' : ''}`}
            aria-pressed={on}
            onClick={() => onToggle(key)}
          >
            <span className="box" aria-hidden="true">
              {on ? <Check size={14} strokeWidth={3} /> : null}
            </span>
            <span>{HABIT_LABELS[key]}</span>
          </button>
        )
      })}
    </div>
  )
}
