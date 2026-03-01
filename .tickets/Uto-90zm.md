---
id: Uto-90zm
status: open
deps: []
links: []
created: 2026-03-01T17:07:26Z
type: bug
priority: 2
assignee: Jamie Walls
---
# Province Logs: fix 15 Unknown Thievery Targets entries — Greater Arson + Assassinate Generals

## Background

After the intel-op exclusion fix (Uto-4dwq), 15 Unknown entries remain in Thievery Targets for Willaimia Sherman (4:11) in the test data. Two root causes:

---

## Cause 1: Greater Arson — new op type, 13 entries

Arson and Greater Arson are two distinct thievery operations:

- **Arson** — targets buildings generically: `"burned down N acres of buildings"`. Already matched correctly. Keep as-is.
- **Greater Arson** — targets a specific named building type: `"burned down N <building>"` or `"burned down N acres of <Building>"`. Not currently matched — these 13 lines fall through as Unknown.

Example lines from test data (`provincelogs.txt`):
```
burned down 9 watch towers
burned down 11 homes
burned down 9 acres of Homes
burned down 12 acres of Watch Towers
burned down 9 acres of Hospitals
burned down 8 banks
burned down 9 guilds
(+ duplicates — 13 lines total)
```

### Display — like Propaganda, with per-building-type breakdown

**Thievery Summary** (parallel to how Propaganda lists troop types):
```
13 Greater Arson:
  35 watch towers
  22 homes
  9 banks
  ...
```

**Thievery Targets** — same per-type breakdown under each province:
```
  Willaimia Sherman (4:11) — N ops:
    Greater Arson: 13 (watch towers: 35, homes: 22, banks: 9, ...)
```
or follow whatever format feels natural given how Propaganda is displayed in that section.

### Implementation notes

**Detection:** `line.includes("burned down")` AND NOT `line.includes("buildings")`.
The existing Arson check already requires `line.includes("buildings")`, so the two ops are mutually exclusive by that guard.

**Building type + count extraction:**

Two sub-formats seen in the wild:
1. `"burned down N acres of BuildingType"` — extract N acres, type = word(s) after "acres of"
2. `"burned down N BuildingType"` — extract N as the count, type = word(s) after the number

Normalise building type names to lowercase for aggregation (e.g. `"Watch Towers"` → `"watch towers"`).

**Data structures needed** (parallel to `propagandaCounts`):
```javascript
const greaterArsonCounts = {};  // { 'watch towers': 35, 'homes': 22, ... }
```
Add to `PROVINCE_LOGS_CONFIG` if a building-type allowlist is useful, but an open-ended map is acceptable since building names vary.

**thiefOps entry for Greater Arson:**
```javascript
{
    target:     'Willaimia Sherman (4:11)',
    type:       'Greater Arson',
    success:    true,
    impact:     9,               // the numeric value extracted (acres or count)
    impactUnit: 'watch towers'   // the building type (lowercase)
}
```
The Thievery Targets builder already aggregates impact by type, so per-building totals will appear correctly without additional changes to the builder.

---

## Cause 2: Assassinate Generals — not a recognised op type (2 entries)

```
Our thieves assassinated 12 enemy troops!
```

The Assassinate Wizards op matches `"assassinated"` + `"wizards"`. The Assassinate Generals op uses `"enemy troops"` instead. No OPERATIONS entry exists for it.

Add an entry to `PROVINCE_LOGS_CONFIG.OPERATIONS` for Assassinate Generals with detection text `"assassinated"` and a secondary guard for `"enemy troops"` (to distinguish it from Assassinate Wizards which already claims `"assassinated"`). Impact unit: troops.

---

## Files to change

- `js/parser.js` — `PROVINCE_LOGS_CONFIG.OPERATIONS`, `greaterArsonCounts` data structure, Arson/Greater Arson matching block, and Thievery Summary output block inside `formatProvinceLogs`

## Verification

After the fix:
- Thievery Summary shows a `Greater Arson:` entry with per-building-type lines below it (like Propaganda).
- Thievery Targets shows no Unknown entries for Willaimia Sherman (4:11).
- `Assassinate Generals` appears as a named entry where applicable.
- Run `tests/province-logs.test.js` and update `tests/provincelogs_expected_output.txt`.
