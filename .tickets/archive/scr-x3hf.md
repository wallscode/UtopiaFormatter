---
id: scr-x3hf
status: closed
deps: []
links: []
created: 2026-04-17T10:53:31Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your forces arrive at Steve Irwin (K:K). Your troops..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  Your forces arrive at Steve Irwin (3:11). Your troops find little meaningful resistance and quickly force your enemies to surrender! Your army has taken 32 acres! 1 acre of buildings survived and can be refitted to fit our needs. 81 peasants settled on your new lands.

Normalised pattern:
  Your forces arrive at Steve Irwin (K:K). Your troops find little meaningful resistance and quickly force your enemies to surrender! Your army has taken N acres! N acre of buildings survived and can be refitted to fit our needs. N peasants settled on your new lands.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

