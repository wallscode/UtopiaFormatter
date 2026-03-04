---
id: Uto-yoez
status: closed
deps: []
links: []
created: 2026-03-02T22:53:11Z
type: task
priority: 2
assignee: Jamie Walls
---
# Audit test coverage and add targeted unit tests

Review the four existing test files and add targeted unit tests for the functionality that is only covered by snapshot comparison or not covered at all. The goal is to lock in the key numeric outputs and filter behaviours so future changes cannot silently break them.

## Design

## Existing coverage summary

| Test file | What it covers | Gap |
|---|---|---|
| `parser.test.js` | `parseText` / HTML-clean utilities | Narrow — utility only |
| `kingdom-news-log.test.js` | Full snapshot + per-province attack counts + `calculateUniques` unit tests + per-province unique counts | Good numeric coverage |
| `province-logs.test.js` | Snapshot tolerance comparison + section-presence string checks + function/constant availability | **No numeric assertions** for any specific op/spell count, section value, or filter behaviour |
| `province-news.test.js` | Full assertContains/assertNotContains suite covering sections, specific values, edge cases | Good targeted coverage |

---

## Gaps to address

### 1 — Province Logs: specific parsed value assertions

Add a new test block (similar to KN Tests 6–8) that asserts exact counts from the existing `tests/provincelogs.txt` test data:

- **Thievery Summary** — total counts per op type (e.g. Tower Robbery, Propaganda, Arson, Greater Arson with building breakdown, Night Strike, Steal War Horses, etc.)
- **Spell Summary** — total counts per spell type
- **Resources Stolen** — gold, runes, bushels, war horses totals
- **Thievery Targets** — number of distinct target provinces; confirm no Unknown entries; confirm intelligence ops are excluded
- **Spell Targets** — number of distinct target provinces
- **Thievery by Op Type** — confirm presence of op-type headings and province sub-rows; confirm impact-descending sort (highest-impact province appears before lower-impact province in Tower Robbery)
- **Spell by Spell Type** — same as above for at least one spell type
- **Aid Summary** — totals per resource
- **Dragon Summary**, **Ritual Summary** present when data exists
- **Greater Arson** — per-building breakdown appears in Thievery Summary

### 2 — Province Logs: `applyProvinceLogsSettings` unit tests

`applyProvinceLogsSettings` currently has zero tests. Add a small test block that feeds a known multi-section string through the function with toggled settings and asserts the correct output:

- Section visibility (section hidden when `visible[name] = false`)
- Section reordering (sectionOrder swap produces correct sequence)
- `showAverages` off: strips `(N ops Avg: X)` suffixes; does not append `(avg X)`
- `showAverages` on: keeps suffixes; appends averages to matching lines
- `showFailedThievery` off: removes failed-thievery lines
- `showRazedBuildings` off: removes razed lines
- `showTroopsReleased` off: removes released lines
- `showDraftPercentage` off: removes Draft: lines
- `showDraftRate` off: removes Draft rate: lines
- `showMilitaryWages` off: removes Military wages: lines
- `exploreDetails` off: removes soldier-cost lines
- `showSuccessThieveryLosses` off: removes thieves-lost lines

### 3 — Kingdom News: `applyKingdomNewsSettings` filter tests

Existing KN tests exercise the parser but not the post-processing filter. Add tests for:

- `showAttacks = false`: attack-type lines removed
- `showDragons = false`: dragon lines removed
- `showRituals = false`, `showRitualsFailed = false`
- `showKingdomRelations = false`
- `uniquesWithKingdoms = true/false`: uniques block placement changes
- Section reordering: sectionOrder swap changes block sequence in output

### 4 — Province News: `applyProvinceNewsSettings` filter tests

- `showSourceIdentifiers = false`: indented attacker-ID lines stripped from Thievery/Spell Impacts
- `showSourceIdentifiers = true`: attacker lines present
- Section visibility toggle
- Section reordering

---

## Implementation notes

- All new tests extend the existing test files (no new files needed unless a new helper test file for applySettings functions is cleaner).
- For the applySettings tests, construct minimal synthetic input strings rather than re-parsing the full test data — this makes failures easier to diagnose.
- Follow the `makeAssert()` / `assert(desc, got, expected)` pattern already established in `kingdom-news-log.test.js`.
- Tests must pass with `/opt/homebrew/bin/node tests/<file>` with exit code 0.

## Acceptance Criteria

1. All four test files pass with zero failures.
2. `province-logs.test.js` includes at least one numeric assertion for each active section (Thievery Summary op counts, Spell Summary counts, Resources Stolen totals).
3. `province-logs.test.js` includes at least 8 `applyProvinceLogsSettings` assertions covering the filter toggles.
4. `kingdom-news-log.test.js` includes at least 4 `applyKingdomNewsSettings` assertions.
5. `province-news.test.js` includes at least 2 `applyProvinceNewsSettings` assertions.
6. No existing tests are removed or loosened.

