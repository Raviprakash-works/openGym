import { uid } from './format.js'

// Real workout history imported from ChatGPT — Raviprakash's actual sessions.
// Undated sessions are given approximate back-dates based on chronological ordering.

// ── Exercise ID map ──────────────────────────────────────────────────────────
const M = {
  // Built-in exercises (IDs from exercises-data.js)
  incBarbell:     '0047',   // Incline Barbell Bench Press
  smithFlat:      '0748',   // Smith Machine Flat Bench Press
  cableLatRaise:  '0192',   // Single-Arm Cable Lateral Raise
  ohTricepExt:    '0194',   // Overhead Cable Triceps Extension
  straightBarPD:  '0238',   // Straight-Bar Triceps Pushdown
  ropePushdown:   '2406',   // Rope Triceps Pushdown
  latPulldown:    '2330',   // Lat Pulldown
  neutralLatPD:   '2330',   // Neutral-Grip Lat Pulldown (same machine)
  oneArmRow:      '0861',   // One-Arm Dumbbell Row
  cableFacePull:  '0238',   // Cable Face Pull
  cableRearDelt:  '0192',   // Cable Rear-Delt Fly
  incDbCurl:      '0314',   // Dumbbell Incline Curl
  dbHammerCurl:   '0334',   // Dumbbell Hammer Curl
  rdl:            '0085',   // Romanian Deadlift
  legPress:       '2287',   // Leg Press
  legExt:         '0585',   // Leg Extension
  standingCalf:   '1372',   // Standing Calf Raise
  revCrunch:      '0872',   // Reverse Crunch
  incDbPress:     '0314',   // Incline Dumbbell Press
  seatedRow:      '0861',   // Cable Seated Row
  preacherCurl:   '0592',   // Lever Preacher Curl Machine
  splitSquat:     '0410',   // Dumbbell Single Leg Split Squat

  // Custom exercises
  cableFly:      'c_cableFly',
  pecDeck:       'c_pecDeckFly',
  legCurl:       'c_legCurl',
  cableRdFly:    'c_cableRearDeltFly',
  facePull:      'c_facePull',
  incCurl:       'c_incCurl',
  straightArmPD: 'c_straightArmPD',
  revPecDeck:    'c_revPecDeck',
}

// ── Custom exercises ─────────────────────────────────────────────────────────
const customEx = [
  { id: M.cableFly,      n: 'Cable Fly (Double Pulley)',     bp: 'chest',       tg: 'pectorals',  eq: 'cable',    sm: [], st: [] },
  { id: M.pecDeck,       n: 'Pec Deck Fly',                  bp: 'chest',       tg: 'pectorals',  eq: 'machine',  sm: [], st: [] },
  { id: M.legCurl,       n: 'Leg Curl Machine',              bp: 'upper legs',  tg: 'hamstrings', eq: 'machine',  sm: [], st: [] },
  { id: M.cableRdFly,    n: 'Cable Rear-Delt Fly',          bp: 'shoulders',   tg: 'deltoids',   eq: 'cable',    sm: [], st: [], uni: true },
  { id: M.facePull,      n: 'Cable Face Pull',               bp: 'shoulders',   tg: 'deltoids',   eq: 'cable',    sm: [], st: [] },
  { id: M.incCurl,       n: 'Dumbbell Incline Curl',         bp: 'upper arms',  tg: 'biceps',     eq: 'dumbbell', sm: [], st: [], uni: true },
  { id: M.straightArmPD, n: 'Straight-Arm Cable Pulldown',   bp: 'back',        tg: 'lats',       eq: 'cable',    sm: [], st: [] },
  { id: M.revPecDeck,    n: 'Reverse Pec Deck',              bp: 'shoulders',   tg: 'deltoids',   eq: 'machine',  sm: [], st: [] },
]

