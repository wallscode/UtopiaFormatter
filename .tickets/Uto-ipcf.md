---
id: Uto-ipcf
status: closed
deps: []
links: []
created: 2026-03-15T21:43:21Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "A sudden lightning storm struck our towers and destr..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  A sudden lightning storm struck our towers and destroyed 14,481 runes!

Normalised pattern:
  A sudden lightning storm struck our towers and destroyed N,N runes!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

