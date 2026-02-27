---
id: Uto-tjkz
status: closed
deps: []
links: []
created: 2026-02-27T21:06:44Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have given orders to commence work on N fort, N ..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have given orders to commence work on 1 fort, 2 thieves' dens and 1 library.

Normalised pattern:
  You have given orders to commence work on N fort, N thieves' dens and N library.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

