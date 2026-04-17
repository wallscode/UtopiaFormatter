---
id: scr-82yq
status: closed
deps: []
links: []
created: 2026-04-16T22:22:16Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N - PROVINCE (K:K) invaded and disrupted the scienti..."

Unrecognized line reported 17 time(s) in context: kingdom-news.

Example line:
  15 - Father time (5:1) invaded and disrupted the scientists ability to recall information of 19 - Casus Belli (2:1) from 671,946 books for a period of time.

Normalised pattern:
  N - PROVINCE (K:K) invaded and disrupted the scientists ability to recall information of N - PROVINCE (K:K) from N,N books for a period of time.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

