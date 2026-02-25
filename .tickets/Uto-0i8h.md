---
id: Uto-0i8h
status: open
deps: []
links: []
created: 2026-02-24T22:36:28Z
type: task
priority: 2
tags: [infrastructure, aws, ci-cd]
---
# AWS deployment - S3/CloudFront/Route53 with CI/CD

Set up production-ready AWS deployment per requirements:

Infrastructure:
- S3 bucket with two environment folders (dev/ and prod/ or separate prefixes) so assets stay isolated
- CloudFront distribution pointing to the bucket, with separate origins or behaviors for dev vs. prod
- Route53 domain configuration

CI/CD pipeline:
- GitHub Actions workflow that syncs to the dev environment on push to a dev/feature branch
- Promotion to production via merge to main branch triggering a sync to the prod environment
- No staging/QA environment required

Branching strategy:
- main → production
- dev (or feature branches) → dev environment

## Acceptance Criteria

- Pushing to a non-main branch deploys to dev URL automatically
- Merging to main deploys to prod URL automatically
- Dev and prod assets are fully isolated in S3
- HTTPS enforced via CloudFront
- Deployment status visible in GitHub Actions

