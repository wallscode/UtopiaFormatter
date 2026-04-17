---
id: scr-6eyt
status: closed
deps: []
links: []
created: 2026-04-16T22:22:59Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "). (PROVINCE (K:K), sent N)"

Unrecognized line reported 5 time(s) in context: province-logs.

Example line:
  ). (All too well 10 min version (2:1), sent 13924)

Normalised pattern:
  ). (PROVINCE (K:K), sent N)

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

