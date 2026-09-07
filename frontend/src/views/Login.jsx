import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { t } from '../lib/i18n.js'
import { DEMO, REPO } from '../lib/demo.js'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'
import { supabase } from '../lib/supabase.js'

export default function Login() {
  const { setUser, pullState, setGuest, isGuest } = useStore()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: email, 2: otp
  const [loading, setLoading] = useState(false)

  const sendOtp = async () => {
    if (!email.trim() || !email.includes('@')) {
      useUI.getState().toast(t('Enter a valid email'))
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: null,  // force OTP code, not magic link
      }
    })
    setLoading(false)
    
    if (error) {
      useUI.getState().toast(error.message || t('Failed to send login code'))
      console.error('OTP send error:', error)
    } else {
      setStep(2)
      useUI.getState().toast(t('Check your email for the login code!'))
    }
  }

  const verifyOtp = async () => {
    if (!otp.trim()) {
      useUI.getState().toast(t('Enter the login code'))
      return
    }
    setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email'
    })
    setLoading(false)

    if (error) {
      useUI.getState().toast(error.message || t('Invalid login code'))
      console.error('OTP verify error:', error)
    } else if (data?.session) {
      setUser({ id: data.session.user.id, email: data.session.user.email })
      await pullState()
      useUI.getState().toast(t('Welcome back!'))
      nav('/home', { replace: true })
    }
  }

  const head = <>
    <div style={{ fontSize: 54, display: 'flex', justifyContent: 'center', color: 'var(--acc)' }}><Icon name="dumbbell" /></div>
    <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-.028em', margin: '10px 0 4px' }}>openGym</h1>
  </>
  const wrap = { display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '78vh', textAlign: 'center', position: 'relative' }

  if (DEMO) return (
    <div className="narrow" style={wrap}>
      {head}
      <div className="muted" style={{ marginBottom: 30 }}>{t('Live demo — everything stays in this browser.')}</div>
      <Button variant="primary" icon="sparkles" onClick={() => { setGuest(true); nav('/home', { replace: true }) }}>{t('Start the demo')}</Button>
      <div className="card small muted" style={{ textAlign: 'left', marginTop: 16 }}>
        {t('This demo runs entirely in your browser on example data — nothing is sent anywhere.')}
      </div>
      <div className="dim small" style={{ marginTop: 22, lineHeight: 1.6 }}>
        <a href={REPO} target="_blank" rel="noopener">{t('Self-host it in a minute →')}</a>
      </div>
    </div>
  )

  return (
    <div className="narrow" style={wrap}>
      {isGuest() && (
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <button className="iconbtn" onClick={() => nav('/home')} aria-label={t('Back')}><Icon name="chevronLeft" /></button>
        </div>
      )}

      {head}
      <div className="muted" style={{ marginBottom: 34 }}>{t('Your workouts. Your weights. Your profile.')}</div>
      
      {step === 1 ? (
        <>
          <input 
            className="input" 
            type="email" 
            placeholder={t('Email address')} 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={{ marginBottom: 12, textAlign: 'center' }}
            disabled={loading}
          />
          <Button variant="primary" icon="person" onClick={sendOtp} disabled={loading}>
            {loading ? t('Sending...') : t('Send Login Code')}
          </Button>
        </>
      ) : (
        <>
          <div className="muted small" style={{ marginBottom: 12 }}>
            {t('Enter the 6-digit code sent to')} <b>{email}</b>
          </div>
          <input 
            className="input" 
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={t('6-digit code')} 
            value={otp} 
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onFocus={e => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
            style={{ marginBottom: 12, textAlign: 'center', letterSpacing: '.3em', fontWeight: 'bold', fontSize: 22 }}
            maxLength={6}
            autoComplete="one-time-code"
            disabled={loading}
          />
          <Button variant="primary" icon="sparkles" onClick={verifyOtp} disabled={loading}>
            {loading ? t('Verifying...') : t('Verify & Login')}
          </Button>
          <div style={{ height: 10 }} />
          <Button variant="ghost" onClick={() => setStep(1)} disabled={loading}>{t('Back')}</Button>
        </>
      )}

      <div style={{ height: 16 }} />
      <Button variant="ghost" className="dim" onClick={() => { setGuest(true); nav('/home', { replace: true }) }} disabled={loading}>{t('Continue without account')}</Button>
      <div className="dim small" style={{ marginTop: 26, lineHeight: 1.5 }}>
        {t('We use passwordless email login to keep your data secure.')}<br />
        {t('Each profile keeps its own plan, workouts & body weight.')}
      </div>
    </div>
  )
}
