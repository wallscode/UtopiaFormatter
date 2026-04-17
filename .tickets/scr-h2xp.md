---
id: scr-h2xp
status: open
deps: []
links: []
created: 2026-04-17T00:32:38Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 3,579 runes and begin casting, and the spell succeeds. A fireball burns through the skies of Timberwolf (3:11). 584 peasants are killed in the destruction! (Timberwolf (3:11))

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. A fireball burns through the skies of Timberwolf (K:K). N peasants are killed in the destruction! (PROVINCE (K:K))

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

