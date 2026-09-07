import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { t } from '../lib/i18n.js'

export default function UpdateBanner() {
  const [show, setShow] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState(null)
  const isWorkoutActive = useStore(s => !!s.S?.active)

  useEffect(() => {
    const onUpdateReady = e => {
      if (e.detail?.worker) {
        setWaitingWorker(e.detail.worker)
      }
      setShow(true)
    }

    const onControllerChanged = () => {
      // If a new worker took over and no workout is active, show the update prompt
      setShow(true)
    }

    window.addEventListener('opengym-update-ready', onUpdateReady)
    window.addEventListener('opengym-controller-changed', onControllerChanged)

    // Check if worker is already waiting
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg?.waiting) {
          setWaitingWorker(reg.waiting)
          setShow(true)
        }
      }).catch(() => {})
    }

    return () => {
      window.removeEventListener('opengym-update-ready', onUpdateReady)
      window.removeEventListener('opengym-controller-changed', onControllerChanged)
    }
  }, [])

  if (!show) return null

  const doUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage('SKIP_WAITING')
    }
    setTimeout(() => {
      window.location.reload()
    }, 150)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 'calc(env(safe-area-inset-top, 0px) + 8px)',
      left: 14,
      right: 14,
      zIndex: 9998,
      background: 'var(--surface)',
      border: '1.5px solid var(--acc)',
      borderRadius: 14,
      padding: '10px 14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      animation: 'viewfade var(--fast) var(--ease)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span style={{ fontSize: 20 }}>🚀</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--label)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t('App update available')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--label-2)', marginTop: 1 }}>
            {isWorkoutActive
              ? t('Workout running — update when done')
              : t('Tap to reload with latest features')}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={doUpdate}
          style={{
            background: 'var(--acc)',
            color: 'var(--on-acc)',
            border: 'none',
            borderRadius: 8,
            padding: '7px 12px',
            fontWeight: 700,
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          {t('Update')}
        </button>
        <button
          onClick={() => setShow(false)}
          aria-label={t('Dismiss')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--label-3)',
            fontSize: 16,
            padding: '4px 6px',
            cursor: 'pointer',
            lineHeight: 1
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
