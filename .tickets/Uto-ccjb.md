---
id: Uto-ccjb
status: closed
deps: []
links: []
created: 2026-02-28T12:49:29Z
type: bug
priority: 2
tags: [parser, province-news, magic-impacts]
assignee: Jamie Walls
---
# Province News: rename Soldier Upkeep to Greed and track total days

## Current behavior

The "Soldier upkeep demands" entry in the Magic Impacts section is the result of the Greed spell. The parser extracts the day count from the line but discards it — `soldierUpkeep` only has `{ count: 0 }` with no `totalDays`. Output is:

```
Soldier upkeep demands: 2
```

## Required changes

1. **Rename label** — output as `Greed` to match the spell name (consistent with how Rioting = Incite Riots and Mana disruption = Sabotage Wizards are labelled).

2. **Track total days** — add `totalDays: 0` to `soldierUpkeep` data structure and accumulate the parsed day value.

3. **Update output** to match the pattern used by Rioting and Mana disruption:
   ```
   Greed: 2 occurrence(s), disrupting upkeep for 28 days
   ```

4. **Update variable** names to match the new label:
   - `soldierUpkeep` → `greed`

## Affected locations in `js/parser.js`

- Data init (~line 2349): `soldierUpkeep: { count: 0 }` → add `totalDays: 0`
- Parser (~line 2078): `data.soldierUpkeep.count++` → also `data.soldierUpkeep.totalDays += parseInt(m[1])`
- Output (~line 2288): replace `Soldier upkeep demands: ${data.soldierUpkeep.count}` with the new formatted string
