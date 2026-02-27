---
id: Uto-0i8h
status: closed
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

## Secrets & Account-Specific Values

**Nothing account-specific may be committed to the repository.** This is an established project requirement. Violations would expose infrastructure to enumeration and potential attack.

### What must never appear in committed files

| Value | Why |
|---|---|
| AWS account ID | Enables targeted enumeration of resources |
| S3 bucket names | Enables enumeration attempts even on private buckets |
| CloudFront distribution IDs | Exposes infrastructure topology |
| Route53 hosted zone IDs | Exposes DNS infrastructure |
| IAM role/user ARNs | Exposes account ID and role names |
| AWS region | Treat as sensitive alongside other values |

### GitHub Secrets

All account-specific values are stored as GitHub Secrets and injected at deploy time. No hardcoded values in any committed file — including the workflow YAML itself.

Required secrets:

| Secret name | Value |
|---|---|
| `AWS_ROLE_ARN` | IAM role ARN for OIDC federation (see below) |
| `AWS_REGION` | e.g. `us-east-1` |
| `S3_BUCKET_PROD` | Production S3 bucket name |
| `S3_BUCKET_DEV` | Dev S3 bucket name |
| `CLOUDFRONT_ID_PROD` | Production CloudFront distribution ID (for cache invalidation) |
| `CLOUDFRONT_ID_DEV` | Dev CloudFront distribution ID |
| `LOG_ENDPOINT` | API Gateway URL for unrecognized-line logging (Uto-9wce) |

### Authentication: OIDC (no long-lived credentials)

Use GitHub Actions OIDC federation instead of `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`. This means:
- No long-lived credentials stored anywhere — nothing to rotate or leak
- GitHub Actions exchanges a short-lived OIDC token for temporary AWS credentials at runtime
- The IAM role trust policy restricts access to this specific repo and branch

IAM role trust policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::ACCOUNT:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike":  { "token.actions.githubusercontent.com:sub": "repo:YOUR-GITHUB-ORG/UtopiaFormatter:*" }
    }
  }]
}
```

GitHub Actions workflow authentication block:
```yaml
permissions:
  id-token: write   # required for OIDC
  contents: read

steps:
  - uses: aws-actions/configure-aws-credentials@v4
    with:
      role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
      aws-region: ${{ secrets.AWS_REGION }}
```

### Infrastructure-as-code files

The `.gitignore` already blocks real parameter files (`infra/params.json`, `infra/params.*.json`, `infra/*.tfvars`). Follow this pattern for any IaC added during this ticket:

| File | Committed | Contents |
|---|---|---|
| `infra/template.yaml` (or `.tf` files) | Yes | Resource definitions using parameter references, no hardcoded values |
| `infra/params.example.json` | Yes | Placeholder values showing required structure |
| `infra/params.json` | **No** (gitignored) | Real values — never committed |

### config.js generation in CI/CD

The `js/config.js` file is gitignored (see `js/config.example.js`). The workflow generates it from secrets before syncing to S3:

```yaml
- name: Write config
  run: echo "window.APP_CONFIG = { logEndpoint: '${{ secrets.LOG_ENDPOINT }}' };" > js/config.js
```

This step must run before the S3 sync step in both dev and prod jobs.

### Workflow YAML review checklist

Before merging any changes to the GitHub Actions workflow, verify:
- [ ] No hardcoded AWS account IDs, bucket names, distribution IDs, or ARNs anywhere in the file
- [ ] All account-specific values referenced as `${{ secrets.SECRET_NAME }}`
- [ ] `id-token: write` permission present for OIDC auth
- [ ] `js/config.js` generation step present before S3 sync in both dev and prod jobs

## Acceptance Criteria

- Pushing to a non-main branch deploys to dev URL automatically
- Merging to main deploys to prod URL automatically
- Dev and prod assets are fully isolated in S3
- HTTPS enforced via CloudFront
- Deployment status visible in GitHub Actions
- `git log --all -p` contains no AWS account IDs, bucket names, CloudFront IDs, or IAM ARNs
- Authentication uses OIDC — no `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` secrets exist
- `js/config.js` is generated from secrets at deploy time and never committed
- Infrastructure parameter files follow the committed-example / gitignored-real pattern

