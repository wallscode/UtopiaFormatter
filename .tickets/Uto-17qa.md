---
id: Uto-17qa
status: closed
deps: []
links: []
created: 2026-03-04T21:01:06Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N - Slept through sobriety test (K:K) attacked"

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  5 - Slept through sobriety test (4:8) attacked

Normalised pattern:
  N - Slept through sobriety test (K:K) attacked

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

If this is all that is passed to the parser, then we can't do much with it and it should be handled as invalid input and warning message should displayed indicating that some of the data appears to be cut off.


