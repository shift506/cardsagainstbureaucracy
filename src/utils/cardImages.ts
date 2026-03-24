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

/**
 * Sort Barriers/Enablers: only "Card Face (N).svg" files (numbered), sorted by N.
 * The unnumbered "Card Face.svg" is the blank template — excluded intentionally.
 * Consistent with Theories/Tools/Provocations where card[0] → "2.svg" (no "1.svg").
 */
function sortNamedFaces(paths: string[]): string[] {
  return paths
    .filter((p) => /\(\d+\)/.test(filename(p)))   // numbered files only
    .sort((a, b) => {
      const aN = parseInt(filename(a).match(/\((\d+)\)/)?.[1] ?? '0')
      const bN = parseInt(filename(b).match(/\((\d+)\)/)?.[1] ?? '0')
      return aN - bN
    })
}

/** Sort Theories/Tools/Provocations: numeric filenames "2.svg" … "21.svg" */
function sortNumberedFaces(paths: string[]): string[] {
  return [...paths].sort((a, b) => {
    const aN = parseInt(filename(a).replace('.svg', ''))
    const bN = parseInt(filename(b).replace('.svg', ''))
    return aN - bN
  })
}

function buildSuit(
  glob: GlobRecord,
  backName: string,
  faceSort: 'named' | 'numbered'
) {
  const entries = Object.entries(glob)
  const back = entries.find(([k]) => filename(k) === backName)?.[1] ?? ''
  const facePaths = entries
    .filter(([k]) => filename(k) !== backName)
    .map(([k]) => k)
  const sorted =
    faceSort === 'named' ? sortNamedFaces(facePaths) : sortNumberedFaces(facePaths)
  return { back, faces: sorted.map((p) => glob[p]).filter(Boolean) }
}

// ── Suit image maps ───────────────────────────────────────────────────────────

const SUITS = {
  barrier:    buildSuit(barrierGlob,    'BACK of Suit BARRIERS.svg', 'named'),
  enabler:    buildSuit(enablerGlob,    'BACK of Deck Suit.svg',     'named'),
  theory:     buildSuit(theoryGlob,     'Back of Suit.svg',          'numbered'),
  tool:       buildSuit(toolGlob,       'BACK Of CARD.svg',          'numbered'),
  provocation:buildSuit(provocationGlob,'PROVOCATIONS.svg',          'numbered'),
  agenda:     { back: '', faces: [] as string[] },
} satisfies Record<CardCategory, { back: string; faces: string[] }>

// ── Public API ────────────────────────────────────────────────────────────────

export function getCardBackImage(category: CardCategory): string {
  return SUITS[category].back
}

export function getCardFaceImage(category: CardCategory, imageIndex: number): string {
  return SUITS[category].faces[imageIndex] ?? ''
}
