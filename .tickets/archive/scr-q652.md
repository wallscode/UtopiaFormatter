---
id: scr-q652
status: closed
deps: []
links: []
created: 2026-04-17T10:53:24Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have set your draft rate to Emergency."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  You have set your draft rate to Emergency.

Normalised pattern:
  You have set your draft rate to Emergency.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

