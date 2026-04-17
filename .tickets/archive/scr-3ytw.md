---
id: scr-3ytw
status: closed
deps: []
links: []
created: 2026-04-16T22:21:56Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N - PROVINCE (K:K) razed N,N acres of N - PROVINCE (..."

Unrecognized line reported 26 time(s) in context: kingdom-news.

Example line:
  12 - The Curse of Lono (2:1) razed 1,208 acres of 7 - Slow Attack times (5:1).

Normalised pattern:
  N - PROVINCE (K:K) razed N,N acres of N - PROVINCE (K:K).

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

