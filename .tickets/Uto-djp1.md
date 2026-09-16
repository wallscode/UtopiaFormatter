---
id: Uto-djp1
status: closed
deps: []
links: []
created: 2026-09-15T20:57:32Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "SLOW SLOW descends in flames! N buildings are reduce..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  SLOW SLOW descends in flames! 26 buildings are reduced to ash and rubble.

Normalised pattern:
  SLOW SLOW descends in flames! N buildings are reduced to ash and rubble.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

