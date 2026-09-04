// Backend + WebAuthn helpers (ported from the vanilla app).
// Mocked out for Supabase migration

export const IS_APPLE = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)
export const IS_ANDROID = /Android/.test(navigator.userAgent)
export const BIO = IS_APPLE ? 'Face ID / Touch ID' : IS_ANDROID ? 'fingerprint or face unlock' : 'your fingerprint, face or PIN'
export const webauthnOK = () => false

export async function api(path, opts) {
  // Mock implementations for features deferred during Supabase migration
  if (path === '/api/config') return { invite_only: false }
  
  // Just swallow these non-essential features for now
  if (path.startsWith('/api/activity') || path.startsWith('/api/push')) {
    return {}
  }
  
  console.warn(`Stubbed API call to ${path}`)
  return {}
}

export async function passkeyRegister(name, code) {
  throw new Error("Passkey registration is disabled in favor of Email OTP.")
}
export async function passkeyLogin() {
  throw new Error("Passkey login is disabled in favor of Email OTP.")
}
