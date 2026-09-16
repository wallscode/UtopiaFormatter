---
id: Uto-x1i6
status: closed
deps: []
links: []
created: 2026-09-15T20:50:43Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "The lords of Utopia grant this kingdom a new opportu..."

Unrecognized line reported 4 time(s) in context: kingdom-news.

Example line:
  The lords of Utopia grant this kingdom a new opportunity to recruit a stalwart ally and boost their fortunes.

Normalised pattern:
  The lords of Utopia grant this kingdom a new opportunity to recruit a stalwart ally and boost their fortunes.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

