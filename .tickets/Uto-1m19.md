---
id: Uto-1m19
status: closed
deps: []
links: []
created: 2026-03-01T01:14:41Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "We have entered into a formal ceasefire with Phoenix..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  We have entered into a formal ceasefire with Phoenix STFO (2:2). It will be unbreakable until January 10 of YR4!

Normalised pattern:
  We have entered into a formal ceasefire with Phoenix STFO (K:K). It will be unbreakable until January N of YRN!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

