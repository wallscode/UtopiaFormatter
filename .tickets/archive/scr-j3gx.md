---
id: scr-j3gx
status: closed
deps: []
links: []
created: 2026-04-17T10:53:21Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N,N books allocated to SORCERY"

Unrecognized line reported 5 time(s) in context: kingdom-news.

Example line:
  21,546 books allocated to SORCERY

Normalised pattern:
  N,N books allocated to SORCERY

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

