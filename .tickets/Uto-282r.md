---
id: Uto-282r
status: open
deps: []
links: []
created: 2026-03-04T12:15:22Z
type: task
priority: 2
assignee: Jamie Walls
---
# Security audit: AWS infrastructure hardening

Audit and harden the AWS infrastructure hosting UtopiaFormatter. Each item should be verified, fixed if confirmed, or documented as accepted risk.

**6. API Gateway logging endpoint — no client-side rate limiting**
logUnrecognizedLine is fire-and-forget with no throttle. A page with many unrecognised lines could fire dozens of requests in one parse operation. A malicious actor could also call the endpoint directly. Fix: verify API Gateway has usage plan / throttling configured (requests per second, burst limit). Consider adding WAF in front of the API Gateway to block obvious abuse. Confirm Lambda is not writing unbounded data to storage.

**7. S3 bucket public access**
Verify the S3 bucket serving the static site has Block Public Access enabled and that the bucket policy only allows CloudFront (via OAC/OAI) to read objects. Direct S3 URL access should be denied.

**8. CloudFront HTTPS enforcement**
Verify the CloudFront distribution has Viewer Protocol Policy set to 'Redirect HTTP to HTTPS' on all behaviours. Verify the TLS certificate is valid and auto-renewing (ACM).

**9. Lambda IAM role least privilege**
Verify the Lambda function that processes log endpoint requests uses an IAM role with the minimum required permissions (e.g. only write to the specific DynamoDB table or S3 prefix it needs, no broad wildcards). Run IAM Access Analyzer to surface over-permissive policies.

**10. config.js / secrets hygiene**
config.js is gitignored and generated from GitHub Secrets in CI/CD. Verify: (a) the secret value is not visible in GitHub Actions logs, (b) the secret is scoped to the minimum required (just the endpoint URL, no credentials), (c) old or rotated endpoint URLs are removed from GitHub Secrets.

## Acceptance Criteria

1. API Gateway throttling is confirmed configured. 2. S3 bucket Block Public Access is confirmed enabled and direct S3 access is denied. 3. CloudFront HTTPS redirect is confirmed on all behaviours and ACM certificate is valid and auto-renewing. 4. Lambda IAM role is confirmed least-privilege with no broad wildcards. 5. GitHub Actions logs confirmed to not expose the endpoint secret.

