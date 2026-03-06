---
id: Uto-bhoe
status: closed
deps: []
links: []
created: 2026-03-02T22:08:30Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs: sort provinces within Thievery by Op Type and Spell by Spell Type by impact descending

## Goal

Within each op type in **Thievery by Op Type**, and within each spell type in **Spell by Spell Type**, sort the province sub-entries by aggregate impact descending (highest impact first) rather than by op/cast count.

When impact is zero or tied, fall back to count descending.

---

## Current behaviour

Provinces within each group are sorted by `provOps.length` (number of ops/casts) descending.

## Desired behaviour

Provinces within each group are sorted by total numeric impact descending. For example, under **Tower Robbery**:
```
  Tower Robbery — 51 ops (746,273 runes):
    to hell and back (3:9): 3 (164,991 runes)    ← highest impact first
    mystic (4:8): 5 (113,133 runes)              ← 5 ops but less impact
    Tintagel (4:8): 4 (97,763 runes)
    ...
```

---

## Special cases

- **Ops with no numeric impact** (Bribe Generals, Bribe Thieves, etc.): impact is 0 for all provinces → fall back to count sort, output unchanged.
- **Greater Arson**: total impact = sum of all building counts across all types for that province. Sort by that total descending.
- **Failed group**: no impact sorting needed — keep sorted by count (most failures first).

---

## Files to change

`js/parser.js` — two sort comparisons inside `formatProvinceLogs`:

1. **Thievery by Op Type** — the `.sort()` on `byProv.entries()` within the op-type loop:
```javascript
// Current
[...byProv.entries()].sort((a, b) => b[1].length - a[1].length)

// New (sort by impact desc, fall back to count)
[...byProv.entries()].sort((a, b) => {
    const impA = a[1].reduce((s, o) => s + (o.impact || 0), 0);
    const impB = b[1].reduce((s, o) => s + (o.impact || 0), 0);
    return impB - impA || b[1].length - a[1].length;
})
```

2. **Spell by Spell Type** — the same `.sort()` on `byProv.entries()` within the spell-type loop.

---

## Verification

After the fix, under Tower Robbery the province `to hell and back (3:9)` (164k runes, 3 ops) should appear above `mystic (4:8)` (113k runes, 5 ops) since it has higher impact despite fewer ops. Update `tests/provincelogs_expected_output.txt` and confirm `tests/province-logs.test.js` passes.

