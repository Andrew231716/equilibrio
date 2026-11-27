import {
  CalendarDays,
  ChartNoAxesCombined,
  Salad,
  SunMedium,
  UserRound,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useAppState } from '../context/AppStateContext'
import type { TabId } from '../types'

const TABS: { id: TabId; label: string; icon: typeof SunMedium }[] = [
  { id: 'oggi', label: 'Oggi', icon: SunMedium },
  { id: 'piano', label: 'Piano', icon: CalendarDays },
  { id: 'alimentazione', label: 'Alimentazione', icon: Salad },
  { id: 'progressi', label: 'Progressi', icon: ChartNoAxesCombined },
  { id: 'profilo', label: 'Profilo', icon: UserRound },
]

export function Layout({ children }: { children: ReactNode }) {
  const { tab, setTab, setSelectedPlanDay } = useAppState()

  const go = (id: TabId) => {
    setSelectedPlanDay(null)
    setTab(id)
  }

  return (
    <div className="app-shell with-nav">
      <aside className="side-nav" aria-label="Navigazione principale">
        <div className="brand">
          <strong>Piano 30 Giorni</strong>
          <span>Abitudini sostenibili</span>
        </div>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'active' : ''}
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => go(id)}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        ))}
      </aside>

      <div className="main-panel fade-in">{children}</div>

      <nav className="bottom-nav" aria-label="Navigazione principale">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'active' : ''}
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => go(id)}
          >
            <Icon size={20} aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
