---
id: Uto-7lc6
status: closed
deps: []
links: []
created: 2026-03-04T02:43:58Z
type: task
priority: 2
assignee: Jamie Walls
---
# Security audit: client-side XSS hardening

Audit the codebase and AWS infrastructure for security issues. Findings identified during pre-ticket review are listed below. Each item should be verified, fixed if confirmed, or documented as accepted risk.

## Client-side findings

**1. XSS risk — error.message injected via innerHTML (main.js:94)**
errorDiv.innerHTML includes `${error.message}` directly. ParseError messages currently use predefined constant strings (EMPTY_INPUT, NO_DATE_FOUND, etc.) so there is no immediate exploit path. However, if any future error message ever incorporates user input, this becomes stored XSS. Fix: replace innerHTML template with textContent assignments for each element, or sanitize error.message before injection.

**2. No Content Security Policy header**
No CSP is configured. Without CSP, any XSS that does occur (e.g. from finding #1 in the future) can exfiltrate data or load external scripts. Fix: add a strict CSP via CloudFront response headers policy. Suggested policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' <logEndpoint-domain>; frame-ancestors 'none'. Note the inline script in index.html (APP_CONFIG bootstrap) may require 'unsafe-inline' or a nonce.

**3. Missing security response headers**
Verify CloudFront is sending: X-Content-Type-Options: nosniff, X-Frame-Options: DENY (or SAMEORIGIN), Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy restricting unused browser APIs (camera, microphone, geolocation).

**4. parser-backup.js served from public directory**
js/parser-backup.js exists in the repo and is therefore deployed to S3 and publicly accessible at /js/parser-backup.js. It is not loaded by index.html but is reachable directly. Leftover files increase attack surface and may expose older code with different behaviour. Fix: delete the file from the repo, or add a CloudFront function/rule to return 403 for that path.

## Out of scope (confirmed safe)
- No external CDN scripts or fonts loaded — no supply chain risk.
- No localStorage or sessionStorage usage — no sensitive client-side storage.
- innerHTML = '' usages in ui.js are all clearing operations — safe.
- GitHub external link has rel=noopener — safe.
- No AWS credentials or API keys in client-side code.

## Acceptance Criteria

1. Each finding is either fixed, mitigated, or documented as accepted risk with rationale. 2. CSP header is configured in CloudFront and does not generate console errors on the live site. 3. Security response headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy) are present on responses. 4. parser-backup.js is removed or blocked.

