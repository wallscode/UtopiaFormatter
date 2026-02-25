---
id: Uto-w5jv
status: open
deps: []
links: []
created: 2026-02-25T03:27:06Z
type: bug
priority: 2
tags: [parser, kingdom-news, output]
---
# Kingdom News output: suppress zero-count attack type rows

The requirements state that each attack type row (Trad March, Conquest, Ambush, Raze, Learn, Massacre, Plunder, Bounces) should be omitted from the summary when its count is zero:

> "If no traditional march attacks are detected, this can be left out of the summary"
> (same wording applies to Conquest, Ambush, Raze, Learn, Massacre, and Bounces)

Currently `formatKingdomNewsOutput` in `js/parser.js` always outputs every row regardless of count, producing lines like `Trad March: 0 (0 acres)` and `Bounces: 0` in the output when there is no activity of that type.

## Required behaviour

In both the "Attacks Made" and "Attacks Suffered" summary blocks, only output a row for an attack type if its count is greater than zero. This applies to:

- Trad March (skip if `tradMarch.count === 0`)
- Conquest (skip if `conquest.count === 0`)
- Ambush (skip if `ambush.count === 0`)
- Raze (skip if `raze.count === 0`)
- Learn (skip if `learn.count === 0`)
- Massacre (skip if `massacre.count === 0`)
- Plunder (skip if `plunder.count === 0`)
- Bounces (skip if `bouncesMade === 0` for Made, `bouncesSuffered === 0` for Suffered)

## Acceptance Criteria

- Zero-count attack type rows are absent from the output
- Non-zero rows still appear with correct values
- Existing tests pass; a test is added that verifies omission of a zero-count type
