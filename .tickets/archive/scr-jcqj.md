---
id: scr-jcqj
status: closed
deps: []
links: []
created: 2026-04-17T10:53:24Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your wizards gather N,N runes and begin casting, and..."

Unrecognized line reported 2 time(s) in context: kingdom-news.

Example line:
  Your wizards gather 3,813 runes and begin casting, and the spell succeeds. Much to the chagrin of their men, the womenfolk of Timberwolf (3:11) have taken a vow of chastity for 8 days! (Timberwolf (3:11))

Normalised pattern:
  Your wizards gather N,N runes and begin casting, and the spell succeeds. Much to the chagrin of their men, the womenfolk of Timberwolf (K:K) have taken a vow of chastity for N days! (PROVINCE (K:K))

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

