---
id: Uto-9cio
status: closed
deps: []
links: []
created: 2026-03-03T02:22:22Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your message was successfully sent."

Unrecognized line reported 28 time(s) in context: province-logs.

Example line:
  Your message was successfully sent.

Normalised pattern:
  Your message was successfully sent.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

