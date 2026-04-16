---
id: scr-702q
status: closed
deps: []
links: []
created: 2026-04-16T22:22:25Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N - PROVINCE (K:K) attacked and disrupted the scient..."

Unrecognized line reported 16 time(s) in context: kingdom-news.

Example line:
  2 - Dilbert (3:11) attacked and disrupted the scientists ability to recall information of 21 - ticking time (5:1) from 789,267 books for a period of time.

Normalised pattern:
  N - PROVINCE (K:K) attacked and disrupted the scientists ability to recall information of N - PROVINCE (K:K) from N,N books for a period of time.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

