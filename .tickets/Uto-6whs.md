---
id: Uto-6whs
status: closed
deps: []
links: []
created: 2026-02-27T22:48:00Z
type: feature
priority: 2
tags: [parser, province-logs, thievery]
---
# Province Logs parser: track Steal War Horses thievery op

Update the Province Logs parser to recognize and summarize a new thievery operation: **Steal War Horses**.

Text that appears in logs:
  Our thieves were able to release N horses but could only bring back N of them.

## Requirements

- Parse this line as a Thievery Op named "Steal War Horses".
- Track and aggregate totals for both:
  - horses released
  - horses stolen (brought back)
- In the Thievery Ops section summary, display both totals (released and stolen) for this op.

## Acceptance Criteria

- The line format above is recognized and no longer logged as unrecognized.
- Thievery Ops summary includes a "Steal War Horses" entry showing totals for released and stolen.
- Totals are correct across multiple occurrences in the same log.
