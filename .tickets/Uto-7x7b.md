---
id: Uto-7x7b
status: open
deps: []
links: []
created: 2026-11-20T01:22:12Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your righteous assault disrupts enemy scholars! Thei..."

Unrecognized line reported 4 time(s) in context: province-logs.

Example line:
  Your righteous assault disrupts enemy scholars! Their Science Effectiveness is suppressed by 15% and Book Generation reduced by 20% for 7 ticks.

Normalised pattern:
  Your righteous assault disrupts enemy scholars! Their Science Effectiveness is suppressed by N% and Book Generation reduced by N% for N ticks.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

