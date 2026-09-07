import { useEffect, useState } from 'react'
import { t } from '../lib/i18n.js'

// Intercepts the browser's beforeinstallprompt event (Android Chrome only)
// and shows a friendly in-app "Add to Home Screen" nudge.
export default function InstallPrompt() {
  const [prompt, setPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('og-install-dismissed') === '1'
  )

  useEffect(() => {
    // Only fires on Android Chrome when the app is installable
    const handler = e => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Also hide if already installed (display-mode standalone)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  if (!prompt || dismissed || isStandalone) return null

  const install = async () => {
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setPrompt(null)
    else dismiss()
  }

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem('og-install-dismissed', '1')
  }

  return (
    <div style={{
      position: 'fixed', bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
      left: 16, right: 16, zIndex: 500,
      background: 'var(--surface)', border: '1.5px solid var(--sep)',
      borderRadius: 16, padding: '14px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', gap: 12
    }}>
      <div style={{ fontSize: 36 }}>🏋️</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{t('Install openGym')}</div>
        <div style={{ fontSize: 13, color: 'var(--label-2)', marginTop: 2 }}>
          {t('Add to your home screen for instant access')}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button onClick={install} style={{
          background: 'var(--acc)', color: '#000', border: 'none',
          borderRadius: 10, padding: '8px 14px', fontWeight: 700, fontSize: 14, cursor: 'pointer'
        }}>{t('Install')}</button>
        <button onClick={dismiss} style={{
          background: 'transparent', color: 'var(--label-3)', border: 'none',
          fontSize: 12, cursor: 'pointer', textAlign: 'center'
        }}>{t('Not now')}</button>
      </div>
    </div>
  )
}
