---
id: Uto-n9gl
status: closed
deps: []
links: []
created: 2026-11-20T01:22:39Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N - PROVINCE (K:K) invaded N - Resident Evil"

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  17 - Fidel Casdrow (6:7) invaded 22 - Resident Evil

Normalised pattern:
  N - PROVINCE (K:K) invaded N - Resident Evil

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.


## Notes

**2026-11-20T01:32:44Z**

Closed as temporary error: truncated copy-paste. The full form '... invaded N - Name (K:K) and captured N acres of land.' is already handled; this line is missing the defender's kingdom and outcome.
