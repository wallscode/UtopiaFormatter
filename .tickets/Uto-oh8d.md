---
id: Uto-oh8d
status: closed
deps: []
links: []
created: 2026-03-02T22:04:53Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs Advanced Settings: parent-child section grouping with constrained reordering

## Goal

Reorganise the Province Logs section list in Advanced Settings into parent-child groups. Parent groups reorder relative to each other; children only reorder within their parent.

---

## New group structure

| Group label | Children (in default order) |
|---|---|
| **Thievery** | Thievery Summary, Thievery Targets, Thievery by Op Type, Resources Stolen |
| **Spells** | Spell Summary, Spell Targets, Spell by Spell Type |
| Aid Summary | *(standalone — group of one)* |
| Dragon Summary | *(standalone)* |
| Ritual Summary | *(standalone)* |
| Construction Summary | *(standalone)* |
| Science Summary | *(standalone)* |
| Exploration Summary | *(standalone)* |
| Military Training | *(standalone)* |

Standalone sections are their own group; they have no parent label or child indentation.

---

## Data model — `js/ui.js`

Add a `sectionGroups` array to `advSettings.provinceLogs` alongside the existing `sectionOrder` and `visible`:

```javascript
sectionGroups: [
    { label: 'Thievery', children: ['Thievery Summary', 'Thievery Targets', 'Thievery by Op Type', 'Resources Stolen'] },
    { label: 'Spells',   children: ['Spell Summary', 'Spell Targets', 'Spell by Spell Type'] },
    { label: 'Aid Summary',          children: ['Aid Summary'] },
    { label: 'Dragon Summary',       children: ['Dragon Summary'] },
    { label: 'Ritual Summary',       children: ['Ritual Summary'] },
    { label: 'Construction Summary', children: ['Construction Summary'] },
    { label: 'Science Summary',      children: ['Science Summary'] },
    { label: 'Exploration Summary',  children: ['Exploration Summary'] },
    { label: 'Military Training',    children: ['Military Training'] },
]
```

`sectionOrder` remains the authoritative flat ordering used by `applyProvinceLogsSettings` — no changes needed there. The UI derives display order from `sectionOrder` (a group's position is determined by the index of its first present child).

---

## UI rendering — `renderProvinceLogsSettings`

Replace the current flat `renderList()` loop with a two-tier renderer:

### Group ordering

Derive the current group order from `sectionOrder`: for each group, find the minimum index of any of its children that are present in `presentSections`. Sort groups ascending by that index. This keeps groups in sync with `sectionOrder` without a separate group-order array.

### Rendered structure

```
[▲][▼]  Thievery                    ← parent row (bold label, no checkbox)
         [▲][▼] ☑ Thievery Summary  ← child row (indented, has checkbox)
         [▲][▼] ☐ Thievery Targets
         [▲][▼] ☐ Thievery by Op Type
         [▲][▼] ☑ Resources Stolen
[▲][▼]  Spells
         [▲][▼] ☑ Spell Summary
         ...
[▲][▼]  ☑ Aid Summary               ← standalone: parent row IS the checkbox row
...
```

- Standalone groups (one child): parent row includes the checkbox directly, no separate child rows.
- Multi-child groups: parent row is label-only (no checkbox). Children have checkboxes.

### Reorder logic

**Parent move up/down**: swap all children of the moving group with all children of the adjacent group in `sectionOrder`. Because `sectionOrder` is a flat array, swapping two groups of sizes M and N means splicing out the M children and inserting them at the position of the N children (or vice versa).

**Child move up/down**: swap just that child with its adjacent sibling within the same group in `sectionOrder` — identical to the current single-section swap, but clamped to siblings only (▲ disabled at first sibling, ▼ disabled at last sibling).

**Visibility filtering**: a group is shown if at least one of its children is in `presentSections`. Only present children are rendered within a group.

### Button disable rules

- Parent ▲: disabled if this group is the first visible group.
- Parent ▼: disabled if this group is the last visible group.
- Child ▲: disabled if this child is the first present child in its group.
- Child ▼: disabled if this child is the last present child in its group.

---

## CSS

Reuse existing `.adv-parent-group`, `.adv-children`, `.adv-child-group` classes already defined for the Kingdom News parent-child checkbox groups. Add any Province Logs-specific overrides needed for the combined reorder+checkbox layout.

---

## No changes needed

- `applyProvinceLogsSettings` — unchanged; still reads `sectionOrder` flat array.
- Parser — unchanged.
- Tests — unchanged (sections default to same visibility).

---

## Verification

1. Open Advanced Settings with a parsed Province Log.
2. Confirm Thievery and Spells groups render with children indented below.
3. Move the Thievery group down past Spells — output reorders both groups' sections together.
4. Within Thievery, move Thievery Targets below Thievery by Op Type — only those two swap.
5. Confirm standalone sections (Aid Summary, etc.) behave as before.

