---
id: scr-7hlq
status: closed
deps: []
links: []
created: 2026-04-17T10:53:21Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "You have set your draft rate to None."

Unrecognized line reported 5 time(s) in context: kingdom-news.

Example line:
  You have set your draft rate to None.

Normalised pattern:
  You have set your draft rate to None.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

