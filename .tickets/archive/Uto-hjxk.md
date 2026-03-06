---
id: Uto-hjxk
status: closed
deps: []
links: []
created: 2026-03-04T21:00:39Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, kingdom-news]
---
# Kingdom News parser: handle "N - The Cult of Sotek (K:K) invaded N - your time is..."

Unrecognized line reported 1 time(s) in context: kingdom-news.

Example line:
  3 - The Cult of Sotek (4:10) invaded 2 - your time is up Give in (5:1) and captured 108 acres

Normalised pattern:
  N - The Cult of Sotek (K:K) invaded N - your time is up Give in (K:K) and captured N acres

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a user error where the user didn't copy the full line of text and should be handled as invalid input.  A warning message should be displayed to the user indicating that some of the input data appears to be cut off.