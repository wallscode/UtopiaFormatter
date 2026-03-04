---
id: Uto-z9u9
status: closed
deps: []
links: []
created: 2026-03-04T22:13:29Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "EditionJanuary YRN Edition >July YRN Edition"

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  EditionJanuary YR4 Edition >July YR3 Edition

Normalised pattern:
  EditionJanuary YRN Edition >July YRN Edition

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This can be skipped and the format would be Edition<month> YRN Edition >Edition<month> YRN Edition.  Anything matching that format can be ignored as junk.

