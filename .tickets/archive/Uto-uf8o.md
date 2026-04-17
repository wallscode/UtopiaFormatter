---
id: Uto-uf8o
status: closed
deps: []
links: []
created: 2026-03-12T00:32:51Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N - PROVINCE (K:K) invaded N - PROVINCE (K:K) and ki..."

Unrecognized line reported 5 time(s) in context: kingdom-news.

Example line:
  2 - blackhawk (3:10) invaded 13 - Time (5:1) and killed 2,475 people.

Normalised pattern:
  N - PROVINCE (K:K) invaded N - PROVINCE (K:K) and killed N,N people.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a massacre attack make by another province on our kingdom. It should be tracked as a massacre suffered.  It seems this is already being tracked properly in the parser, but verify it.
