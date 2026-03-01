---
id: Uto-uwr9
status: closed
deps: []
links: []
created: 2026-03-01T01:14:27Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "Our people are starving! We have lost N peasants, N ..."

Unrecognized line reported 25 time(s) in context: province-news.

Example line:
  Our people are starving! We have lost 11 peasants, 3 Magicians, 19 Beastmasters and 5 thieves.

Normalised pattern:
  Our people are starving! We have lost N peasants, N Magicians, N Beastmasters and N thieves.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

