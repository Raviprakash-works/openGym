import { useState } from 'react'
import { t } from '../lib/i18n.js'
import { Button } from './ui.jsx'

// Shown after the user finishes all sets of an exercise.
// Collects: how it felt + optional free-text notes.
// onDone(feedback, notes) — 'too_easy' | 'just_right' | 'too_hard', string
export default function FeedbackModal({ exName, onDone }) {
  const [feeling, setFeeling] = useState(null)
  const [notes, setNotes] = useState('')
  const [skipped, setSkipped] = useState(false)

  const feelings = [
    { key: 'too_easy', label: '😤 Too easy', color: 'var(--blue)' },
    { key: 'just_right', label: '😊 Just right', color: 'var(--green)' },
    { key: 'too_hard', label: '😰 Too hard', color: 'var(--red)' }
  ]

  if (skipped) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.55)', display: 'flex',
      alignItems: 'flex-end', justifyContent: 'center'
    }}>
      <div style={{
        background: 'var(--surface-1)', borderRadius: '20px 20px 0 0',
        padding: '24px 20px 40px', width: '100%', maxWidth: 480,
        boxShadow: '0 -4px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
          ✅ {exName} — {t('Done!')}
        </div>
        <div style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 16 }}>
          {t('How did that feel?')}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {feelings.map(f => (
            <button key={f.key}
              onClick={() => setFeeling(f.key)}
              style={{
                flex: 1, padding: '10px 4px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                border: `2px solid ${feeling === f.key ? f.color : 'var(--border)'}`,
                background: feeling === f.key ? `color-mix(in srgb, ${f.color} 15%, transparent)` : 'var(--surface-2)',
                color: feeling === f.key ? f.color : 'var(--text-2)',
                cursor: 'pointer', transition: 'all 0.15s'
              }}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <input
            placeholder={t('Notes (optional) — e.g. machine was wobbly...')}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1.5px solid var(--border)', background: 'var(--surface-2)',
              color: 'var(--text-1)', fontSize: 14, boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => { setSkipped(true); onDone(null, '') }}
            style={{
              flex: 1, padding: '12px', borderRadius: 12, fontSize: 14,
              border: '1.5px solid var(--border)', background: 'transparent',
              color: 'var(--text-3)', cursor: 'pointer'
            }}>
            {t('Skip')}
          </button>
          <button
            onClick={() => { if (feeling) { setSkipped(true); onDone(feeling, notes) } }}
            disabled={!feeling}
            style={{
              flex: 2, padding: '12px', borderRadius: 12, fontSize: 15, fontWeight: 700,
              border: 'none', background: feeling ? 'var(--acc)' : 'var(--surface-3)',
              color: feeling ? '#fff' : 'var(--text-3)', cursor: feeling ? 'pointer' : 'default',
              transition: 'all 0.15s'
            }}>
            {t('Next exercise →')}
          </button>
        </div>
      </div>
    </div>
  )
}
