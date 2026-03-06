---
id: Uto-gw7e
status: closed
deps: []
links: []
created: 2026-03-06T14:10:15Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N - PROVINCE (K:K) invaded N - PROVINCE (K:K) and ca..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  3 - The Cult of Sotek (4:10) invaded 2 - your time is up Give in (5:1) and captured 108 acres

Normalised pattern:
  N - PROVINCE (K:K) invaded N - PROVINCE (K:K) and captured N acres

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

