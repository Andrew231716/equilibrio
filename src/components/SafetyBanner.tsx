import { COPY } from '../lib/content'
import { canShowPrescribedActivity } from '../lib/calculations'
import type { HealthProfile } from '../types'

export function SafetyBanner({ health }: { health: HealthProfile }) {
  const cleared = canShowPrescribedActivity(health.clinicianClearedActivity)

  return (
    <div className="stack">
      <div className="banner danger" role="note">
        {COPY.urgentSymptoms}
      </div>
      <div className={`banner ${cleared ? 'info' : ''}`} role="status">
        {cleared ? COPY.activityAllowed : COPY.activityBlocked}
        {cleared && health.allowedActivities.length > 0 && (
          <p className="tiny" style={{ marginTop: 8 }}>
            Attività autorizzate: {health.allowedActivities.join(', ')}
          </p>
        )}
        {cleared && health.restrictedMovements.length > 0 && (
          <p className="tiny" style={{ marginTop: 4 }}>
            Movimenti da evitare: {health.restrictedMovements.join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}
