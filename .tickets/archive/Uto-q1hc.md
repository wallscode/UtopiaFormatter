---
id: Uto-q1hc
status: closed
deps: []
links: []
created: 2026-03-11T01:46:45Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "We have cancelled our ceasefire with Kingdom Name (K:K)"

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  We have cancelled our ceasefire with Phoenix STFO (2:2)!

Normalised pattern:
  We have cancelled our ceasefire with Kingdom Name (K:K)!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

The parser should track this as a ceasefire withdrawal event and include it in the kingdom news output in the Kingdom Relations section.
The pattern is: We have cancelled our ceasefire with Kingdom Name (K:K)!  The kingdom name can be any string, and the K:K is the kingdom ID.

