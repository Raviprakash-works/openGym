import { useEffect, useState } from 'react'

// Shows a slim banner at the top when the device loses network connectivity.
export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  if (!offline) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: '#ff9f0a',
      color: '#000',
      fontSize: 13,
      fontWeight: 600,
      textAlign: 'center',
      padding: '6px 16px',
      paddingTop: 'calc(6px + env(safe-area-inset-top, 0px))',
      letterSpacing: '-.01em'
    }}>
      📵 You're offline — your data is safe and will sync when you reconnect
    </div>
  )
}
