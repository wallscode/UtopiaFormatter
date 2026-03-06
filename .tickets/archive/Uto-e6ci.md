---
id: Uto-e6ci
status: closed
deps: []
links: []
created: 2026-02-25T03:27:06Z
type: bug
priority: 2
tags: [parser, kingdom-news, output]
---
# Kingdom News output: Learn row missing books looted total

The requirements specify:

> "Count of learn attacks made by the kingdom from which the news was copied as well as a sum of all books looted in these attacks."

The current output shows only `Learn: N` (a count). It should show `Learn: N (X,XXX books)` with a formatted total of all books looted across all learn attacks.

## Required behaviour

- The `learn` data structure in `js/parser.js` already tracks `{ count, acres }` — `acres` is used for the books value (the field name is misleading; Learn attacks steal books not acres). Verify the books total is being summed correctly during parsing, then surface it in the output.
- Output format: `Learn: 4 (48,720 books)` — apply `formatNumber()` to the total.
- This applies to both the Attacks Made and Attacks Suffered summary blocks.

## Acceptance Criteria

- Learn row in output includes the books total in parentheses with number formatting
- Applies to both Made and Suffered sections
- If learn count is 0 the row is omitted (per Uto-w5jv zero-count suppression)
