---
id: scr-5nqh
status: closed
deps: []
links: []
created: 2026-04-17T10:53:32Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 4,805 runes and begin casting, and the spell succeeds. Pitfalls will haunt the lands of Tak Mak (3:11) for 16 days. They will suffer increased defensive losses during battle. (Tak Mak (3:11))

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Pitfalls will haunt the lands of Tak Mak (K:K) for N days. They will suffer increased defensive losses during battle. (PROVINCE (K:K))

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

