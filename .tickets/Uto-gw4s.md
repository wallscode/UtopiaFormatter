---
id: Uto-gw4s
status: closed
deps: []
links: []
created: 2026-09-15T20:55:35Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "A new recruit has accepted our invitation and assume..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  A new recruit has accepted our invitation and assumes control of the abandoned Aston Martin DBS (5:7).

Normalised pattern:
  A new recruit has accepted our invitation and assumes control of the abandoned Aston Martin DBS (K:K).

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

