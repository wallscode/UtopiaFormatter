---
id: Uto-m3cl
status: closed
deps: []
links: []
created: 2026-02-28T02:33:44Z
type: feature
priority: 2
tags: [parser, province-logs, thievery]
---
# Province Logs: add robbery op counts to Resources Stolen section

Add Vault Robbery (gold), Granary Robbery (food/bushels), and Tower Robbery (runes) as tracked thievery operation names.

By default keep showing only the resource totals in the Resources Stolen section (existing behavior). Add an advanced settings checkbox to also show the count of each robbery op type alongside the totals.

Example default output (unchanged):
  1,404,731 gold coins stolen
  597,907 bushels stolen
  746,273 runes stolen

Example with robbery op counts enabled:
  1,404,731 gold coins stolen (12 ops Avg: 117k)
  597,907 bushels stolen (8 ops Avg: 75k)
  746,273 runes stolen (5 ops Avg: 149k)

Implementation:
- Parse lines for each robbery op type, track counts separately
- Add `showRobberyOpCounts` toggle (default false) that appends count parenthetical to each stolen resource line
- Add sentinel exclusions so these lines are not logged as unrecognized
- Add `showRobberyOpCounts` toggle (default false) that appends count parenthetical to each stolen resource line and includes average per op (rounded to nearest 1k when average is above 1k)
