---
id: Uto-uv71
status: closed
deps: []
links: []
created: 2026-02-28T19:56:43Z
type: task
priority: 2
assignee: Jamie Walls
---
# Province News: indent detail lines under section headings

All Province News sections that have a heading line followed by detail lines should indent those detail lines with 2 spaces, matching the existing pattern in **Attacks Suffered** and **Shadowlight Thief IDs**.

## Reference (already correct)

```
Attacks Suffered: 3 (156 acres lost)
  Odd-lympics (3:7): 56 acres
  SomeProvince (2:3): 100 acres

Shadowlight Thief IDs:
  Arancini (2:4)
  10_Kentucky (3:3)
```

## Sections to update in formatProvinceNewsOutput (js/parser.js)

### Daily Login Bonus
```
Daily Login Bonus:
  3 total (1 extreme, 2 impressive)
  205 acres
  1,234 gold coins
  5,678 science books
```

### Scientists Gained
```
Scientists Gained:
  Economy: 2
  Military: 1
```

### Aid Received
```
Aid Received:
  1,234 gold coins
  567 bushels
  890 runes
  166 explore pool acres (84 lost in transit)
```

### Thievery Impacts
Top-level detail lines move to 2-space indent. Source sub-items (currently `  ${src}`) move to 4 spaces:
```
Thievery Impacts:
  5 operations detected (2 from unknown sources)
    SomeKingdom (3:1): 3
  3 operations intercepted by Shadowlight
    OtherKingdom (2:2): 3
  1,344 gold coins stolen
  Incite Riots: 2 occurrences, 10 days
  Sabotage Wizards: 3 occurrences, 7 days
  Propaganda: 5 troops deserted (soldiers: 5)
  Failed propaganda: 1
  Bribe General: 1
```

### Spell Impacts
Same pattern — detail lines to 2 spaces, source sub-items to 4 spaces:
```
Spell Impacts:
  5 attempts
    Province1 (1:1): 3
    Province2 (2:2): 2
  Meteor shower: 3 days, 150 total casualties (peasants: 100, soldiers: 50)
  Pitfalls: 3 occurrences, 35 days
  Greed: 1 occurrence, 12 days
  [other duration spells shown the same way]
```

### War Outcomes
```
War Outcomes:
  Land given up: 90 acres (30 to enemies, 60 redistributed)
  Resources received: 1,140 building credits, ...
```

## Implementation notes

- In `formatProvinceNewsOutput`, prefix each affected `out.push(...)` call with `  ` (2 spaces).
- Source sub-items inside Thievery Impacts detected/intercepted blocks and inside Spell Impacts attempts block currently use `  ${src}: ${cnt}` — change to `    ${src}: ${cnt}` (4 spaces) so they remain visually subordinate to their parent line.
- `applyProvinceNewsSettings` strips lines starting with `  ` (2 spaces) when `showSourceIdentifiers` is false — verify this still works correctly for the newly indented lines. Since the source identifier lines move from 2 to 4 spaces, the strip condition may need to check `startsWith('  ')` (which 4-space lines still satisfy), or be updated to strip all lines that start with any whitespace.

## Tests

Run `tests/province-news.test.js` after the change. Most `assertContains` checks use substrings and will pass unchanged. Update any assertions that rely on unindented strings at the start of a line.
