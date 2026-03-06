---
id: Uto-elz8
status: closed
deps: []
links: []
created: 2026-02-27T21:04:28Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "We lost N thieves in the operation."

Unrecognized line reported 11 time(s) in context: province-logs.

Example line:
  We lost 17 thieves in the operation.

Normalised pattern:
  We lost N thieves in the operation.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

In situations where it only shows We lost N thieves in the operation this is a situation where the operation was successful and the next line indicates the successful operation.  In these cases just keep track of the total number of thieves lost and consider that losses as part of successful operations.  Don't include that number in the output by default but include it in the advanced settings in the Thievery section to allow the user to show the number of thieves lost in successful operations.