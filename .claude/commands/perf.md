# /perf

Runs Lighthouse CI performance audit against the preview build.

## Steps
1. Run `pnpm build && pnpm preview` (port 4173)
2. Run Lighthouse CI against `http://localhost:4173`
3. Required thresholds:
   - Performance score: >= 90
   - FPS: >= 55
   - CLS: <= 0.1
   - INP: <= 200ms
4. Flags any animation targeting `width`/`height`/`top`/`left` instead of `transform`/`opacity`
5. Posts score report as PR comment

## Failure Action
If any threshold is missed, create a WARN finding and request changes.
If FPS < 50, create CRITICAL finding and block merge.
