---
id: scr-tqr9
status: closed
deps: []
links: []
created: 2026-04-17T10:53:22Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 4 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 8,511 runes and begin casting, and the spell succeeds. Meteors will rain across the lands of Timberwolf (3:11) for 8 days. (Timberwolf (3:11))

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Meteors will rain across the lands of Timberwolf (K:K) for N days. (PROVINCE (K:K))

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

