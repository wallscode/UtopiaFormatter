---
id: scr-7vzs
status: closed
deps: []
links: []
created: 2026-04-17T10:53:21Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 5 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 1,260 runes and begin casting, and the spell succeeds. We have made our lands extraordinarily fertile for 22 days!

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. We have made our lands extraordinarily fertile for N days!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

