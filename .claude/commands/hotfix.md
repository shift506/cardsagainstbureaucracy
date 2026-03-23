# /hotfix [description]

Fast-tracks a critical fix from development to production.

## Steps
1. Create branch: `git checkout -b hotfix/$(date +%Y%m%d-%H%M%S) main`
2. Assign QA + Reviewer agents immediately
3. Run CI with `HOTFIX=true` flag (skips staging deploy, goes direct to prod gate)
4. Trigger `deploy-prod.yml` with `HOTFIX=true` environment variable
5. Post Slack notification to `#incidents` with fix description and SHA

## Fast-track CI
- Skips: staging deployment, Lighthouse perf audit
- Requires: all unit tests pass, 0 CRITICAL review findings, manual approval gate
- Notifies: #releases Slack channel on completion
