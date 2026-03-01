---
id: Uto-xubd
status: closed
deps: []
links: []
created: 2026-03-01T17:26:53Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs: Thievery Targets and Spell Targets alternate grouping by op/spell type

## Goal

Add two optional display modes to the Province Logs Advanced Settings that invert the grouping of the existing Thievery Targets and Spell Targets sections:

- **Thievery by Op Type** — group by operation first, provinces second
- **Spell by Spell Type** — group by spell first, provinces second

Both default to off. Both are independent of each other and independent of the existing Thievery Targets / Spell Targets sections (which remain grouped by province).

---

## Current layout (province-first)

```
Thievery Targets:
  Province A (3:6) — 6 ops:
    Vault Robbery: 4 (810k gold)
    Bribe Thieves: 1
  Province B (4:8) — 3 ops:
    Arson: 3 (17 acres)
```

## Desired alternate layout (op-first)

```
Thievery by Op Type:
  Vault Robbery — 4 ops (810,402 gold coins):
    Province A (3:6): 4 (810,402 gold coins)
  Arson — 3 ops (17 acres):
    Province B (4:8): 3 (17 acres)
  Bribe Thieves — 1 op:
    Province A (3:6): 1
```

Similarly for spells:

```
Spell by Spell Type:
  Meteor Showers — 62 casts (493 days):
    Province A (4:8): 4 (34 days)
    Province B (4:11): 3 (23 days)
    ...
  Mystic Vortex — 50 casts (107 active spells):
    ...
```

Sorting: op/spell types sorted descending by total cast/op count. Provinces within each type sorted descending by count.

---

## Implementation

### Approach: two new output sections in the parser

Add `"Thievery by Op Type"` and `"Spell by Spell Type"` as new named output sections in `formatProvinceLogs` (js/parser.js), built from the existing `thiefOps` and `spellOps` arrays. These are always computed when data is present, regardless of UI settings — visibility is controlled by the UI like any other section.

#### `buildThieveryByOpSection(thiefOps)`

1. Group all successful `thiefOps` by `type` (skip `null` types).
2. For each op type (sorted descending by total count):
   - Header: `  OpName — N ops (total impact)` or just `  OpName — N ops` if no impact
   - Group by target province, sorted descending by count
   - Each province line: `    ProvinceName: N (aggregate impact)`
3. Failures: group all failed ops by province, append as `  Failed — N ops:` section at the end with provinces listed below.

#### `buildSpellByTypeSection(spellOps)`

Same structure, using `spell` field instead of `type`, `impactUnit` for units.

### Register sections in ui.js

**`sectionOrder`** — insert after their province-first counterparts:
```javascript
'Thievery Targets', 'Thievery by Op Type', 'Resources Stolen',
'Spell Targets', 'Spell by Spell Type',
```

**`visible`** — both default off:
```javascript
'Thievery by Op Type': false,
'Spell by Spell Type': false,
```

No other UI changes needed — the existing section toggle checkboxes handle the rest automatically.

---

## Verification

1. Parse a Province Log with thievery and spell ops against multiple named provinces.
2. Enable *Thievery by Op Type* — confirm ops listed first with provinces indented below.
3. Enable *Spell by Spell Type* — confirm spells listed first with provinces indented.
4. Enable both alongside *Thievery Targets* and *Spell Targets* — all four sections appear simultaneously.
5. Run `tests/province-logs.test.js` (no test changes needed since new sections default to off).

