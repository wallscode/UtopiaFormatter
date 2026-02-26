---
id: Uto-fpk9
status: closed
deps: []
links: []
created: 2026-02-26T14:21:20Z
type: feature
priority: 2
tags: [parser, kingdom-news, dragons, output]
---
# Kingdom News: track and display dragon types in dragon start/complete lines

The dragon started/completed lines in the Kingdom News output currently show only a count. They should also list the type of each dragon in parentheses.

Dragon types: Topaz, Sapphire, Ruby, Emerald, Celestite, Amethyst

## Required output format

```
Dragons Started: 3 (Ruby, Topaz, Topaz)
Dragons Completed: 1 (Topaz)
Enemy Dragons Started: 2 (Topaz, Topaz)
Enemy Dragons Completed: 1 (Topaz)
Enemy Dragons Killed: 1 (Sapphire)
```

Types within the parentheses are listed in the order the events appear in the log. If a type cannot be determined from the log line, it should be omitted from the parenthetical (the count is still correct).

## Changes required

- In `parseAttackLine` (and wherever dragon start/complete/killed events are parsed in `js/parser.js`), extract the dragon type from the log line and accumulate it alongside the count
- Store each dragon event as a list of type strings (e.g. `dragonsStarted: ['Ruby', 'Topaz', 'Topaz']`) rather than a bare integer
- Update `formatKingdomNewsOutput` to render the type list in parentheses after the count

## Acceptance Criteria

- Dragons Started, Dragons Completed, Enemy Dragons Started, Enemy Dragons Completed, and Enemy Dragons Killed lines all include the type list in parentheses when at least one type was recorded
- Types are listed in log order, comma-separated
- If the count is 1, only one type appears: `Dragons Completed: 1 (Topaz)`
- Lines with zero count continue to be suppressed (per Uto-w5jv)
- Existing tests continue to pass
