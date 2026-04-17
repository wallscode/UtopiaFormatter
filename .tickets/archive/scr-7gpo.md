---
id: scr-7gpo
status: closed
deps: []
links: []
created: 2026-04-17T10:53:17Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Early indications show that our operation was a succ..."

Unrecognized line reported 20 time(s) in context: kingdom-news.

Example line:
  Early indications show that our operation was a success. Our thieves have returned with 33,858 gold coins. (Annabeth Chase (3:11), sent 3000)

Normalised pattern:
  Early indications show that our operation was a success. Our thieves have returned with N,N gold coins. (PROVINCE (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

