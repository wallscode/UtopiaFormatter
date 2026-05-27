---
id: scr-y45n
status: closed
deps: []
links: []
created: 2026-05-27T20:29:10Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-news]
---
# Province News parser: handle "We have discovered turncoats amongst our thieves' gu..."

Unrecognized line reported 2 time(s) in context: province-news.

Example line:
  We have discovered turncoats amongst our thieves' guild.These men have been executed for treason!

Normalised pattern:
  We have discovered turncoats amongst our thieves' guild.These men have been executed for treason!

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a successful thievery operation called Bribe Thieves performed by an enemy province on my province.  It should be captured as a successful thievery operation with the operation name "Bribe Thieves".  There is no impact to track, so instead just capture the count of these events.