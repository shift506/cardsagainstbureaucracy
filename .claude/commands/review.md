# /review

Audits animation code for performance and accessibility violations.

## Steps
1. Run `npx tsx scripts/audit-animations.ts`
2. Checks for:
   - **CRITICAL:** Animating `width`, `height`, `top`, `left` (use `transform` instead)
   - **CRITICAL:** Missing `useReducedMotion()` call in animation hooks
   - **WARN:** Inline transition strings (hardcoded `transition: { duration: 0.3 }`)
   - **WARN:** Animation duration > 600ms
   - **INFO:** Style and naming suggestions
3. Posts structured JSON report
4. **Blocks merge if any CRITICAL findings exist**

## Output Format
```json
{
  "findings": [
    { "severity": "CRITICAL", "rule": "non-composited-prop", "message": "...", "file": "...", "line": 42 }
  ],
  "approved": false
}
```
