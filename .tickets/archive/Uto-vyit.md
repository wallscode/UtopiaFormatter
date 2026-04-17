---
id: Uto-vyit
status: closed
deps: []
links: []
created: 2026-03-15T21:43:32Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "We have received a shipment of N,N gold coins and N,..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  We have received a shipment of 64,572 gold coins and 28,613 runes from Ill be there in a tick (5:1).

Normalised pattern:
  We have received a shipment of N,N gold coins and N,N runes from Ill be there in a tick (K:K).

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

