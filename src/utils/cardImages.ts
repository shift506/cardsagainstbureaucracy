import type { CardCategory } from '@/types/session'

type GlobRecord = Record<string, string>

// ── Raw globs (patterns must be string literals) ────────────────────────────

const barrierGlob = import.meta.glob<string>(
  '../data/cards/Barriers-card-images/*.svg',
  { query: '?url', import: 'default', eager: true }
) as GlobRecord

const enablerGlob = import.meta.glob<string>(
  '../data/cards/Enablers-card-images/*.svg',
  { query: '?url', import: 'default', eager: true }
) as GlobRecord

const theoryGlob = import.meta.glob<string>(
  '../data/cards/Theories-card-images/*.svg',
  { query: '?url', import: 'default', eager: true }
) as GlobRecord

const toolGlob = import.meta.glob<string>(
  '../data/cards/Tools-card-images/*.svg',
  { query: '?url', import: 'default', eager: true }
) as GlobRecord

const provocationGlob = import.meta.glob<string>(
  '../data/cards/Provocations-card-images/*.svg',
  { query: '?url', import: 'default', eager: true }
) as GlobRecord

// ── Helpers ──────────────────────────────────────────────────────────────────

function filename(path: string): string {
  return path.split('/').pop() ?? ''
}

/** Normalize a card ID or filename stem for fuzzy matching.
 *  Strips hyphens, underscores, spaces, ampersands; lowercases. */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[-_\s&]/g, '')
}

function buildSuit(glob: GlobRecord, backFilename: string) {
  const entries = Object.entries(glob)
  const back = entries.find(([k]) => filename(k) === backFilename)?.[1] ?? ''

  const faceMap: Record<string, string> = {}
  for (const [path, url] of entries) {
    const fname = filename(path)
    if (fname === backFilename) continue
    const key = normalize(fname.replace('.svg', ''))
    faceMap[key] = url
  }

  return { back, faceMap }
}

// ── Suit image maps ───────────────────────────────────────────────────────────

const SUITS = {
  barrier:     buildSuit(barrierGlob,     'BACK_of_Suit_BARRIERS.svg'),
  enabler:     buildSuit(enablerGlob,     'ENABLERS.svg'),
  theory:      buildSuit(theoryGlob,      'THEORIES&MODELS.svg'),
  tool:        buildSuit(toolGlob,        'TOOLS&METHODS.svg'),
  provocation: buildSuit(provocationGlob, 'PROVOCATIONS.svg'),
  agenda:      { back: '', faceMap: {} as Record<string, string> },
} satisfies Record<CardCategory, { back: string; faceMap: Record<string, string> }>

// ── Public API ────────────────────────────────────────────────────────────────

export function getCardBackImage(category: CardCategory): string {
  return SUITS[category].back
}

/** Look up a card face image by card ID (e.g. "organizational-inertia"). */
export function getCardFaceImage(category: CardCategory, cardId: string): string {
  const key = normalize(cardId)
  return SUITS[category].faceMap[key] ?? ''
}
