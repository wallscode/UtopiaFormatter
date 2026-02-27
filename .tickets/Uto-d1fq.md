---
id: Uto-d1fq
status: closed
deps: []
links: []
created: 2026-02-27T15:03:09Z
type: feature
priority: 2
tags: [ci-cd, infrastructure, s3, cloudfront]
---
# Dev/prod deployment pipeline: single bucket with dev/ prefix

Configure deployment pipeline to use the existing S3 bucket for both environments, with production at the bucket root and development at a dev/ prefix. Non-main branches deploy to dev/ first; merging to main promotes to production at the root.

## Current State

deploy.yml targets two separate buckets (S3_BUCKET_PROD and S3_BUCKET_DEV) at their roots. The project has a single S3 bucket and single CloudFront distribution serving production at the bucket root.

## Required AWS Infrastructure Changes (manual — no committed files hold account-specific values)

### 1. New CloudFront distribution for dev
Create a second CloudFront distribution pointing to the same S3 bucket with an origin path of /dev. This serves the dev/ prefix as if it were the root, so the SPA routing works correctly.

Settings to match prod distribution:
- Origin: same S3 bucket, Origin Path: /dev
- Origin Access Control: same OAC as prod (or create a new one)
- Default root object: index.html
- Viewer protocol policy: redirect-to-https
- Cache policy: CachingOptimized (658327ea-f89d-4fab-a63d-7e88639e58f6)
- Custom error responses: 403→404/index.html, 404→404/index.html
- Price class: PriceClass_100

### 2. Update S3 bucket policy
Add an additional statement to allow the new dev CloudFront distribution's OAC to read from the bucket (same s3:GetObject permission, scoped to the new distribution's ARN via AWS:SourceArn condition).

### 3. Update IAM role permissions
Add cloudfront:CreateInvalidation permission for the new dev distribution ARN to the UtopiaFormatterGitHubActions role.

### 4. Update GitHub Secrets
- S3_BUCKET_DEV → set to the same bucket name as S3_BUCKET_PROD
- CLOUDFRONT_ID_DEV → set to the new dev distribution ID

## deploy.yml Changes

Update the Select environment step and Sync to S3 step:

- main branch: sync to s3://BUCKET/ (root), invalidate prod distribution — no change from current
- non-main branches: sync to s3://BUCKET/dev/ (prefix), invalidate dev distribution

The S3 sync destination for dev changes from:
  s3://${{ steps.env.outputs.bucket }}/
to:
  s3://${{ steps.env.outputs.bucket }}/${{ steps.env.outputs.prefix }}/

The Select environment step must emit a prefix output (empty string for prod, dev for non-main) alongside the existing bucket and cf_id outputs.

## Acceptance Criteria

- [ ] Dev CloudFront distribution created pointing to same bucket with origin path /dev
- [ ] S3 bucket policy allows both prod and dev CloudFront distributions to read
- [ ] IAM role allows cloudfront:CreateInvalidation on both distribution ARNs
- [ ] S3_BUCKET_DEV GitHub Secret set to same bucket as prod
- [ ] CLOUDFRONT_ID_DEV GitHub Secret set to new dev distribution ID
- [ ] deploy.yml updated: non-main branches sync to dev/ prefix in bucket
- [ ] deploy.yml updated: main branch continues to sync to bucket root (no regression)
- [ ] Pushing to a non-main branch deploys to dev URL
- [ ] Merging to main deploys to prod URL (bucket root)
- [ ] No account-specific values in any committed file

