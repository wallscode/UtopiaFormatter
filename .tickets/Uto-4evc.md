---
id: Uto-4evc
status: closed
deps: []
links: []
created: 2026-03-06T14:10:23Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N - PROVINCE (K:K) attacked"

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  5 - Slept through sobriety test (4:8) attacked

Normalised pattern:
  N - PROVINCE (K:K) attacked

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

