---
id: Uto-hb3m
status: open
deps: []
links: []
created: 2026-02-28T14:05:37Z
type: feature
priority: 2
tags: [province-news, ui, output, sections]
assignee: Jamie Walls
---
# Province News: update default section order, merge Resources Stolen into Thievery Impacts, rename Shadowlight section

## Changes required

### 1. New default section order and visibility

Update `advSettings.provinceNews.sectionOrder` and `visible` in `js/ui.js`:

| # | Section | Default visible |
|---|---|---|
| 1 | Attacks Suffered | **true** (was false) |
| 2 | Thievery Impacts | true |
| 3 | Shadowlight Thief IDs | false |
| 4 | Spell Impacts | true |
| 5 | Aid Received | true |
| 6 | Daily Login Bonus | true |
| 7 | Scientists Gained | false |
| 8 | War Outcomes | false |

Resources Stolen is removed as a standalone section (see change 2 below).

---

### 2. Merge Resources Stolen into Thievery Impacts

Resources Stolen (gold, runes, bushels, war horses) should appear as part of the **Thievery Impacts** section output rather than as a separate section.

In `formatProvinceNewsOutput` (`js/parser.js`):
- Move the Resources Stolen lines into the Thievery Impacts block, after the detected/intercepted op counts and before the per-op impact lines (Incite Riots, Sabotage Wizards, etc.), or at the end of the section — whichever reads most naturally.
- Remove the standalone `Resources Stolen:` section header and block.

Remove `'Resources Stolen'` from `sectionOrder` and `visible` in `js/ui.js`.

---

### 3. Rename "Shadowlight Attacker IDs" → "Shadowlight Thief IDs"

Rename in all locations:
- `formatProvinceNewsOutput` in `js/parser.js` — the section header string `'Shadowlight Attacker IDs:'` → `'Shadowlight Thief IDs:'`
- `advSettings.provinceNews.sectionOrder` in `js/ui.js` — array entry
- `advSettings.provinceNews.visible` in `js/ui.js` — object key

---

## Implementation touch points

- `js/parser.js` — `formatProvinceNewsOutput`: merge Resources Stolen into Thievery Impacts; rename Shadowlight section header
- `js/ui.js` — `advSettings.provinceNews`: update `sectionOrder`, `visible`, rename Shadowlight key
- `tests/province-news.test.js` — update assertions: remove Resources Stolen section check, add check for stolen resources appearing inside Thievery Impacts; update Shadowlight section name; update Attacks Suffered default visibility expectation
