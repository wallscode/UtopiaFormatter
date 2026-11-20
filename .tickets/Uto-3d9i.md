---
id: Uto-3d9i
status: closed
deps: []
links: []
created: 2026-11-20T01:22:17Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs, province-news]
---
# Province Logs parser: handle "Forces from N - PROVINCE (K:K) ambushed one of our a..."

Unrecognized line reported 2 time(s) in context: province-logs, province-news.

Example line:
  Forces from 13 - JustSayingHello (1:7) ambushed one of our armies. They recaptured 237 acres from our army! We lost 639 Knights in this battle.

Normalised pattern:
  Forces from N - PROVINCE (K:K) ambushed one of our armies. They recaptured N acres from our army! We lost N Knights in this battle.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.


## Notes

**2026-11-20T01:45:07Z**

Resolved — see commit; test added with the exact game text.
