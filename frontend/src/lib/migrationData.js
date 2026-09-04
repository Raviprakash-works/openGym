import { uid } from './format.js'

// We will map exactly what the user provided into openGym's state.
// We use custom exercises for anything not easily mapped to a strict builtin ID.

const M = {
  // Built-in mappings
  incBarbell: '0047',
  smithFlat: '0748',
  cableLatRaise: '0192',
  ohTricepExt: '0194', // we will just use this and change it if rope
  ropePushdown: '2406', // rope attachment
  latPulldown: '2330', // standard cable lat pulldown
  seatedRow: '0861', // cable seated row
  straightArmPulldown: '0238',
  rdl: '0085',
  legExt: '0585',
  revCrunch: '0872',
  incDbPress: '0314',
  legPress: '2287',
  standingCalf: '1372',

  // Custom exercises (using unique random IDs for this import)
  cableFly: 'c_cableFly',
  revPecDeck: 'c_revPecDeck',
  preacherMachine: 'c_preacherMachine',
  oneArmHammer: 'c_oneArmHammer',
  oneArmLatPulldown: 'c_oneArmLatPulldown',
  legCurl: 'c_legCurl',
  pecDeck: 'c_pecDeck'
}

const customEx = [
  { id: M.cableFly, n: 'Cable Fly (Double Pulley)', bp: 'chest', tg: 'pectorals', eq: 'cable', sm: [], st: [] },
  { id: M.revPecDeck, n: 'Reverse Pec Deck', bp: 'shoulders', tg: 'deltoids', eq: 'machine', sm: [], st: [] },
  { id: M.preacherMachine, n: 'Preacher Curl Machine', bp: 'upper arms', tg: 'biceps', eq: 'machine', sm: [], st: [] },
  { id: M.oneArmHammer, n: 'Single-Arm Hammer Curl', bp: 'upper arms', tg: 'biceps', eq: 'dumbbell', sm: [], st: [], uni: true },
  { id: M.oneArmLatPulldown, n: 'Single-Arm Cable Lat Pulldown', bp: 'back', tg: 'lats', eq: 'cable', sm: [], st: [], uni: true },
  { id: M.legCurl, n: 'Leg Curl Machine', bp: 'upper legs', tg: 'hamstrings', eq: 'machine', sm: [], st: [] },
  { id: M.pecDeck, n: 'Pec Deck Fly', bp: 'chest', tg: 'pectorals', eq: 'machine', sm: [], st: [] }
]

// Create Routines
const rPushA = { id: uid(), name: 'Push A', emoji: 'pushpin', ex: [
  { id: M.incBarbell, sets: 3, reps: 10, weight: 50 },
  { id: M.smithFlat, sets: 3, reps: 12, weight: 20 },
  { id: M.cableFly, sets: 2, reps: 15, weight: 30 },
  { id: M.cableLatRaise, sets: 3, reps: 12, weight: 10 },
  { id: M.ohTricepExt, sets: 3, reps: 15, weight: 25 },
  { id: M.ropePushdown, sets: 3, reps: 12, weight: 20 }
]}

const rPullA = { id: uid(), name: 'Pull A', emoji: 'magnet', ex: [
  { id: M.latPulldown, sets: 3, reps: 12, weight: 40 },
  { id: M.seatedRow, sets: 3, reps: 12, weight: 40 },
  { id: M.oneArmLatPulldown, sets: 4, reps: 15, weight: 15 },
  { id: M.straightArmPulldown, sets: 2, reps: 12, weight: 30 },
  { id: M.revPecDeck, sets: 2, reps: 15, weight: 15 },
  { id: M.preacherMachine, sets: 1, reps: 12, weight: 25 },
  { id: M.oneArmHammer, sets: 4, reps: 12, weight: 7.5 }
]}

const rLegsA = { id: uid(), name: 'Legs A + Core', emoji: 'leg', ex: [
  { id: M.legPress, sets: 2, reps: 12, weight: 70 },
  { id: M.rdl, sets: 2, reps: 12, weight: 20 },
  { id: M.legCurl, sets: 2, reps: 12, weight: 20 },
  { id: M.legExt, sets: 2, reps: 15, weight: 20 },
  { id: M.standingCalf, sets: 2, reps: 15, weight: 0 },
  { id: M.revCrunch, sets: 2, reps: 15, weight: 0 }
]}

const rPushB = { id: uid(), name: 'Push B', emoji: 'pushpin', ex: [
  { id: M.incDbPress, sets: 3, reps: 12, weight: 40 },
  { id: M.smithFlat, sets: 3, reps: 10, weight: 25 },
  { id: M.cableFly, sets: 2, reps: 12, weight: 30 },
  { id: M.pecDeck, sets: 2, reps: 15, weight: 20 },
  { id: M.ohTricepExt, sets: 3, reps: 15, weight: 25 },
  { id: M.ropePushdown, sets: 3, reps: 12, weight: 20 }
]}

