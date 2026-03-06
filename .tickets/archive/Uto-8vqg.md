---
id: Uto-8vqg
status: closed
deps: []
links: []
created: 2026-03-03T02:31:11Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "The lords of Utopia pass over this kingdom without g..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  The lords of Utopia pass over this kingdom without granting an extra invitation. It disappoints them that your monarch has not used existing invitations to strengthen the kingdom.

Normalised pattern:
  The lords of Utopia pass over this kingdom without granting an extra invitation. It disappoints them that your monarch has not used existing invitations to strengthen the kingdom.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

