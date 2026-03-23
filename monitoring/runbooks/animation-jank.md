# Runbook: Animation Jank / FPS Degradation

## Symptoms
- `animation.fps` metric < 50 for > 5 minutes
- CLS > 0.1 triggered by animation

## Bisect Steps
1. Check recent deploys: `gh release list --limit 5`
2. Identify first bad commit: `git bisect start HEAD <last-good-sha>`
3. Run perf check at each bisect step:
   ```bash
   pnpm build && pnpm preview &
   npx lighthouse http://localhost:4173 --output=json | jq '.audits["interactive"].score'
   ```
4. Run animation audit: `npx tsx scripts/audit-animations.ts`

## Profiling Commands
```bash
# Chrome DevTools performance profile
# Open DevTools > Performance > Record > interact > stop

# Check for layout thrash
npx tsx scripts/audit-animations.ts | jq '.findings[] | select(.rule == "non-composited-prop")'
```

## Rollback Trigger
If bisect identifies a specific commit and fix is not immediate:
```bash
gh workflow run rollback.yml -f deploy_sha=<good-sha> -f reason="animation jank regression"
```
