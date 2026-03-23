# Runbook: Deploy Rollback

## When to Roll Back
- Error rate > 1% sustained for > 5 minutes
- FPS degradation not resolved by hotfix within 30 minutes
- CLS > 0.25 on any production route

## Steps

### 1. Trigger Rollback Workflow
```bash
gh workflow run rollback.yml \
  -f deploy_sha=<target-sha> \
  -f reason="<incident description>"
```

### 2. Verify Rollback
```bash
# Check Vercel deployment
vercel ls --prod

# Verify SHA matches target
curl https://my-animation-app.com/version.json
```

### 3. Stakeholder Notification
Post to #incidents Slack channel:
```
ROLLBACK: Reverted production to <sha>
Reason: <description>
Impact: <affected routes/features>
ETA for fix: <estimate>
Owner: <name>
```

### 4. Post-Rollback
- Open incident issue in GitHub
- Schedule root cause analysis within 24h
- Update monitoring/alerts.yml if threshold needs tuning
