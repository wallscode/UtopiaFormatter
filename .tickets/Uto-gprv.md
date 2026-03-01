---
id: Uto-gprv
status: closed
deps: []
links: []
created: 2026-03-01T15:02:11Z
type: bug
priority: 1
assignee: Jamie Walls
---
# Deploy: add img/* and favicon assets to S3 sync

## Root cause

The GitHub Actions deploy workflow (`deploy.yml`) uses an explicit allowlist
with `--exclude "*"` followed by `--include` rules. Two categories of static
assets are missing from the allowlist and are therefore never uploaded to S3:

1. **`img/scroll_blue.png`** — the header logo renders broken on the deployed site.
2. **Favicon assets** — `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`,
   `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`,
   and `site.webmanifest` are all referenced by `index.html` but never synced,
   so the browser tab icon and PWA icons are absent on the deployed site.

Both issues only affect the deployed site — the local dev server serves all
files correctly because it has direct filesystem access.

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

## Fix — six lines added

```yaml
aws s3 sync . "s3://..." \
  --delete \
  --exclude "*" \
  --include "index.html" \
  --include "css/*" \
  --include "img/*" \
  --include "favicon.ico" \
  --include "favicon-*.png" \
  --include "apple-touch-icon.png" \
  --include "android-chrome-*.png" \
  --include "site.webmanifest" \
  --include "js/config.js" \
  --include "js/parser.js" \
  --include "js/ui.js" \
  --include "js/main.js" \
  --no-progress
```

## Notes

- No other files need changing.
- The CloudFront invalidation (`/*`) already covers all these paths, so
  assets will be served fresh immediately after the next deploy.
- The favicon `<link>` tags in `index.html` use absolute paths
  (`/favicon-32x32.png` etc.), which resolve correctly from the S3/CloudFront
  bucket root once the files are uploaded.
- `site.webmanifest` references `android-chrome-192x192.png` and
  `android-chrome-512x512.png` — both must be uploaded alongside it.
