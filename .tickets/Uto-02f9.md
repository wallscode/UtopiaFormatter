---
id: Uto-02f9
status: open
deps: []
links: []
created: 2026-02-27T21:07:34Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "You will draft up to N% of your population."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You will draft up to 0% of your population.

Normalised pattern:
  You will draft up to N% of your population.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

