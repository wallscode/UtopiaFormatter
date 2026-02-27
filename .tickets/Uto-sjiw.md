---
id: Uto-sjiw
status: open
deps: []
links: []
created: 2026-02-27T21:06:30Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "Your topic was created successfully."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  Your topic was created successfully.

Normalised pattern:
  Your topic was created successfully.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a forum topic creation notification.  It can be ignored and should not be logged as unrecognized.