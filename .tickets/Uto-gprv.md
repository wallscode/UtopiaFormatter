---
id: Uto-gprv
status: open
deps: []
links: []
created: 2026-03-01T15:02:11Z
type: bug
priority: 1
assignee: Jamie Walls
---
# Deploy: add img/* to S3 sync so scroll logo is uploaded

## Root cause

The GitHub Actions deploy workflow (`deploy.yml`) uses an explicit allowlist
with `--exclude "*"` followed by `--include` rules. The `img/` directory is
not in the allowlist, so `img/scroll_blue.png` is never uploaded to S3 and
CloudFront serves a 404 for it — making the header logo invisible.

## Current state — `.github/workflows/deploy.yml` (~line 66)

```yaml
aws s3 sync . "s3://..." \
  --delete \
  --exclude "*" \
  --include "index.html" \
  --include "css/*" \
  --include "js/config.js" \
  --include "js/parser.js" \
  --include "js/ui.js" \
  --include "js/main.js" \
  --no-progress
```

## Fix — one line added

```yaml
aws s3 sync . "s3://..." \
  --delete \
  --exclude "*" \
  --include "index.html" \
  --include "css/*" \
  --include "img/*" \
  --include "js/config.js" \
  --include "js/parser.js" \
  --include "js/ui.js" \
  --include "js/main.js" \
  --no-progress
```

Add `--include "img/*"` after `--include "css/*"`.

## Notes

- No other files need changing.
- The CloudFront invalidation (`/*`) already covers `img/` paths, so the
  image will be served fresh immediately after the next deploy.
- The local dev server already serves `img/scroll_blue.png` correctly —
  only the deployed site is affected.
