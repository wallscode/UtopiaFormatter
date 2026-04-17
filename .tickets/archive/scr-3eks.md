---
id: scr-3eks
status: closed
deps: []
links: []
created: 2026-04-17T10:53:24Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "We have sent N,N gold coins to Timeless Rock Band (K..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  We have sent 300,000 gold coins to Timeless Rock Band (5:1). It should arrive shortly! This aid shipment has added 300,000 gold coins to our aid surplus.

Normalised pattern:
  We have sent N,N gold coins to Timeless Rock Band (K:K). It should arrive shortly! This aid shipment has added N,N gold coins to our aid surplus.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

