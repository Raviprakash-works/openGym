// coach.js — Pure auto-regulation logic.
// Reads accumulated session feedback and produces suggestions for the next session.
// All functions are pure — they read history, never write to it.

import { sessionsFor } from './progression.js'

// Analyse feedback across recent sessions for one exercise.
// Returns: { trend: 'too_easy'|'too_hard'|'just_right'|'unknown', count: number }
export function feedbackTrend(S, exId, last = 3) {
  const sessions = sessionsFor(S, exId).slice(-last)
  const feedbacks = sessions.flatMap(s => {
    const entry = (S.workouts.find(w => w.entries.find(e => e.id === exId)))?.entries.find(e => e.id === exId)
    return (entry?.sets || []).map(set => set.feedback).filter(Boolean)
  })
  if (!feedbacks.length) return { trend: 'unknown', count: 0 }
  const counts = { too_easy: 0, just_right: 0, too_hard: 0 }
  feedbacks.forEach(f => { if (counts[f] != null) counts[f]++ })
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  return { trend: dominant[1] > 0 ? dominant[0] : 'unknown', count: dominant[1] }
}

// Check if user has missed 2+ consecutive planned sessions.
export function missedSessionCount(S) {
  if (!S.routines.length || !S.week) return 0
  const planned = Object.keys(S.week).filter(k => S.week[k]).map(Number)
  if (!planned.length) return 0

  let count = 0
  const today = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dayOfWeek = d.getDay()
    const iso = d.toISOString().split('T')[0]
    if (planned.includes(dayOfWeek)) {
      const logged = S.workouts.some(w => w.d === iso)
      if (!logged) count++
      else break
    }
  }
  return count
}

// Find the most recent missed planned day and its routine name.
export function lastMissedDay(S) {
  if (!S.routines.length || !S.week) return null
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dayOfWeek = d.getDay()
    const iso = d.toISOString().split('T')[0]
    const routineId = S.week[dayOfWeek]
    if (!routineId) continue
    const logged = S.workouts.some(w => w.d === iso)
    if (!logged) {
      const routine = S.routines.find(r => r.id === routineId)
      return { iso, routine, dayOfWeek }
    }
  }
  return null
}

// Generate a list of coach suggestions based on history analysis.
// Returns array of { id, type, exId, exName, message, action }
export function generateSuggestions(S) {
  const suggestions = []

  // Check for missed sessions
  const missed = missedSessionCount(S)
  if (missed >= 2) {
    suggestions.push({
      id: 'deload_suggestion',
      type: 'deload',
      message: `You've missed ${missed} sessions in a row. Consider a lighter deload week to get back on track.`,
      action: 'dismiss'
    })
  }

  // Check for "too easy" trend on specific exercises
  const exerciseIds = [...new Set(S.workouts.flatMap(w => w.entries.map(e => e.id)))]
  exerciseIds.forEach(exId => {
    const { trend, count } = feedbackTrend(S, exId, 3)
    const name = S.customEx?.find(e => e.id === exId)?.n || exId

    if (trend === 'too_easy' && count >= 2) {
      suggestions.push({
        id: `increase_${exId}`,
        type: 'increase_weight',
        exId,
        message: `${name} feels consistently easy. Ready to bump the weight?`,
        action: 'approve'
      })
    }
    if (trend === 'too_hard' && count >= 2) {
      suggestions.push({
        id: `decrease_${exId}`,
        type: 'decrease_weight',
        exId,
        message: `${name} has been feeling tough. Consider dropping the weight slightly.`,
        action: 'approve'
      })
    }
  })

  return suggestions.slice(0, 3) // cap at 3 suggestions to avoid overwhelm
}
