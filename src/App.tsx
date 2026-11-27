import { Layout } from './components/Layout'
import { AppStateProvider, useAppState } from './context/AppStateContext'
import { Nutrition } from './pages/Nutrition'
import { Onboarding } from './pages/Onboarding'
import { Plan } from './pages/Plan'
import { Profile } from './pages/Profile'
import { Progress } from './pages/Progress'
import { Today } from './pages/Today'

function AppRoutes() {
  const { state, tab } = useAppState()

  if (!state.profile.onboarded) {
    return <Onboarding />
  }

  return (
    <Layout>
      {tab === 'oggi' && <Today />}
      {tab === 'piano' && <Plan />}
      {tab === 'alimentazione' && <Nutrition />}
      {tab === 'progressi' && <Progress />}
      {tab === 'profilo' && <Profile />}
    </Layout>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <AppRoutes />
    </AppStateProvider>
  )
}
