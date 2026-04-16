---
id: Uto-uosu
status: closed
deps: []
links: []
created: 2026-03-11T21:30:16Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "Your people appreciate the extreme dedication and ti..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  Your people appreciate the extreme dedication and time devoted to them in the last month and have worked harder to generate 95,795 gold coins. Additionally, your scholars have been busy, contributing 10,758 books to your growing library of knowledge.

Normalised pattern:
  Your people appreciate the extreme dedication and time devoted to them in the last month and have worked harder to generate N,N gold coins. Additionally, your scholars have been busy, contributing N,N books to your growing library of knowledge.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

