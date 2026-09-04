import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { EXDB } from '../lib/exercises.js'
import { t } from '../lib/i18n.js'

// Mid-workout exercise swap sheet.
// Shows exercises filtered to the same body part as the current exercise.
// onSelect(newExId) — called with the chosen substitute's ID.
// onClose() — called when dismissed without choosing.
export default function SubstituteSheet({ currentExId, onSelect, onClose }) {
  const S = useStore(s => s.S)
  const [search, setSearch] = useState('')

  // Find current exercise to filter by body part
  const currentEx = [...(S.customEx || []), ...EXDB].find(e => e.id === currentExId)
  const bp = currentEx?.bp || ''

  // Filter: same body part, not current exercise, matches search
  const candidates = [...(S.customEx || []), ...EXDB].filter(e =>
    e.id !== currentExId &&
    e.bp === bp &&
    (!search || e.n.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 30)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.55)', display: 'flex',
      alignItems: 'flex-end', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--surface-1)', borderRadius: '20px 20px 0 0',
        padding: '20px 20px 40px', width: '100%', maxWidth: 480,
        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 -4px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>🔄 {t('Substitute exercise')}</div>
            {bp && <div style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 2 }}>{t('Showing {0} exercises', bp)}</div>}
          </div>
          <button onClick={onClose} style={{
            background: 'var(--surface-3)', border: 'none', borderRadius: 20,
            padding: '4px 12px', cursor: 'pointer', fontSize: 13, color: 'var(--text-2)'
          }}>{t('Cancel')}</button>
        </div>

        <input
          placeholder={t('Search exercises...')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
          style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 12,
            border: '1.5px solid var(--border)', background: 'var(--surface-2)',
            color: 'var(--text-1)', fontSize: 14, width: '100%', boxSizing: 'border-box'
          }}
        />

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {candidates.length === 0 && (
            <div style={{ color: 'var(--text-3)', textAlign: 'center', padding: 24, fontSize: 14 }}>
              {t('No exercises found')}
            </div>
          )}
          {candidates.map(ex => (
            <div key={ex.id}
              onClick={() => onSelect(ex.id)}
              style={{
                padding: '12px 14px', borderRadius: 10, marginBottom: 6,
                background: 'var(--surface-2)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>{ex.n}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                  {[ex.tg, ex.eq].filter(Boolean).join(' · ')}
                </div>
              </div>
              <span style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 20,
                background: 'color-mix(in srgb,var(--acc) 15%,transparent)',
                color: 'var(--acc)', fontWeight: 600
              }}>{t('Swap')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
