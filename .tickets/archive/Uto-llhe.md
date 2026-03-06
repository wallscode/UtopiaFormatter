---
id: Uto-llhe
status: closed
deps: []
links: []
created: 2026-02-28T02:39:03Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have given orders to commence work on N universi..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have given orders to commence work on 8 universities.

Normalised pattern:
  You have given orders to commence work on N universities.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