const rPullB = { id: uid(), name: 'Pull B', emoji: 'magnet', ex: [] } // Empty template for now
const rLegsB = { id: uid(), name: 'Legs B + Core', emoji: 'leg', ex: [] } // Empty template for now

const routines = [rPushA, rPullA, rLegsA, rPushB, rPullB, rLegsB]
const week = { 1: rPushA.id, 2: rPullA.id, 3: rLegsA.id, 4: rPushB.id, 5: rPullB.id, 6: rLegsB.id }

// Date generation: we'll spread the history over late 2024 (e.g. November) to keep it sequential.
let dIdx = 1
function nextDate() {
  const d = new Date(2024, 10, dIdx++)
  const iso = d.toISOString().split('T')[0]
  const start = d.getTime()
  return { d: iso, start, end: start + 3600000 }
}

// Helper to create a workout entry
function createW(routine, entries) {
  const t = nextDate()
  const prs = []
  return {
    id: uid(), d: t.d, start: t.start, end: t.end, routineId: routine.id, name: routine.name, bw: 70,
    entries, prs, vol: entries.reduce((acc, e) => acc + e.sets.reduce((v, s) => v + s.w * s.r, 0), 0)
  }
}

// Generate sequential historical workouts to plot the progression
const workouts = [
  // Session 1: Push A (Oldest values)
  createW(rPushA, [
    { id: M.incBarbell, topW: 50, sets: [{w:50, r:9, done:true}, {w:50, r:8, done:true}, {w:50, r:7, done:true}] },
    { id: M.smithFlat, topW: 40, sets: [{w:40, r:8, done:true}, {w:40, r:8, done:true}, {w:40, r:7, done:true}] },
    { id: M.cableFly, topW: 30, sets: [{w:30, r:12, done:true}, {w:30, r:10, done:true}] },
    { id: M.cableLatRaise, topW: 5, sets: [{w:5, r:20, done:true}, {w:5, r:20, done:true}, {w:5, r:20, done:true}] },
    { id: M.ohTricepExt, topW: 30, sets: [{w:15, r:20, done:true}, {w:25, r:14, done:true}, {w:30, r:10, done:true}] },
    { id: M.ropePushdown, topW: 25, sets: [{w:20, r:15, done:true}, {w:25, r:10, done:true}] }
  ]),
  // Session 2: Pull A (Oldest)
  createW(rPullA, [
    { id: M.latPulldown, topW: 30, sets: [{w:30, r:10, done:true, notes:"approximate weight"}] },
    { id: M.seatedRow, topW: 40, sets: [{w:40, r:12, done:true, notes:"approximate reps"}] },
    { id: M.oneArmLatPulldown, topW: 20, sets: [{w:20, r:12, done:true}, {w:20, r:10, done:true}] },
    { id: M.straightArmPulldown, topW: 30, sets: [{w:30, r:12, done:true}, {w:30, r:10, done:true}] },
    { id: M.revPecDeck, topW: 15, sets: [{w:15, r:15, done:true}, {w:15, r:15, done:true}] },
    { id: M.preacherMachine, topW: 15, sets: [{w:15, r:15, done:true, notes:"easy"}] },
    { id: M.oneArmHammer, topW: 7.5, sets: [{w:7.5, r:12, done:true}, {w:7.5, r:12, done:true}] }
  ]),
  // Session 3: Push A (Mid progression)
  createW(rPushA, [
    { id: M.smithFlat, topW: 40, sets: [{w:40, r:12, done:true}, {w:40, r:10, done:true}, {w:40, r:11, done:true}] },
    { id: M.cableLatRaise, topW: 10, sets: [{w:5, r:20, done:true}, {w:5, r:20, done:true}, {w:10, r:15, done:true}, {w:10, r:15, done:true}] },
    { id: M.ohTricepExt, topW: 30, sets: [{w:30, r:12, done:true}, {w:30, r:7, done:true}, {w:25, r:12, done:true}] },
    { id: M.ropePushdown, topW: 25, sets: [{w:25, r:10, done:true}, {w:25, r:10, done:true}] }
  ]),
  // Session 4: Pull A (Mid progression)
  createW(rPullA, [
    { id: M.latPulldown, topW: 40, sets: [{w:40, r:10, done:true}] },
    { id: M.seatedRow, topW: 40, sets: [{w:40, r:10, done:true}, {w:40, r:10, done:true}, {w:40, r:8, done:true}] },
    { id: M.oneArmLatPulldown, topW: 15, sets: [{w:15, r:12, done:true}, {w:15, r:10, done:true}] },
    { id: M.preacherMachine, topW: 20, sets: [{w:20, r:15, done:true, notes:"easy"}] },
  ]),
  // Session 5: Push B (Oldest)
  createW(rPushB, [
    { id: M.incDbPress, topW: 30, sets: [{w:30, r:15, done:true, notes:"easy"}] }, // 15kg each side = 30kg total
    { id: M.smithFlat, topW: 40, sets: [{w:40, r:12, done:true}, {w:40, r:10, done:true}, {w:40, r:11, done:true}] },
    { id: M.cableFly, topW: 30, sets: [{w:30, r:12, done:true}, {w:30, r:12, done:true}] },
    { id: M.pecDeck, topW: 20, sets: [{w:20, r:15, done:true}, {w:20, r:12, done:true}] },
    { id: M.ohTricepExt, topW: 30, sets: [{w:30, r:12, done:true}, {w:30, r:7, done:true}] }
  ]),
  // Session 6: Legs A (First and only tracked session)
  createW(rLegsA, [
    { id: M.legPress, topW: 70, sets: [{w:50, r:12, done:true, notes:"very easy warm-up"}, {w:70, r:12, done:true}, {w:70, r:12, done:true}] },
    { id: M.rdl, topW: 20, sets: [{w:20, r:12, done:true}, {w:20, r:12, done:true}] },
    { id: M.legCurl, topW: 20, sets: [{w:20, r:12, done:true}, {w:20, r:12, done:true}] },
    { id: M.legExt, topW: 20, sets: [{w:20, r:15, done:true}, {w:20, r:15, done:true}] },
    { id: M.standingCalf, topW: 0, sets: [{w:0, r:15, done:true}, {w:0, r:15, done:true}] },
    { id: M.revCrunch, topW: 0, sets: [{w:0, r:15, done:true}, {w:0, r:16, done:true}] }
  ]),
  // Session 7: Push B (Mid)
  createW(rPushB, [
    { id: M.incDbPress, topW: 35, sets: [{w:35, r:12, done:true}, {w:35, r:12, done:true}] },
    { id: M.smithFlat, topW: 45, sets: [{w:45, r:7, done:true}, {w:45, r:10, done:true}, {w:45, r:7, done:true, notes:"left shoulder felt engaged/restricted, no pain"}] }, // Note: 12.5kg side = 25+20 bar = 45
    { id: M.ohTricepExt, topW: 25, sets: [{w:25, r:12, done:true}] },
    { id: M.ropePushdown, topW: 25, sets: [{w:25, r:10, done:true}] }
  ]),
  // Session 8: Pull A (Recent)
  createW(rPullA, [
    { id: M.latPulldown, topW: 40, sets: [{w:40, r:10, done:true}, {w:40, r:8, done:true}, {w:40, r:8, done:true}] },
    { id: M.oneArmLatPulldown, topW: 15, sets: [{w:15, r:30, done:true}, {w:15, r:24, done:true}] }, // 15/15 | 12/12 = 30 and 24 total reps for both sides
    { id: M.straightArmPulldown, topW: 30, sets: [{w:30, r:7, done:true}, {w:30, r:5, done:true, notes:"low energy session, not a strength regression"}] },
    { id: M.preacherMachine, topW: 25, sets: [{w:25, r:12, done:true}] },
  ]),
  // Session 9: Push A (Most Recent Baseline)
  createW(rPushA, [
    { id: M.incBarbell, topW: 50, sets: [{w:50, r:8, done:true}, {w:50, r:9, done:true}, {w:50, r:8, done:true}] },
    { id: M.smithFlat, topW: 40, sets: [{w:40, r:12, done:true}, {w:40, r:12, done:true}, {w:40, r:12, done:true}] },
    { id: M.cableFly, topW: 30, sets: [{w:30, r:30, done:true}] }, // 15kg/side = 30kg, 15/15 = 30 reps total
    { id: M.cableLatRaise, topW: 10, sets: [{w:10, r:24, done:true}, {w:10, r:24, done:true}, {w:10, r:24, done:true}] }, // 12/12 = 24 total reps
    { id: M.ohTricepExt, topW: 25, sets: [{w:25, r:15, done:true}, {w:25, r:15, done:true}, {w:25, r:15, done:true}] },
    { id: M.ropePushdown, topW: 20, sets: [{w:20, r:12, done:true}, {w:20, r:12, done:true}, {w:20, r:12, done:true}] }
  ]),
  // Session 10: Pull A (Most Recent Baseline)
  createW(rPullA, [
    { id: M.latPulldown, topW: 40, sets: [{w:40, r:12, done:true}, {w:40, r:10, done:true}, {w:40, r:7, done:true}] },
    { id: M.seatedRow, topW: 40, sets: [{w:40, r:12, done:true}, {w:40, r:11, done:true}, {w:40, r:8, done:true}] },
  ]),
  // Session 11: Push B (Most Recent Baseline)
  createW(rPushB, [
    { id: M.incDbPress, topW: 40, sets: [{w:40, r:12, done:true}, {w:40, r:10, done:true}, {w:40, r:10, done:true}] } // 20kg each = 40kg total
  ])
]

export const migrationState = {
  customEx,
  routines,
  week,
  workouts,
  bodyweight: [{ d: '2024-11-01', w: 70, t: new Date(2024, 10, 1).getTime() }],
  effort: 'rir'
}
