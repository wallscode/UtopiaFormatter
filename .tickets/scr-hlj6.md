---
id: scr-hlj6
status: closed
deps: []
links: []
created: 2026-05-04T11:16:37Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Mete"

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  Mete

Normalised pattern:
  Mete

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

