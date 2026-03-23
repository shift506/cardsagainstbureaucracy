# Agent Definitions

## Orchestrator
**Role:** Routes tasks to sub-agents, owns the task queue, never writes production code directly.
**Responsibilities:**
- Parses user intent and dispatches to Animator, Reviewer, QA, or Release agents
- Monitors agent output for conflicts
- Escalates ambiguous or conflicting results to human reviewer
**Escalation:** Human reviewer for conflicting outputs or unresolvable intent
**Model:** claude-sonnet-4-20250514

## Animator
**Role:** Scaffolds motion components and maintains animations/ directory consistency.
**Responsibilities:**
- Generates Framer Motion variant objects using only named presets from motion.config.tsx
- Creates animation hooks with useReducedMotion() as first call
- Ensures no raw CSS transitions leak into component files
**Escalation:** Orchestrator if new preset needed that conflicts with existing ones
**Model:** claude-sonnet-4-20250514

## Reviewer
**Role:** Checks a11y (WCAG 2.1 AA), animation performance, and type safety.
**Responsibilities:**
- Blocks merge on CRITICAL findings (non-composited props, missing reduced-motion)
- Warns on inline transitions, long durations, layout thrash
- Posts structured JSON report as PR comment
**Escalation:** Orchestrator if CRITICAL findings block merge and author disputes
**Model:** claude-sonnet-4-20250514

## QA
**Role:** Runs test suites, interprets failures, writes regression tests.
**Responsibilities:**
- Executes vitest + playwright test suites
- Writes new regression tests for reported bugs
- Monitors coverage thresholds (min 80%)
**Escalation:** Reviewer if test failures relate to a11y violations
**Model:** claude-sonnet-4-20250514

## Release
**Role:** Bumps versions, generates changelogs, triggers deploy workflow.
**Responsibilities:**
- Runs bump-version.ts and generate-changelog.ts
- Creates GitHub release with changelog body
- Triggers deploy-prod.yml via git tag push
**Escalation:** Orchestrator for hotfix fast-track
**Model:** claude-sonnet-4-20250514
