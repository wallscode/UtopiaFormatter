---
id: scr-gqbw
status: closed
deps: []
links: []
created: 2026-05-04T11:16:26Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "N,N men deserted our military due to housing shortag..."

Unrecognized line reported 1 time(s) in context: province-news.

Example line:
  1,065 men deserted our military due to housing shortages! This included 0 soldiers, 623 elites, 221 offensive specialists, 131 defensive specialists and 90 thieves.

Normalised pattern:
  N,N men deserted our military due to housing shortages! This included N soldiers, N elites, N offensive specialists, N defensive specialists and N thieves.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

