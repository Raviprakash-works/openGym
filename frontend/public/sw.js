/* openGym service worker — dynamic cache busting & auto-update support.
   Media (img/gif) cache-first; app shell network-first (online) with offline fallback. */

const BUILD_HASH = '__BUILD_HASH__'
const SHELL_CACHE = 'opengym-shell-' + BUILD_HASH
const MEDIA_CACHE = 'opengym-media-v2'
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-180.png',
  './icon-512.png'
]

// Pre-cache app shell on install and immediately take over
self.addEventListener('install', e => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).catch(err => {
      console.warn('Pre-cache warning:', err)
    })
  )
})

// Clean up any old shell caches on activate so stale code is destroyed
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('opengym-shell-') && k !== SHELL_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim()).then(() => {
      // Notify all open client windows that an update was activated
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(c => c.postMessage({ type: 'SW_ACTIVATED', version: BUILD_HASH }))
      })
    })
  )
})

// Allow client UI to force immediate skipWaiting
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Push notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {}
  e.waitUntil(self.registration.showNotification(data.title || 'openGym', {
    body: data.body || '',
    icon: 'icon-512.png',
    badge: 'icon-180.png',
    tag: data.tag || 'opengym',
    renotify: true
  }))
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(clients => {
    const c = clients.find(c => 'focus' in c)
    return c ? c.focus() : self.clients.openWindow('./')
  }))
})

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET') return
  // Never cache Supabase, auth, or API calls — always go straight to network
  if (url.hostname.includes('supabase') || url.pathname.startsWith('/api/')) return

  const isMedia = url.pathname.includes('/img/') || url.pathname.includes('/gif/')

  if (isMedia) {
    // Cache-first for exercise GIFs/images — they never change
    e.respondWith(
      caches.open(MEDIA_CACHE).then(c => c.match(e.request).then(hit =>
        hit || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res })
      ))
    )
  } else {
    // Navigation or asset requests:
    // When online, fetch fresh from network and update shell cache.
    // If offline, serve from cache.
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' }).then(res => {
        if (res.ok && res.type === 'basic') {
          const clone = res.clone()
          caches.open(SHELL_CACHE).then(c => c.put(e.request, clone))
        }
        return res
      }).catch(() =>
        caches.match(e.request).then(hit => hit || caches.match('./index.html') || caches.match('./'))
      )
    )
  }
})
