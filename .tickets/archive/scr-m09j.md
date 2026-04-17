---
id: scr-m09j
status: closed
deps: []
links: []
created: 2026-04-17T00:32:34Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Early indications show that our operation was a succ..."

Unrecognized line reported 3 time(s) in context: kingdom-news.

Example line:
  Early indications show that our operation was a success. Our thieves have caused rioting. It is expected to last 12 days. (Sheldon Cooper (3:11), sent 12000)

Normalised pattern:
  Early indications show that our operation was a success. Our thieves have caused rioting. It is expected to last N days. (PROVINCE (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

