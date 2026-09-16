---
id: Uto-yprp
status: closed
deps: []
links: []
created: 2026-09-15T20:56:42Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Our monarch feels that this glorious kingdom is tarn..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  Our monarch feels that this glorious kingdom is tarnished by the abandoned province of Eckos. They order it destroyed and erased from our history books.

Normalised pattern:
  Our monarch feels that this glorious kingdom is tarnished by the abandoned province of Eckos. They order it destroyed and erased from our history books.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

