---
id: Uto-b58t
status: closed
deps: []
links: []
created: 2026-03-05T02:12:30Z
type: task
priority: 2
assignee: Jamie Walls
---
# Add /emphieltes redirect to emphieltes.github.io/utopia.github.io

Add a redirect so that https://utopiaformatter.com/emphieltes (and /emphieltes/) sends the visitor to https://emphieltes.github.io/utopia.github.io/

## Implementation

Since the site is a static S3/CloudFront deployment, the simplest approach is a static HTML redirect page committed to the repo:

Create `emphieltes/index.html` containing an instant redirect:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=https://emphieltes.github.io/utopia.github.io/">
  <link rel="canonical" href="https://emphieltes.github.io/utopia.github.io/">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="https://emphieltes.github.io/utopia.github.io/">emphieltes Utopia Parser</a>...</p>
</body>
</html>
```

The `<meta http-equiv="refresh">` fires immediately (content="0"). The fallback `<a>` link handles any browser that ignores the meta tag. The `<link rel="canonical">` signals to search engines that the canonical URL is the destination.

The file will be synced to S3 by the existing CI/CD pipeline (the S3 sync command already uploads all files). No CloudFront or infrastructure changes needed.

## Acceptance Criteria

1. Visiting https://utopiaformatter.com/emphieltes redirects to https://emphieltes.github.io/utopia.github.io/ with no delay. 2. The emphieltes/index.html file is committed and deployed.

