---
id: Uto-x5xs
status: closed
deps: []
links: []
created: 2026-03-11T21:29:58Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "The natural leyline energies surrounding your provin..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  The natural leyline energies surrounding your province disrupt the incoming spell, causing it to fail before taking effect. Our mages noticed a possible spell attempt by Geppetto (3:10) causing trouble on our lands!

Normalised pattern:
  The natural leyline energies surrounding your province disrupt the incoming spell, causing it to fail before taking effect. Our mages noticed a possible spell attempt by Geppetto (K:K) causing trouble on our lands!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

