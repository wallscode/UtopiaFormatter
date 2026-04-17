---
id: scr-7s0b
status: open
deps: []
links: []
created: 2026-04-17T00:32:39Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 1,402 runes and begin casting, and the spell succeeds. Our lands have been blessed by nature for 24 days, and will be protected from drought and storms.

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Our lands have been blessed by nature for N days, and will be protected from drought and storms.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

