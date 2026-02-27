---
id: Uto-xryu
status: open
deps: []
links: []
created: 2026-02-27T21:06:56Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "You will pay N% of military wages."

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  You will pay 200% of military wages.

Normalised pattern:
  You will pay N% of military wages.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This is a military wage notification.  It should be recorded in the Military Training section and should not be shown by default.

Add a checkbox to the advanced settings to include military wage notifications in the Military Training section.
