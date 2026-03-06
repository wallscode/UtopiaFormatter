---
id: Uto-zm7f
status: closed
deps: []
links: []
created: 2026-02-28T20:03:19Z
type: task
priority: 2
assignee: Jamie Walls
---
# Province Logs: remove redundant "stolen" from Resources Stolen lines; fix "each" in averages

Two small cleanups to the Province Logs output and Advanced Settings.

---

## Change 1 — Remove "stolen" from resource lines in Resources Stolen section

The section heading is already `Resources Stolen:`, so the word `stolen` on every detail line is redundant.

### Current output
```
Resources Stolen:
12,345 gold coins stolen (3 ops Avg: 4k)
890 bushels stolen
1,200 runes stolen
50 war horses stolen
```

### Target output
```
Resources Stolen:
12,345 gold coins (3 ops Avg: 4k)
890 bushels
1,200 runes
50 war horses
```

### Implementation — `js/parser.js`, `formatProvinceLogs` (~lines 851–854)

Remove ` stolen` from each of the four resource output lines:

```javascript
// Before
if (goldCoinsStolen > 0) output += `${formatNumber(goldCoinsStolen)} gold coins stolen${robberyDetail(...)}\n`;
if (bushelsStolen > 0)   output += `${formatNumber(bushelsStolen)} bushels stolen${robberyDetail(...)}\n`;
if (runesStolen > 0)     output += `${formatNumber(runesStolen)} runes stolen${robberyDetail(...)}\n`;
if (warHorsesStolen > 0) output += `${formatNumber(warHorsesStolen)} war horses stolen\n`;

// After
if (goldCoinsStolen > 0) output += `${formatNumber(goldCoinsStolen)} gold coins${robberyDetail(...)}\n`;
if (bushelsStolen > 0)   output += `${formatNumber(bushelsStolen)} bushels${robberyDetail(...)}\n`;
if (runesStolen > 0)     output += `${formatNumber(runesStolen)} runes${robberyDetail(...)}\n`;
if (warHorsesStolen > 0) output += `${formatNumber(warHorsesStolen)} war horses\n`;
```

Note: the `Steal War Horses` line at line 834 uses the word `stolen` inside a parenthetical
(`${formatNumber(stealHorsesBroughtBack)} stolen`) — this is describing a different thing
(horses brought back vs released) and should be left unchanged.

The `showRobberyOpCounts` strip regex in `applyProvinceLogsSettings` (`/ \(\d+ ops Avg: \S+\)$/`)
operates on the suffix only and is unaffected by this change.

---

## Change 2 — Remove "each" from the Show Averages display

When the "Show averages" checkbox is enabled in Advanced Settings, lines of the form
`N SpellName for a total of X unit` get a suffix appended. Currently it reads
`(avg N each)` — the word "each" is redundant given the context.

### Current output (showAverages on)
```
4 Pitfalls for a total of 14 days (avg 4 each)
2 Greed for a total of 8 days (avg 4 each)
5 Arson for a total of 2 acres (avg 0 each)
```

### Target output
```
4 Pitfalls for a total of 14 days (avg 4)
2 Greed for a total of 8 days (avg 4)
5 Arson for a total of 2 acres (avg 0)
```

### Implementation — `js/ui.js`, `applyProvinceLogsSettings` (line ~1125)

```javascript
// Before
return `${line} (avg ${avgStr} each)`;

// After
return `${line} (avg ${avgStr})`;
```

---

## Tests

Update `tests/province-logs.test.js` if any assertions check for `gold coins stolen`,
`bushels stolen`, `runes stolen`, or `war horses stolen` (they should drop `stolen`),
or check for `each)` in the averages suffix.
