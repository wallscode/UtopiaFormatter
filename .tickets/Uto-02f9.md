---
id: Uto-02f9
status: closed
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

This line is an order to draft a percentage of the province's population.  This should be included in Military Training and should not be shown as default.  Add a checkbox to the advanced settings to include draft percentage settings in the Military Training section.

