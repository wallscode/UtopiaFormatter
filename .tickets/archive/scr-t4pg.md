---
id: scr-t4pg
status: closed
deps: []
links: []
created: 2026-04-17T00:32:36Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N runes and begin casting, and t..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 817 runes and begin casting, and the spell succeeds. Our realm is now under a sphere of protection for 13 days!

Normalised pattern:
  Your wizards gather N runes and begin casting, and the spell succeeds. Our realm is now under a sphere of protection for N days!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

