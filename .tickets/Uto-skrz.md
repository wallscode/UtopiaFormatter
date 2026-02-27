---
id: Uto-skrz
status: open
deps: []
links: []
created: 2026-02-27T21:04:45Z
type: feature
priority: 2
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Unnamed kingdom (K:K) has proposed a formal ceasefir..."

Unrecognized line reported 8 time(s) in context: kingdom-news.

Example line:
  Unnamed kingdom (5:3) has proposed a formal ceasefire with our kingdom. If accepted it will be unbreakable until July 9 of YR0!

Normalised pattern:
  Unnamed kingdom (K:K) has proposed a formal ceasefire with our kingdom. If accepted it will be unbreakable until July N of YRN!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

