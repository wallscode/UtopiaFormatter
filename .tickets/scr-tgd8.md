---
id: scr-tgd8
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
  Your wizards gather 1,051 runes and begin casting, and the spell succeeds. Our realm is now under a sphere of protection for 23 days!

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Our realm is now under a sphere of protection for N days!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

