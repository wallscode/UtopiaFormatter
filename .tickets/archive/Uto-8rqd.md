---
id: Uto-8rqd
status: closed
deps: []
links: []
created: 2026-03-12T00:33:11Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N - PROVINCE (K:K) killed N,N people within N - PROV..."

Unrecognized line reported 4 time(s) in context: kingdom-news.

Example line:
  10 - Timeless Rock Band (5:1) killed 2,204 people within 12 - Luminary (3:10).

Normalised pattern:
  N - PROVINCE (K:K) killed N,N people within N - PROVINCE (K:K).

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a massacre attack where a province in our kingdom killed people in another province in our kingdom.  This should be counted as a massacre attack and the people killed should be added to the total people killed in the kingdom news summary in the Massacre Attacks section.

