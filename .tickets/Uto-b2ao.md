---
id: Uto-b2ao
status: closed
deps: []
links: []
created: 2026-11-20T01:22:09Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Forces from N - PROVINCE (K:K) came through and rava..."

Unrecognized line reported 4 time(s) in context: province-logs.

Example line:
  Forces from 15 - Tartaria (1:7) came through and ravaged our lands! They captured 139 acres! We lost 8 soldiers, 578 Archers and 459 Knights in this battle.

Normalised pattern:
  Forces from N - PROVINCE (K:K) came through and ravaged our lands! They captured N acres! We lost N soldiers, N Archers and N Knights in this battle.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.


## Notes

**2026-11-20T01:32:44Z**

Closed as temporary error: this is a Province News line pasted into the Province Logs box. Verified 2026-11-19 that parseProvinceNews already handles it (no logUnrecognizedLine call).

**2026-11-20T01:36:59Z**

Correction to previous note: the app has a single input box. Root cause is auto-detection: a paste mixing Province Logs and Province News is routed entirely to formatProvinceLogs, so News lines get logged as unrecognized province-logs lines. Line itself is already handled by parseProvinceNews; tracked by the mixed-paste ticket.
