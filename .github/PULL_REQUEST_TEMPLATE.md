## Description
<!-- What does this PR do? -->

## Animation Impact
- [ ] Animation perf impact noted (FPS delta before/after)
- [ ] `prefers-reduced-motion` tested manually
- [ ] `/review` agent run and returned LGTM (no CRITICAL findings)
- [ ] Visual diff attached for any animation changes
- [ ] Bundle size delta noted (run `pnpm build` and check output)

## Testing
- [ ] Unit tests pass (`pnpm test`)
- [ ] E2E tests pass (`pnpm playwright test`)
- [ ] Coverage >= 80%

## Checklist
- [ ] No raw `style={{ transition }}` props added
- [ ] All new animation hooks call `useReducedMotion()` as first line
- [ ] No `width`/`height`/`top`/`left` animated directly
