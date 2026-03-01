---
id: Uto-ztuf
status: closed
deps: []
links: []
created: 2026-03-01T12:44:47Z
type: task
priority: 2
assignee: Jamie Walls
---
# Advanced Settings: parent-child groups in Show/Hide section

## Goal

Reorganise the Kingdom News **Show / Hide** section into three labelled
parent-child groups (Attacks, Dragons, Kingdom Relations). Each parent
checkbox controls whether its entire category is shown; child checkboxes
underneath individually control sub-items within that category. Standalone
items (Rituals, etc.) are unchanged.

---

## Desired UI structure

```
Show / Hide

[✓] Attacks
      [✓] Trad March
      [✓] Learn
      [✓] Massacre
      [✓] Plunder

[✓] Dragons
      [ ] Dragon Cancellations

[ ] Kingdom Relations
      [✓] War Declarations
      [✓] Ceasefires

[✓] Rituals started/completed
[ ] Rituals failed (summoning)
[✓] Ritual coverage of our lands
```

When a parent is **unchecked** its child checkboxes are rendered visually
disabled (reduced opacity, `pointer-events: none`) and their lines are
hidden regardless of the child's individual state.

---

## Current state — `js/ui.js`

### `advSettings.kingdomNews` (~line 11)

```javascript
showLearn: true,
showMassacre: true,
showPlunder: true,
showDragons: true,
showDragonCancellations: false,
showRituals: true,
showRitualsFailed: false,
showRitualCoverage: true,
showKingdomRelations: false,
```

### Checkbox list (~line 440)

```javascript
const checkboxItems = [
    { key: 'showLearn',                label: 'Learn attacks'                  },
    { key: 'showMassacre',             label: 'Massacre attacks'               },
    { key: 'showPlunder',              label: 'Plunder attacks'                },
    { key: 'showDragons',              label: 'Dragons'                        },
    { key: 'showDragonCancellations',  label: 'Dragon Cancellations'           },
    { key: 'showRituals',              label: 'Rituals started/completed'      },
    { key: 'showRitualsFailed',        label: 'Rituals failed (summoning)'     },
    { key: 'showRitualCoverage',       label: 'Ritual coverage of our lands'   },
    { key: 'showKingdomRelations',     label: 'Kingdom Relations'              }
];
```

### Line-level filter in `applyKingdomNewsSettings` (~line 999)

```javascript
if (!s.showLearn    && /^-- Learn:/.test(line))    return false;
if (!s.showMassacre && /^-- Massacre:/.test(line)) return false;
if (!s.showPlunder  && /^-- Plunder:/.test(line))  return false;
if (!s.showDragons  && /^-- (Enemy )?Dragons (Started|Completed):/.test(line)) return false;
if (!s.showDragons  && /^-- Enemy Dragons Killed:/.test(line))                  return false;
if (!s.showDragonCancellations && /^-- (Enemy )?Dragons Cancelled:/.test(line)) return false;
```

---

## Implementation — `js/ui.js` and `css/main.css`

### 1. Add new settings keys to `advSettings.kingdomNews`

```javascript
// Before
showLearn: true,
showMassacre: true,
showPlunder: true,
showDragons: true,
showDragonCancellations: false,

// After
showAttacks: true,          // NEW parent
showTradMarch: true,        // NEW child
showLearn: true,            // existing — now child of Attacks
showMassacre: true,         // existing — now child of Attacks
showPlunder: true,          // existing — now child of Attacks
showDragons: true,          // existing — promoted to parent
showDragonCancellations: false, // existing — child of Dragons
showKingdomRelations: false,    // existing — promoted to parent
showWarDeclarations: true,  // NEW child
showCeasefires: true,       // NEW child
```

### 2. Replace `checkboxItems` flat array with a `checkboxGroups` structured list

Replace the flat `checkboxItems` array and its render loop with a grouped
data structure:

```javascript
const checkboxGroups = [
    {
        parentKey: 'showAttacks',
        parentLabel: 'Attacks',
        children: [
            { key: 'showTradMarch', label: 'Trad March' },
            { key: 'showLearn',     label: 'Learn'      },
            { key: 'showMassacre',  label: 'Massacre'   },
            { key: 'showPlunder',   label: 'Plunder'    },
        ]
    },
    {
        parentKey: 'showDragons',
        parentLabel: 'Dragons',
        children: [
            { key: 'showDragonCancellations', label: 'Dragon Cancellations' },
        ]
    },
    {
        parentKey: 'showKingdomRelations',
        parentLabel: 'Kingdom Relations',
        children: [
            { key: 'showWarDeclarations', label: 'War Declarations' },
            { key: 'showCeasefires',      label: 'Ceasefires'       },
        ]
    },
    // Standalone (no parent)
    { key: 'showRituals',        label: 'Rituals started/completed'    },
    { key: 'showRitualsFailed',  label: 'Rituals failed (summoning)'   },
    { key: 'showRitualCoverage', label: 'Ritual coverage of our lands' },
];
```

The render loop iterates `checkboxGroups`. Items with a `parentKey` render
as a parent-child block (see CSS below). Items with only a `key` render as
before (standalone `.adv-group`).

