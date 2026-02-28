---
id: Uto-v63f
status: closed
deps: []
links: []
created: 2026-02-28T13:12:07Z
type: task
priority: 2
tags: [output, province-news, formatting]
assignee: Jamie Walls
---
# Province News: simplify verbose day descriptions to just N days

## Problem

Several output lines in `formatProvinceNewsOutput` include verbose filler phrases before or after the day count. The output should just show `N days` — the spell/impact name already provides enough context.

## Changes required (all in `js/parser.js`, `formatProvinceNewsOutput`)

| Current output | Simplified output |
|---|---|
| `Incite Riots: N occurrence(s), hampering tax for N days` | `Incite Riots: N occurrences, N days` |
| `Sabotage Wizards: N occurrence(s), disrupting mana for N days` | `Sabotage Wizards: N occurrences, N days` |
| `Meteor shower: N days of damage, N total casualties (...)` | `Meteor shower: N days, N total casualties (...)` |
| `Greed: N occurrence(s), disrupting upkeep for N days` *(added by Uto-ccjb)* | `Greed: N occurrences, N days` |

Note: `occurrence(s)` → `occurrence`/`occurrences` is handled separately by Uto-ig81. This ticket only covers removing the verbose day phrasing.

## Note on Pitfalls

Pitfalls currently show only a count with no days, even though days are parsed from the event line (`/haunting our lands for (\d+) days/`). The day count is captured but never stored or displayed. This is out of scope for this ticket but worth noting for a future improvement.
