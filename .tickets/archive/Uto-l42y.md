---
id: Uto-l42y
status: closed
deps: []
links: []
created: 2026-02-28T13:07:40Z
type: feature
priority: 2
tags: [ui, province-news, parser, sections]
assignee: Jamie Walls
---
# Province News: restructure sections, renames, default order, and identifier toggles

## Section renames

The following section names must change everywhere they appear: in the output text produced by `formatProvinceNewsOutput`, in `advSettings.provinceNews.sectionOrder`, in `advSettings.provinceNews.visible`, and in any string matching logic in `applyProvinceNewsSettings`.

| Old name | New name |
|---|---|
| `Thievery` | `Thievery Impacts` |
| `Spell Attempts` | `Spell Impacts` |
| `Scientists` | `Scientists Gained` |

## New sections in Advanced Settings

### Daily Login Bonus
Currently the "Daily Login Bonus" output block is emitted before the first recognized section, so it sits in the "header" and cannot be toggled or reordered. It must be added to `sectionOrder` and `visible` as a proper section.

The two existing adv settings entries `Monthly Land` and `Monthly Income` are internal parser concepts that the user never sees labelled. Remove them from `sectionOrder`/`visible` and replace with the single `Daily Login Bonus` entry.

### Spell Impacts (expanded)
The existing `Spell Attempts` section becomes `Spell Impacts`. It should absorb the content that is currently in `Hazards & Events` (meteor shower, pitfalls, Greed/soldier upkeep) so all spell- and magic-related impacts are in one section. Remove `Hazards & Events` from `sectionOrder`/`visible` once its content is merged.

## New default section order and visibility

The five sections visible by default, in this order:

1. `Thievery Impacts` — visible
2. `Spell Impacts` — visible
3. `Aid Received` — visible
4. `Scientists Gained` — visible
5. `Daily Login Bonus` — visible

All other sections default to hidden: `Resources Stolen`, `Shadowlight Attacker IDs`, `Attacks Suffered`, `War Outcomes`.

## Spell Impacts — detail toggle

Currently `formatProvinceNewsOutput` emits every source province for spell attempts. Change the default to only output the total count:

```
Spell Impacts: 14 attempts
```

Track per-source data in `data.spellsBySource` as before, but suppress the per-province lines in the output unless the new toggle is enabled (see identifier toggle below).

## Thievery Impacts — failed op count

Add tracking of the count of failed/intercepted thievery operations (ops attempted against us that were stopped by Shadowlight — currently `thieveryIntercepted`). Display this count in the Thievery Impacts section alongside the existing detected count. Also track source province names for intercepted ops (parallel to how `thieveryBySource` works for detected ops), suppressed by default behind the identifier toggle.

Example default output:
```
Thievery Impacts:
14 operations detected (3 from unknown sources)
6 operations intercepted by Shadowlight
```

## Advanced Settings: identifier toggle

Add a new checkbox to the Province News advanced settings panel:

> ☐ Show source province names for spell attempts and thievery operations

Default: `false` (off).

When enabled, the per-province breakdowns appear under both Thievery Impacts and Spell Impacts:

```
Thievery Impacts:
14 operations detected (3 from unknown sources)
  Province A (2:5): 4
  Province B (1:8): 7
6 operations intercepted by Shadowlight
  Province C (3:2): 6

Spell Impacts:
14 attempts
  Province A (2:5): 9
  Province B (1:8): 5
```

In `advSettings.provinceNews` add: `showSourceIdentifiers: false`.

In `applyProvinceNewsSettings`, when `showSourceIdentifiers` is false, strip any lines that are indented with two spaces from the Thievery Impacts and Spell Impacts sections.

## Implementation touch points

- `js/parser.js` — `formatProvinceNewsOutput`: rename section headers, merge Hazards & Events into Spell Impacts, change spell/thievery source lines to indented format, add intercepted-op source tracking to `data`
- `js/parser.js` — `parseProvinceNews` data init: add `interceptedBySource: {}` to track source names for intercepted thievery ops
- `js/parser.js` — `parseProvinceNewsLine`: populate `interceptedBySource` in the Shadowlight interception handler
- `js/ui.js` — `advSettings.provinceNews`: update `sectionOrder`, `visible`, remove Monthly Land/Monthly Income, add Daily Login Bonus, add `showSourceIdentifiers: false`
- `js/ui.js` — `renderProvinceNewsSettings`: add the new checkbox
- `js/ui.js` — `applyProvinceNewsSettings`: add source-line stripping when toggle is off
