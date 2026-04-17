---
id: scr-2wrk
status: closed
deps: []
links: []
created: 2026-04-17T10:53:18Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 13 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 8,342 runes and begin casting, and the spell succeeds. Meteors will rain across the lands of Tak Mak (3:11) for 7 days. (Tak Mak (3:11))

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Meteors will rain across the lands of Tak Mak (K:K) for N days. (PROVINCE (K:K))

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

