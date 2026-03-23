# /animate [ComponentName]

Scaffolds a new animated component with full test coverage.

## Steps
1. Run `node scripts/scaffold-component.ts --name <ComponentName>`
2. Creates:
   - `src/components/<ComponentName>.tsx` — component with m.div variants
   - `src/animations/variants/<componentName>Variants.ts` — variant map
   - `src/animations/hooks/use<ComponentName>Animation.ts` — animation hook
   - `tests/unit/<componentName>.test.ts` — Vitest unit stub
   - `tests/e2e/<componentName>.spec.ts` — Playwright visual stub
3. Reads `motion.config.tsx` tokens — generated animations MUST use named presets only
4. Runs Reviewer agent on generated files before returning

## Rules
- All hooks must call `useReducedMotion()` as first line
- No raw `style={{ transition }}` in generated components
- Variants must reference springs/easings from motion.config.tsx