// ── Routines ─────────────────────────────────────────────────────────────────
const rPushA = { id: uid(), name: 'Push A', emoji: 'pushpin', ex: [
  { id: M.incBarbell,    sets: 3, reps: 10, weight: 50 },
  { id: M.smithFlat,     sets: 3, reps: 10, weight: 25 },
  { id: M.pecDeck,       sets: 2, reps: 15, weight: 25 },
  { id: M.cableLatRaise, sets: 3, reps: 15, weight: 10 },
  { id: M.ohTricepExt,   sets: 3, reps: 12, weight: 30 },
  { id: M.straightBarPD, sets: 2, reps: 15, weight: 20 },
]}

const rPullA = { id: uid(), name: 'Pull A', emoji: 'magnet', ex: [
  { id: M.latPulldown,   sets: 3, reps: 12, weight: 40 },
  { id: M.seatedRow,     sets: 3, reps: 12, weight: 40 },
  { id: M.straightArmPD, sets: 2, reps: 15, weight: 25 },
  { id: M.revPecDeck,    sets: 2, reps: 15, weight: 15 },
  { id: M.preacherCurl,  sets: 3, reps: 12, weight: 20 },
  { id: M.dbHammerCurl,  sets: 2, reps: 12, weight: 7.5 },
]}

const rLegsA = { id: uid(), name: 'Legs A + Core', emoji: 'leg', ex: [
  { id: M.legPress,      sets: 3, reps: 12, weight: 70 },
  { id: M.rdl,           sets: 2, reps: 12, weight: 20 },
  { id: M.legCurl,       sets: 2, reps: 12, weight: 20 },
  { id: M.legExt,        sets: 2, reps: 15, weight: 20 },
  { id: M.standingCalf,  sets: 2, reps: 15, weight: 0  },
  { id: M.revCrunch,     sets: 2, reps: 15, weight: 0  },
]}

const rPushB = { id: uid(), name: 'Push B', emoji: 'pushpin', ex: [
  { id: M.incDbPress,    sets: 3, reps: 12, weight: 17.5 },
  { id: M.smithFlat,     sets: 3, reps: 10, weight: 25 },
  { id: M.cableFly,      sets: 2, reps: 12, weight: 30 },
  { id: M.cableLatRaise, sets: 3, reps: 15, weight: 10 },
  { id: M.ohTricepExt,   sets: 3, reps: 12, weight: 25 },
  { id: M.ropePushdown,  sets: 2, reps: 15, weight: 20 },
]}

const rPullB = { id: uid(), name: 'Pull B', emoji: 'magnet', ex: [
  { id: M.oneArmRow,     sets: 3, reps: 12, weight: 17.5 },
  { id: M.neutralLatPD,  sets: 3, reps: 12, weight: 40 },
  { id: M.cableRdFly,    sets: 2, reps: 15, weight: 10 },
  { id: M.facePull,      sets: 2, reps: 16, weight: 20 },
  { id: M.incCurl,       sets: 3, reps: 12, weight: 7.5 },
  { id: M.dbHammerCurl,  sets: 2, reps: 12, weight: 7.5 },
]}

const rLegsB = { id: uid(), name: 'Legs B + Core', emoji: 'leg', ex: [
  { id: M.splitSquat,    sets: 3, reps: 10, weight: 12 },
  { id: M.legPress,      sets: 3, reps: 12, weight: 70 },
  { id: M.legCurl,       sets: 3, reps: 12, weight: 20 },
  { id: M.rdl,           sets: 2, reps: 12, weight: 25 },
  { id: M.standingCalf,  sets: 3, reps: 15, weight: 0  },
  { id: M.revCrunch,     sets: 2, reps: 15, weight: 0  },
]}

const routines = [rPushA, rPullA, rLegsA, rPushB, rPullB, rLegsB]
const week = { 1: rPushA.id, 2: rPullA.id, 3: rLegsA.id, 4: rPushB.id, 5: rPullB.id, 6: rLegsB.id }

// ── Helper ───────────────────────────────────────────────────────────────────
function w(routine, dateISO, bw, entries) {
  const d   = new Date(dateISO)
  const start = d.getTime()
  return {
    id: uid(), d: dateISO, start, end: start + 3600000,
    routineId: routine.id, name: routine.name, bw: bw || 70,
    entries,
    prs: [],
    vol: entries.reduce((acc, e) => acc + e.sets.reduce((v, s) => v + (s.w || 0) * (s.r || 0), 0), 0)
  }
}

