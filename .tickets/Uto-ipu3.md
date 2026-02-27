---
id: Uto-ipu3
status: closed
deps: []
links: []
created: 2026-02-27T20:29:25Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "N,N books allocated to TOOLS"

Unrecognized line reported 1 time(s) in context: province-logs.

Example line:
  1,342 books allocated to TOOLS

Normalised pattern:
  N,N books allocated to TOOLS

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

There should be a science allocated section in the output that summarizes the total number of books allocated to each type of science.

This is and indication of books being allocated to a type of science.  The types of science are:
- TOOLS
- ALCHEMY
- HOUSING
- PRODUCTION
- BOOKKEEPING
- ARTISAN
- STRATEGY
- SIEGE
- TACTICS
- VALOR
- HEROISM
- RESILIENCE
- CRIME
- CHANNELING
- SHIELDING
- CUNNING
- SORCERY
- FINESSE

The advanced settings should include a toggle for whether to include science books in the summary or not.

