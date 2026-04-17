---
id: scr-srcv
status: closed
deps: []
links: []
created: 2026-04-16T22:23:26Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Chakat Ma At (K:K) has withdrawn their ceasefire pro..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  Chakat Ma At (2:1) has withdrawn their ceasefire proposal.

Normalised pattern:
  Chakat Ma At (K:K) has withdrawn their ceasefire proposal.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

