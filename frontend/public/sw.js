/* openGym service worker v2 — pre-cache app shell + runtime caching.
   Media (img/gif) cache-first; app shell stale-while-revalidate; data never cached. */

const SHELL_CACHE = 'opengym-shell-v2'
const MEDIA_CACHE = 'opengym-media-v2'
const SHELL = ['./','./index.html','./manifest.json','./icon-180.png','./icon-512.png']

// Pre-cache the app shell on install so the app loads offline instantly
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  )
})

// Remove old caches on activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== SHELL_CACHE && k !== MEDIA_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
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
  // Never cache Supabase / API calls — always go to network
  if (url.hostname.includes('supabase') || url.pathname.startsWith('/api/')) return

  const isMedia = url.pathname.includes('/img/') || url.pathname.includes('/gif/')

  if (isMedia) {
    // Cache-first for exercise GIFs — they never change
    e.respondWith(
      caches.open(MEDIA_CACHE).then(c => c.match(e.request).then(hit =>
        hit || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res })
      ))
    )
  } else {
    // Network-first with shell fallback — get fresh JS/CSS, fall back to cache if offline
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) caches.open(SHELL_CACHE).then(c => c.put(e.request, res.clone()))
        return res
      }).catch(() =>
        caches.match(e.request).then(hit => hit || caches.match('./index.html'))
      )
    )
  }
})
