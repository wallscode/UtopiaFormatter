---
id: scr-vxkf
status: closed
deps: []
links: []
created: 2026-04-17T10:53:19Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 10 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 4,004 runes and begin casting, and the spell succeeds. A fireball burns through the skies of Moi (3:11). 584 peasants are killed in the destruction! (Moi (3:11))

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. A fireball burns through the skies of Moi (K:K). N peasants are killed in the destruction! (PROVINCE (K:K))

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