function sets(...arr) {
  return arr.map(([wt, r, notes]) => ({ w: wt || 0, r: r || 0, done: true, ...(notes ? { notes } : {}) }))
}

function topW(sets) { return Math.max(0, ...sets.map(s => s.w || 0)) }

function ex(id, rawSets) {
  const s = rawSets
  return { id, sets: s, topW: topW(s) }
}

// ── Workouts — exact data from ChatGPT ──────────────────────────────────────
// Undated sessions → approximate back-dates (Aug 2026) to preserve chronological order.

const workouts = [
  // ── Session 1: Push A (oldest — approximate date) ──────────────────────
  w(rPushA, '2026-08-14', null, [
    ex(M.incBarbell, sets(
      [50, 8, null],
      [50, 8, null],
      [50, 6, '6/7 on final set']
    )),
    ex(M.smithFlat, sets(
      [20, 10, '10 kg each side']
    )),
    // Unknown exercises logged with weight info only
    ex(M.cableLatRaise, sets(
      [5, 12, 'approximate — 7.5 kg dumbbell lateral raise']
    )),
    ex(M.ohTricepExt, sets(
      [10, 12, 'approximate — 10 kg first set max reps'],
      [7.5, 10, 'approximate — dropped weight second set']
    )),
  ]),

  // ── Session 2: Push A (second oldest — approximate date) ───────────────
  w(rPushA, '2026-08-20', null, [
    ex(M.incBarbell, sets(
      [30, 9, '15 kg each side (30 kg total with bar)'],
      [30, 8, '15 kg each side'],
      [30, 6, '15 kg each side']
    )),
    ex(M.smithFlat, sets(
      [20, 8, '10 kg each side'],
      [20, 8, '10 kg each side'],
      [20, 7, '10 kg each side']
    )),
    ex(M.cableLatRaise, sets(
      [5, 20, '5 kg each side'],
      [5, 20, '5 kg each side'],
      [5, 20, '5 kg each side']
    )),
    ex(M.cableFly, sets(
      [15, 20, 'double-pulley'],
      [25, 14, 'double-pulley'],
      [30, 10, 'double-pulley']
    )),
    ex(M.ohTricepExt, sets(
      [20, 15, '15 clean reps'],
      [25, 10, null]
    )),
  ]),

  // ── Session 3: Pull A partial (approximate — user was unwell) ──────────
  w(rPullA, '2026-08-23', null, [
    ex(M.latPulldown, sets(
      [40, 10, null],
      [40, 8,  null],
      [40, 8,  null]
    )),
  ]),

  // ── Session 4: Day 1 Push A (approximate date) ─────────────────────────
  w(rPushA, '2026-08-28', null, [
    ex(M.incBarbell, sets(
      [50, 9, null],
      [50, 8, null],
      [50, 6, '6/7 initial report']
    )),
    ex(M.smithFlat, sets(
      [20, 12, '10 kg each side'],
      [20, 10, '10 kg each side'],
      [20, 11, '10 kg each side']
    )),
    ex(M.cableFly, sets(
      [15, 12, '15 kg each side'],
      [15, 10, '15 kg each side']
    )),
    ex(M.cableLatRaise, sets(
      [5, 20, '5 kg each side'],
      [5, 20, '5 kg each side'],
      [5, 20, '5 kg each side']
    )),
    ex(M.ohTricepExt, sets(
      [20, 12, '15 kg noted earlier in sequence'],
      [25, 12, null]
    )),
  ]),

  // ── Session 5: Legs A — 2026-09-02 ────────────────────────────────────
  w(rLegsA, '2026-09-02', null, [
    ex(M.legPress, sets(
      [50, 12, 'warm-up — very easy'],
      [70, 12, null],
      [70, 12, null]
    )),
    ex(M.rdl, sets(
      [20, 12, 'empty 20 kg bar'],
      [20, 12, 'empty 20 kg bar']
    )),
    ex(M.legCurl, sets(
      [20, 12, null],
      [20, 12, null]
    )),
    ex(M.legExt, sets(
      [20, 15, null],
      [20, 15, null]
    )),
    ex(M.standingCalf, sets(
      [0, 15, 'no weight added'],
      [0, 15, 'no weight added']
    )),
    ex(M.revCrunch, sets(
      [0, 15, null],
      [0, 16, null]
    )),
  ]),

  // ── Session 6: Push B — 2026-09-03 ────────────────────────────────────
  w(rPushB, '2026-09-03', null, [
    ex(M.incDbPress, sets(
      [15, 15, '15 kg each — first set easy'],
      [17.5, 12, '17.5 kg each'],
      [17.5, 12, '17.5 kg each']
    )),
    ex(M.smithFlat, sets(
      [20, 12, '10 kg each side'],
      [20, 10, '10 kg each side'],
      [20, 11, '10 kg each side']
    )),
    ex(M.cableFly, sets(
      [15, 12, '15 kg each side'],
      [15, 12, '15 kg each side']
    )),
    ex(M.cableLatRaise, sets(
      [5,  20, '5 kg each side'],
      [10, 15, '10 kg each side'],
      [10, 15, '10 kg each side']
    )),
    ex(M.ohTricepExt, sets(
      [30, 12, null],
      [30, 7,  null],
      [25, 12, null]
    )),
    ex(M.ropePushdown, sets(
      [20, 15, 'clean reps'],
      [20, 12, null]
    )),
  ]),

  // ── Session 7: Pull B — 2026-09-05 ────────────────────────────────────
  w(rPullB, '2026-09-05', null, [
    ex(M.oneArmRow, sets(
      [15,   15, '15 kg each arm'],
      [17.5, 12, '17.5 kg each arm'],
      [17.5, 12, '17.5 kg each arm']
    )),
    ex(M.neutralLatPD, sets(
      [40, 12, null],
      [40, 8,  null],
      [35, 10, null]
    )),
    ex(M.cableRdFly, sets(
      [5,  16, '5 kg each side'],
      [10, 12, '10 kg each side']
    )),
    ex(M.facePull, sets(
      [20, 18, null],
      [20, 16, null]
    )),
    ex(M.incCurl, sets(
      [7.5, 12, '7.5 kg each'],
      [7.5, 12, '7.5 kg each'],
      [7.5, 9,  '7.5 kg each']
    )),
    ex(M.dbHammerCurl, sets(
      [7.5, 12, '7.5 kg each'],
      [7.5, 13, '7.5 kg each']
    )),
  ]),

  // ── Session 8: Push A — 2026-09-07 (today's session) ──────────────────
  w(rPushA, '2026-09-07', null, [
    ex(M.incBarbell, sets(
      [50, 10, null],
      [50, 9,  null],
      [50, 8,  null]
    )),
    ex(M.smithFlat, sets(
      [25, 8, '12.5 kg each side'],
      [25, 9, '12.5 kg each side'],
      [25, 8, '12.5 kg each side']
    )),
    ex(M.pecDeck, sets(
      [20, 17, null],
      [25, 15, null]
    )),
    ex(M.cableLatRaise, sets(
      [10, 20, '10 kg each side'],
      [10, 15, '10 kg each side'],
      [10, 12, '10 kg each side']
    )),
    ex(M.ohTricepExt, sets(
      [30, 12, null],
      [30, 9,  null],
      [30, 10, null]
    )),
    ex(M.straightBarPD, sets(
      [20, 15, 'straight bar used — rope pushdown felt unstable'],
      [20, 12, 'straight bar used — rope pushdown felt unstable']
    )),
  ]),
]

// ── Export ────────────────────────────────────────────────────────────────────
export const migrationState = {
  customEx,
  routines,
  week,
  workouts,
  bodyweight: [],
  effort: 'rir',
}
