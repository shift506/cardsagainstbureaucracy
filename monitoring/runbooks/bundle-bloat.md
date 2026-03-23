# Runbook: Bundle Bloat

## Symptoms
- Main chunk > 500kb
- Animation chunk > 300kb
- CI `bundle-bloat` alert fires

## Analysis Commands
```bash
# Build and analyze bundle
pnpm build
npx vite-bundle-analyzer dist/

# Check individual chunk sizes
ls -lh dist/assets/

# Find largest imports
npx tsx -e "
const { execSync } = require('child_process')
execSync('npx source-map-explorer dist/assets/*.js --json > bundle-report.json')
"
```

## Common Causes and Fixes

### Three.js imported in main bundle
**Fix:** Ensure Three.js imports only exist inside `src/animations/canvas/` files.
Check `manualChunks` in `vite.config.ts`.

### GSAP tree-shaking not working
**Fix:** Import specific modules:
```ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
// NOT: import 'gsap/all'
```

### New large dependency added
**Fix:** Check if dependency can be lazy-loaded or replaced with smaller alternative.
Add to `manualChunks` in `vite.config.ts`.

## Prevention
- CI checks bundle size on every PR (`workflow/gates.yml`)
- Run `pnpm build` locally before opening PR
- Add large new deps to `manualChunks` immediately
