---
id: scr-frib
status: closed
deps: []
links: []
created: 2026-04-17T10:53:22Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your forces arrive at Justice (K:K). A tough battle ..."

Unrecognized line reported 4 time(s) in context: kingdom-news.

Example line:
  Your forces arrive at Justice (3:11). A tough battle took place, but we have managed a victory! Your army has taken 32 acres! 4 acres of buildings survived and can be refitted to fit our needs. We also gained 13 specialist training credits. 107 peasants settled on your new lands.

Normalised pattern:
  Your forces arrive at Justice (K:K). A tough battle took place, but we have managed a victory! Your army has taken N acres! N acres of buildings survived and can be refitted to fit our needs. We also gained N specialist training credits. N peasants settled on your new lands.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

