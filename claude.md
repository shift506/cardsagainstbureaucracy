# Cards Against Bureaucracy — Project Instructions

## What This Is

A software product that simulates a multi-person facilitated workshop for organizational challenges. Built on the ShiftFlow brand. Uses AI to embody six distinct personas, each with a card suit that anchors their perspective.

## Key Files

- `context.md` — Product overview, mechanics, design principles
- `session-flow.md` — AI-persona deliberation session structure
- `lead.md` — Lead agent persona definition
- `critic.md` — Critic agent persona definition (Barriers cards)
- `optimist.md` — Optimist agent persona definition (Enablers cards)
- `academic.md` — Academic agent persona definition (Theories + Models cards)
- `practitioner.md` — Practitioner agent persona definition (Tools + Methods cards)
- `philosopher.md` — Philosopher agent persona definition (Provocations cards)
- `cards/` — Card content definitions by suit
- `worksheets/` — 8 structured templates for human-facilitated sessions
- `ShiftFlow_Brand_Guidelines.md` — Brand colours, typography, tone

## Worksheets

The `worksheets/` directory contains fill-in templates for running sessions with teams. These are used to capture inputs from the user and structure the final outputs from the Agents.

| Worksheet | Phase |
|---|---|
| `01-session-log.md` | Session setup |
| `02-five-card-spread.md` | Card draw + sensemaking |
| `03-change-formula-check.md` | Readiness audit (conditional) |
| `04-decide-primary-picks.md` | Barrier + enabler selection |
| `05-deploy-72-hour-thin-slice.md` | Experiment design |
| `06-reality-check.md` | Approvals + blockers |
| `07-measures-and-learning.md` | Signals + learning loop |
| `08-after-action-review.md` | Post-experiment debrief |

## Card Suits → Personas

| Suit | Persona | JSON | Images |
|---|---|---|---|
| Barriers | Critic | `cards/barriers.json` | `cards/Barriers-card-images/` |
| Enablers | Optimist | `cards/enablers.json` | `cards/Enablers-card-images/` |
| Theories + Models | Academic | `cards/theories.json` | `cards/Theories-card-images/` |
| Tools + Methods | Practitioner | `cards/tools.json` | `cards/Tools-card-images/` |
| Provocations | Philosopher | `cards/provocations.json` | `cards/Provocations-card-images/` |
| Agenda Cards | Lead | `cards/agenda.json` | — |

## Card data structure

Type definitions: `types/cards.ts`
TypeScript exports: `cards/index.ts`

Card categories: `barrier` · `enabler` · `theory` · `tool` · `agenda` · `provocation`

## Brand

Primary colors: Galaxy (#10213C), New Leaf (#D6DE23), White (#FFFFFF)
Accent colors: Breeze (#BAE0C6), Ocean (#3B8EA5), Blossom (#F0AB86)
Fonts: Poppins Medium (headings), Glacial Indifference (subheadings), Poppins Regular (body)

Full brand guidelines in `ShiftFlow_Brand_Guidelines.md`.

## Development notes

- Persona `.md` files are AI system prompt source material
- JSON files in `cards/` are the source of truth for card content
- Session flow is the canonical source for UI/UX design
- `provocations.md` in `cards/` is a now-redundant stub and can be deleted
