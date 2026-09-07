import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { MOBILE } from './lib/mobile.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)

// Service worker registration with active update detection for PWA
if (!MOBILE && 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('sw.js')

      // Check for updates immediately when app opens
      reg.update().catch(() => {})

      // Check for update whenever user switches back to openGym from another app or phone lock
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          reg.update().catch(() => {})
        }
      })

      // Periodically check for updates in background (every 10 min)
      setInterval(() => {
        reg.update().catch(() => {})
      }, 10 * 60 * 1000)

      // Listen for incoming update
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent('opengym-update-ready', { detail: { worker: newWorker } }))
          }
        })
      })

      // If a waiting worker already exists from a prior session
      if (reg.waiting && navigator.serviceWorker.controller) {
        window.dispatchEvent(new CustomEvent('opengym-update-ready', { detail: { worker: reg.waiting } }))
      }

      // When new service worker activates and claims the clients
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.dispatchEvent(new CustomEvent('opengym-controller-changed'))
      })

      // Listen for message from service worker
      navigator.serviceWorker.addEventListener('message', e => {
        if (e.data?.type === 'SW_ACTIVATED') {
          window.dispatchEvent(new CustomEvent('opengym-update-ready'))
        }
      })

    } catch (e) {
      console.warn('Service worker registration failed:', e)
    }
  })
}
