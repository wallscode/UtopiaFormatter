---
id: scr-a2cs
status: closed
deps: []
links: []
created: 2026-04-17T10:53:23Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 4,902 runes and begin casting, and the spell succeeds. Blizzards will beset the works of Concordia (3:11) for 7 days! (Concordia (3:11))

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Blizzards will beset the works of Concordia (K:K) for N days! (PROVINCE (K:K))

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

