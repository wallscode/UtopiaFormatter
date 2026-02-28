---
id: Uto-nsry
status: closed
deps: []
links: []
created: 2026-02-28T02:39:06Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "You have given orders to commence work on N farms an..."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You have given orders to commence work on 10 farms and 43 universities.

Normalised pattern:
  You have given orders to commence work on N farms and N universities.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

