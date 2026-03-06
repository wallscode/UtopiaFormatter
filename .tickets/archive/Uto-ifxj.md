---
id: Uto-ifxj
status: closed
deps: []
links: []
created: 2026-02-28T23:25:31Z
type: task
priority: 2
assignee: Jamie Walls
---
# Kingdom News: default Uniques to grouped at bottom; invert grouping toggle

Currently the Advanced Settings toggle reads "Group all Uniques at bottom"
and defaults to **off** (uniques appear inline after each kingdom's block).
The new default should be uniques grouped at the bottom (above Highlights),
with the toggle renamed to "Uniques grouped with Kingdoms" to enable the old
inline behaviour.

---

## Desired behaviour

| Toggle | Output |
|---|---|
| Unchecked **(new default)** | All `** Uniques for X **` blocks appear together after all Per-Kingdom Summaries and before `** Highlights **` |
| Checked | Each `** Uniques for X **` block appears immediately after its kingdom's summary (old default) |

---

## Implementation — `js/ui.js`

### 1. Rename the setting and flip the default

In the `advSettings` initialisation block, rename `groupUniques` to
`uniquesWithKingdoms` and set its default to `false`:

```javascript
// Before
groupUniques: false,

// After
uniquesWithKingdoms: false,
```

### 2. Invert the logic in `applyKingdomNewsSettings`

There are two conditional branches that reference the old flag (~lines 1070
and 1075). Invert both so `uniquesWithKingdoms: true` means "show inline":

```javascript
// Per-Kingdom Summaries branch — emit uniques inline when flag is on
// Before
if (!s.groupUniques && pair.uniques) resultBlocks.push(pair.uniques);
// After
if (s.uniquesWithKingdoms && pair.uniques) resultBlocks.push(pair.uniques);

// Uniques section branch — emit grouped when flag is off
// Before
if (s.groupUniques) {
    for (const pair of perKingdomPairs) {
        if (pair.uniques) resultBlocks.push(pair.uniques);
    }
}
// When not grouping, uniques were already emitted inline above

// After
if (!s.uniquesWithKingdoms) {
    for (const pair of perKingdomPairs) {
        if (pair.uniques) resultBlocks.push(pair.uniques);
    }
}
// When uniquesWithKingdoms is true, uniques were already emitted inline above
```

### 3. Update the checkbox in `renderKingdomNewsSettings`

```javascript
// Before
groupingCheckbox.id = 'adv-kn-groupUniques';
groupingCheckbox.checked = advSettings.kingdomNews.groupUniques;
groupingCheckbox.addEventListener('change', () => {
    advSettings.kingdomNews.groupUniques = groupingCheckbox.checked;
    applyAndRerender(elements);
});
// ...
document.createTextNode(' Group all Uniques at bottom')

// After
groupingCheckbox.id = 'adv-kn-uniquesWithKingdoms';
groupingCheckbox.checked = advSettings.kingdomNews.uniquesWithKingdoms;
groupingCheckbox.addEventListener('change', () => {
    advSettings.kingdomNews.uniquesWithKingdoms = groupingCheckbox.checked;
    applyAndRerender(elements);
});
// ...
document.createTextNode(' Uniques grouped with Kingdoms')
```

---

## Tests

No test changes needed. The Kingdom News tests call `parseKingdomNewsLog`
from `parser.js` directly — they exercise `formatKingdomNewsOutput`, which
always produces uniques inline in the raw output. The grouping is a UI-layer
concern handled by `applyKingdomNewsSettings` in `ui.js` and is not covered
by the automated test suite.

Manually verify in the browser that:
1. After parsing Kingdom News with no settings changed, all Uniques blocks
   appear together between Per-Kingdom Summaries and Highlights.
2. Checking "Uniques grouped with Kingdoms" moves each Uniques block to
   immediately after its paired kingdom summary.
3. The Section Order list still shows "Uniques" as a moveable entry and
   responds correctly to reordering.
