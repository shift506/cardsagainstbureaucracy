// ============================================================
// data/cards/index.ts
// Unified export for all card data
// ============================================================

import barriers    from './barriers.json';
import enablers    from './enablers.json';
import theories    from './theories.json';
import tools       from './tools.json';
import agenda      from './agenda.json';
import provocations from './provocations.json';

import type {
  TransformationCard,
  BarrierCard,
  EnablerCard,
  TheoryCard,
  ToolCard,
  AgendaCard,
  ProvocationCard,
  CardCategory,
} from '../types/cards';

// ----------------------------
// Typed arrays per category
// ----------------------------
export const barrierCards     = barriers     as BarrierCard[];
export const enablerCards     = enablers     as EnablerCard[];
export const theoryCards      = theories     as TheoryCard[];
export const toolCards        = tools        as ToolCard[];
export const agendaCards      = agenda       as AgendaCard[];
export const provocationCards = provocations as ProvocationCard[];

// ----------------------------
// Flat union of all cards
// ----------------------------
export const allCards: TransformationCard[] = [
  ...barrierCards,
  ...enablerCards,
  ...theoryCards,
  ...toolCards,
  ...agendaCards,
  ...provocationCards,
];

// ----------------------------
// Lookup helpers
// ----------------------------
export const getCardById = (id: string): TransformationCard | undefined =>
  allCards.find(c => c.id === id);

export const getCardsByCategory = (category: CardCategory): TransformationCard[] =>
  allCards.filter(c => c.category === category);

export const searchCards = (query: string): TransformationCard[] => {
  const q = query.toLowerCase();
  return allCards.filter(c =>
    c.title.toLowerCase().includes(q) ||
    ('description' in c && typeof c.description === 'string' && c.description.toLowerCase().includes(q))
  );
};

// ----------------------------
// Re-export types for convenience
// ----------------------------
export type {
  TransformationCard,
  BarrierCard,
  EnablerCard,
  TheoryCard,
  ToolCard,
  AgendaCard,
  ProvocationCard,
  CardCategory,
} from '../types/cards';

export {
  isBarrier,
  isEnabler,
  isTheory,
  isTool,
  isAgenda,
  isProvocation,
  CATEGORY_META,
} from '../types/cards';
