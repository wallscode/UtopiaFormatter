---
id: Uto-dgpf
status: closed
deps: []
links: []
created: 2026-02-27T21:05:30Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have given orders to commence work on N banks."

Unrecognized line reported 3 time(s) in context: province-logs.

Example line:
  You have given orders to commence work on 71 banks.

Normalised pattern:
  You have given orders to commence work on N banks.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

