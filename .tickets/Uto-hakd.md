---
id: Uto-hakd
status: closed
deps: []
links: []
created: 2026-11-20T01:22:35Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Our mages noticed a possible spell attempt by Nebula..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Our mages noticed a possible spell attempt by Nebula Haven (1:7) causing trouble on our lands!

Normalised pattern:
  Our mages noticed a possible spell attempt by Nebula Haven (K:K) causing trouble on our lands!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.


## Notes

**2026-11-20T01:32:44Z**

Closed as temporary error: this is a Province News line pasted into the Province Logs box. Verified 2026-11-19 that parseProvinceNews already handles it (no logUnrecognizedLine call).

**2026-11-20T01:36:59Z**

Correction to previous note: the app has a single input box. Root cause is auto-detection: a paste mixing Province Logs and Province News is routed entirely to formatProvinceLogs, so News lines get logged as unrecognized province-logs lines. Line itself is already handled by parseProvinceNews; tracked by the mixed-paste ticket.
