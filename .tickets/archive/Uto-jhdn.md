---
id: Uto-jhdn
status: closed
deps: []
links: []
created: 2026-03-04T22:13:18Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "EditionJanuary YRN Edition"

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  EditionJanuary YR4 Edition

Normalised pattern:
  EditionJanuary YRN Edition

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This can be skipped.  The format is Edition<month> YRN Edition and can be ignored as junk.