**Parent-child render logic (pseudocode):**

```
for each group in checkboxGroups:
    if group has parentKey:
        render parentCheckbox in an .adv-parent-group div
        for each child:
            render childCheckbox in an .adv-child-group div inside the same wrapper
            childCheckbox.disabled = !parentChecked
        parentCheckbox onChange → update disabled state of all sibling children
    else:
        render as plain .adv-group (unchanged)
```

The parent wrapper div spans `grid-column: 1 / -1` so it takes a full row
and its children can use a sub-grid or simple left-padding for indentation.

### 3. Update line-level filters in `applyKingdomNewsSettings`

```javascript
// Before
if (!s.showLearn    && /^-- Learn:/.test(line))    return false;
if (!s.showMassacre && /^-- Massacre:/.test(line)) return false;
if (!s.showPlunder  && /^-- Plunder:/.test(line))  return false;
if (!s.showDragons  && /^-- (Enemy )?Dragons (Started|Completed):/.test(line)) return false;
if (!s.showDragons  && /^-- Enemy Dragons Killed:/.test(line))                  return false;
if (!s.showDragonCancellations && /^-- (Enemy )?Dragons Cancelled:/.test(line)) return false;

// After
// Attacks parent (hides all per-type breakdown lines when off)
const showAtks = s.showAttacks;
if ((!showAtks || !s.showTradMarch) && /^-- Trad March:/.test(line))                   return false;
if (!showAtks                        && /^-- (Ambush|Conquest|Raze):/.test(line))       return false;
if ((!showAtks || !s.showLearn)     && /^-- Learn:/.test(line))                         return false;
if ((!showAtks || !s.showMassacre)  && /^-- Massacre:/.test(line))                      return false;
if ((!showAtks || !s.showPlunder)   && /^-- Plunder:/.test(line))                       return false;

// Dragons parent + child
if (!s.showDragons && /^-- (Enemy )?Dragons (Started|Completed):/.test(line))           return false;
if (!s.showDragons && /^-- Enemy Dragons Killed:/.test(line))                            return false;
if ((!s.showDragons || !s.showDragonCancellations) && /^-- (Enemy )?Dragons Cancelled:/.test(line)) return false;

// Kingdom Relations children (parent gating already handled at section level)
if ((!s.showKingdomRelations || !s.showWarDeclarations) && /^-- War Declarations/.test(line))             return false;
if ((!s.showKingdomRelations || !s.showCeasefires)      && /^-- (Ceasefire|Formal Ceasefires)/.test(line)) return false;
```

**Notes on Attacks parent:** Ambush, Conquest, and Raze have no individual
child toggle — they are shown whenever the parent is on and hidden when it
is off.

**Notes on Kingdom Relations children:** The parent toggle still gates the
entire `** Kingdom Relations **` section (existing section-level logic is
unchanged). The child filters run in step 1 (line filter) and remove
individual lines from within that section when the parent is on but a child
is off. If all child lines are removed, the section header renders with no
content — acceptable for now; a follow-up can suppress the empty header.

### 4. Add CSS — `css/main.css`

After the existing `.adv-group` block, add:

```css
/* Parent-child checkbox groups in Show/Hide */
.adv-parent-group {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: 0;
}

.adv-parent-group > .adv-group {
    /* parent row — inherits normal .adv-group style */
}

.adv-children {
    display: flex;
    flex-direction: column;
    padding-left: 1.6rem;
}

.adv-child-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.15rem 0;
}

.adv-child-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #b8bec8;          /* slightly dimmer than parent */
    font-size: 0.85rem;
    cursor: pointer;
    margin-bottom: 0;
}

.adv-child-group input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: #8aafc8;
    cursor: pointer;
    flex-shrink: 0;
}

/* Disabled state when parent is unchecked */
.adv-children.disabled {
    opacity: 0.4;
    pointer-events: none;
}
```

---

## Tests

No test file changes are needed:

- `showAttacks: true` and `showTradMarch: true` default to `true`, so
  `-- Trad March:` lines continue to appear in test output unchanged.
- `showWarDeclarations: true` and `showCeasefires: true` default to `true`,
  but `showKingdomRelations: false` means the entire KR section is excluded
  from test output anyway.

Run `tests/kingdom-news-log.test.js` and verify it passes without
modification.

---

## Manual verification

1. Parse a Kingdom News log containing a mix of attack types, dragons, and
   Kingdom Relations events.
2. Confirm the Show/Hide section renders three parent-child groups plus the
   standalone Ritual items.
3. Uncheck **Attacks** — confirm all per-type breakdown lines (Trad March,
   Ambush, Conquest, Raze, Learn, Massacre, Plunder) disappear and all four
   child checkboxes become visually disabled.
4. Re-check **Attacks**, then uncheck **Trad March** — confirm only
   `-- Trad March:` lines disappear; other types remain.
5. Repeat for **Dragons** parent and **Dragon Cancellations** child.
6. Enable **Kingdom Relations**, then uncheck **War Declarations** — confirm
   only war declaration lines disappear; ceasefire lines remain.
7. Uncheck **Kingdom Relations** parent — confirm the entire section
   disappears and both child checkboxes are visually disabled.
