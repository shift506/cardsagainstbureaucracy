# Cards

Card data, types, and images for all five suits.

## Data files

| File | Category | Persona | Count |
|---|---|---|---|
| `barriers.json` | `barrier` | Critic | 20 |
| `enablers.json` | `enabler` | Optimist | 20 |
| `theories.json` | `theory` | Academic | 20 |
| `tools.json` | `tool` | Practitioner | 20 |
| `agenda.json` | `agenda` | Lead | 10 |
| `provocations.json` | `provocation` | Philosopher | 20 |

## Card schema

Each suit has a consistent base shape (`id`, `title`, `category`, `color`) plus suit-specific fields:

| Suit | Key fields |
|---|---|
| Barriers | `description`, `whyItMatters`, `howItShowsUp[]`, `howToCounteract[]`, `reflectionPrompt`, `examples[]` |
| Enablers | `description`, `whyItMatters`, `howToUseIt[]`, `reflectionPrompt`, `examples[]` |
| Theories | `description`, `whyItMatters`, `howItShowsUp?[]`, `howToUseIt[]`, `reflectionPrompts[]`, `examples[]` |
| Tools | `description`, `whyItMatters`, `howItShowsUp[]`, `howToUseIt[]`, `reflectionPrompts[]` |
| Agenda | `transformationType`, `statement`, `examples[]{label, exemplar}`, `designProvocation` |

Full type definitions are in `../types/cards.ts`.

## TypeScript exports (`index.ts`)

```ts
barrierCards    // BarrierCard[]
enablerCards    // EnablerCard[]
theoryCards     // TheoryCard[]
toolCards       // ToolCard[]
agendaCards     // AgendaCard[]
allCards        // TransformationCard[]

getCardById(id)
getCardsByCategory(category)
searchCards(query)
```

## Card images

| Directory | Suit | Back file |
|---|---|---|
| `Barriers-card-images/` | Barriers | `BACK of Suit BARRIERS.svg` |
| `Enablers-card-images/` | Enablers | `BACK of Deck Suit.svg` |
| `Theories-card-images/` | Theories + Models | `Back of Suit.svg` |
| `Tools-card-images/` | Tools + Methods | `BACK Of CARD.svg` |
| `Provocations-card-images/` | Provocations | `PROVOCATIONS.svg` |

## Notes

- Two Provocation cards share the title "Connect the Dots" — they are differentiated by ID (`connect-the-dots-networks` and `connect-the-dots-people`).
- `provocations.md` is a now-redundant stub and can be deleted.
