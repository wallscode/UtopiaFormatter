---
id: scr-1qs5
status: closed
deps: []
links: []
created: 2026-04-17T10:53:22Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have ordered that N Beastmasters be trained."

Unrecognized line reported 4 time(s) in context: kingdom-news.

Example line:
  You have ordered that 367 Beastmasters be trained.

Normalised pattern:
  You have ordered that N Beastmasters be trained.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

