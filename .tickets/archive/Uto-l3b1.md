---
id: Uto-l3b1
status: closed
deps: []
links: []
created: 2026-03-11T01:22:07Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Kingdom Name (K:K) has declined our ceasefire pr..."

Unrecognized line reported 17 time(s) in context: kingdom-news.

Example line:
  Utopian Problems (5:11) has declined our ceasefire proposal!

Normalised pattern:
  Kingdom Name (K:K) has declined our ceasefire proposal!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

The parser should track this as a ceasefire decline event and include it in the kingdom news output in the Kingdom Relations section.
The pattern is: Some kingdom name (K:K) has declined our ceasefire proposal!  The kingdom name can be any string, and the K:K is the kingdom ID.
