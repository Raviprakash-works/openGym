import { useMemo } from 'react'
import { useStore } from '../store/useStore.js'
import { generateSuggestions } from '../lib/coach.js'
import { t } from '../lib/i18n.js'

// Coach suggestion cards shown on Home screen.
// Each card is a soft suggestion — user approves or dismisses.
export default function CoachSuggestions() {
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)

  const suggestions = useMemo(() => generateSuggestions(S), [S.workouts?.length])

  const dismissed = S.dismissedSuggestions || []
  const visible = suggestions.filter(s => !dismissed.includes(s.id))
  if (!visible.length) return null

  const dismiss = id => {
    update(s => {
      if (!s.dismissedSuggestions) s.dismissedSuggestions = []
      s.dismissedSuggestions.push(id)
    })
  }

  const icons = {
    increase_weight: '📈',
    decrease_weight: '📉',
    deload: '🛡️',
    substitute: '🔄'
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {t('Coach Suggestions')}
      </div>
      {visible.map(s => (
        <div key={s.id} style={{
          background: 'color-mix(in srgb, var(--blue) 10%, var(--surface-1))',
          border: '1.5px solid color-mix(in srgb, var(--blue) 20%, transparent)',
          borderRadius: 14, padding: '12px 14px', marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 22 }}>{icons[s.type] || '💡'}</span>
          <div style={{ flex: 1, fontSize: 13, color: 'var(--text-1)', lineHeight: 1.4 }}>
            {s.message}
          </div>
          <button onClick={() => dismiss(s.id)} style={{
            background: 'var(--surface-3)', border: 'none', borderRadius: 20,
            padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: 'var(--text-3)',
            flexShrink: 0
          }}>
            {t('Got it')}
          </button>
        </div>
      ))}
    </div>
  )
}
