---
id: scr-kbn1
status: closed
deps: []
links: []
created: 2026-04-17T10:53:15Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 41 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 3,277 runes and begin casting, and the spell succeeds. Our mages have caused our enemy's soldiers to turn greedy for 15 days. (Sheldon Cooper (3:11))

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Our mages have caused our enemy's soldiers to turn greedy for N days. (PROVINCE (K:K))

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

