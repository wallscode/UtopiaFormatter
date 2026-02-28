---
id: Uto-8t10
status: closed
deps: []
links: []
created: 2026-02-28T02:59:27Z
type: bug
priority: 2
tags: [parser, province-logs, thievery, propaganda]
assignee: Jamie Walls
---
# Province Logs: fix Propaganda parsing to correctly count converted troop types

## Bug

The Propaganda parser only recognises one of two sentence patterns the game produces, and only handles a hardcoded list of generic troop types. Everything it can't match falls back into a catch-all "elites" bucket, corrupting the output.

## Two sentence patterns in the wild

```
We have converted 9 of the enemy's specialist troops to our army.   ← matched ✓
We have converted 32 wizards from the enemy to our guild.           ← NOT matched ✗
We have converted 7 Ogres from the enemy to our army.               ← NOT matched ✗
We have converted 1 Elf Lord from the enemy to our army.            ← NOT matched ✗
```

The current regex `([\d,]+)\s+of the enemy's\s+<troop>` only fires on the first form.
Lines with `from the enemy` fall through to a loose fallback `/([\d,]+)\s+\w+/` that dumps everything into `propagandaCounts["elites"]`.

## Current vs. correct output (test data, lines 1152–1162)

| Troop | Current | Correct |
|---|---|---|
| specialist troops | 30 | 30 |
| wizards | — (lost in elites) | 49 |
| thieves | — (lost in elites) | 23 |
| Ogres | — (lost in elites) | 8 |
| Beastmasters | — (lost in elites) | 5 |
| Elf Lords | — (lost in elites) | 15 |
| **elites** | **100** | **0** |

Propaganda should independently count specialist troops, soldiers, wizards, and thieves which are all directly referenced.  All other troops should fall into the "elites" bucket.

## Fix

Consider replacing the troop-matching block with a single regex that handles both patterns:

```
We have converted N of the enemy's <troop> to our ...
We have converted N <troop> from the enemy to our ...
```

Consider dropping `PROPAGANDA_TROOPS` as a lookup list — instead extract the troop name directly from the line and use it as the key in `propagandaCounts`. This naturally handles any race-specific troop name without needing a hardcoded list.

Update `tests/provincelogs_expected_output.txt` to reflect the corrected breakdown.

