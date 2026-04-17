---
id: scr-tdsb
status: open
deps: []
links: []
created: 2026-04-17T00:32:20Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Early indications show that our operation was a succ..."

Unrecognized line reported 8 time(s) in context: kingdom-news.

Example line:
  Early indications show that our operation was a success. Our thieves assassinated 130 enemy troops. (Tikismash PhD (3:11), sent 10000)

Normalised pattern:
  Early indications show that our operation was a success. Our thieves assassinated N enemy troops. (PROVINCE (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

