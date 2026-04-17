---
id: scr-sht5
status: closed
deps: []
links: []
created: 2026-04-17T10:53:26Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Early indications show that our operation was a succ..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  Early indications show that our operation was a success. Our thieves have bribed an enemy general! (Michelle Flaherty (3:11), sent 1000)

Normalised pattern:
  Early indications show that our operation was a success. Our thieves have bribed an enemy general! (PROVINCE (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

