---
id: Uto-twmj
status: closed
deps: []
links: []
created: 2026-09-15T20:56:47Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Our army appears to have failed, Knight Benni. I am ..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Our army appears to have failed, Knight Benni. I am truly sorry.

Normalised pattern:
  Our army appears to have failed, Knight Benni. I am truly sorry.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

