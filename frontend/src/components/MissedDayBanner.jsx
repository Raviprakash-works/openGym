import { useStore } from '../store/useStore.js'
import { lastMissedDay, missedSessionCount } from '../lib/coach.js'
import { t } from '../lib/i18n.js'
import { DAYN } from '../lib/format.js'

// Banner shown on Home when the user missed a planned session.
// Lets them reschedule it to today, skip it, or retroactively log it.
export default function MissedDayBanner() {
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)

  const missed = lastMissedDay(S)
  const count = missedSessionCount(S)
  if (!missed || !missed.routine) return null

  const todayISO = new Date().toISOString().split('T')[0]

  const reschedule = () => {
    update(s => { s.dayPlan[todayISO] = missed.routine.id })
  }

  const skipIt = () => {
    // Mark the missed day as explicitly skipped by recording a note in dayPlan
    update(s => { s.dayPlan[missed.iso] = null })
  }

  const dayName = DAYN[missed.dayOfWeek] || 'that day'

  return (
    <div style={{
      background: 'color-mix(in srgb, var(--orange) 12%, var(--surface-1))',
      border: '1.5px solid color-mix(in srgb, var(--orange) 30%, transparent)',
      borderRadius: 14, padding: '14px 16px', marginBottom: 12
    }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
        📅 {t('Missed session')}
        {count >= 2 && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--orange)', fontWeight: 600 }}>×{count}</span>}
      </div>
      <div style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 12 }}>
        {t('You missed {0} on {1}. What would you like to do?', missed.routine.name, t(dayName))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={reschedule} style={{
          flex: 2, padding: '9px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: 'var(--orange)', color: '#fff', border: 'none', cursor: 'pointer'
        }}>
          📌 {t('Do it today')}
        </button>
        <button onClick={skipIt} style={{
          flex: 1, padding: '9px', borderRadius: 10, fontSize: 13,
          background: 'var(--surface-3)', color: 'var(--text-2)',
          border: '1.5px solid var(--border)', cursor: 'pointer'
        }}>
          {t('Skip it')}
        </button>
      </div>
    </div>
  )
}
