---
id: scr-i3na
status: closed
deps: []
links: []
created: 2026-04-17T10:53:23Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "We have sent N,N gold coins to ticking time (K:K). I..."

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  We have sent 171,048 gold coins to ticking time (5:1). It should arrive shortly! This aid shipment has added 171,048 gold coins to our aid surplus.

Normalised pattern:
  We have sent N,N gold coins to ticking time (K:K). It should arrive shortly! This aid shipment has added N,N gold coins to our aid surplus.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

