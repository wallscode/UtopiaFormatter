---
id: scr-1a8c
status: closed
deps: []
links: []
created: 2026-04-16T22:23:31Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "The Lords of Utopia have forced Time for Nerds (K:K)..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  The Lords of Utopia have forced Time for Nerds (3:11) to withdraw from war to spare further suffering. Our people rejoice at this victory!

Normalised pattern:
  The Lords of Utopia have forced Time for Nerds (K:K) to withdraw from war to spare further suffering. Our people rejoice at this victory!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a successful war outcome where my kingdom forced the enemy kingdom to withdraw from war. It should be counted as a successfully won war and listed in the Kingdom Relations section at the bottom.

