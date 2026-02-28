---
id: Uto-tvye
status: open
deps: []
links: []
created: 2026-02-28T23:28:12Z
type: task
priority: 2
assignee: Jamie Walls
---
# Kingdom News: update War Only header text to show both kingdom IDs

When the War Only toggle is active the output currently reads:

```
[War Only] Showing attacks vs. The Kingdom of Foo (4:1) — Feb 1, YR1 to Mar 15, YR1
```

Replace this with a cleaner line that names both kingdoms by coordinate,
with our own kingdom listed first, followed by the date range:

```
Showing only attacks between Kingdoms (5:1) and (4:1) — February 1, YR1 to March 15, YR1
```

---

## Current behaviour

In `formatKingdomNewsOutput` (`js/parser.js`, ~line 1665), the War Only
header block loops over `data.warPeriods` and for each period emits:

```javascript
output.push(`[War Only] Showing attacks vs. ${vsStr} \u2014 ${startStr} to ${endStr}`);
if (!period.opponentId) {
    output.push('[War Only] Warning: war opponent could not be identified \u2014 no filtering applied');
}
```

where `vsStr` is the opponent name + id (or `"(unknown)"`), and the dates
come from `period.startDate` / `period.endDate` with `fmtDate()`.

`data.ownKingdomId` (e.g. `"5:1"`) is already available in
`formatKingdomNewsOutput` at this point.

---

## Target behaviour

For each war period emit a single header line in the form:

```
Showing only attacks between Kingdoms (5:1) and (4:1) — February 1, YR1 to March 15, YR1
```

- **Own kingdom** always listed first: `(${data.ownKingdomId})`, or
  `(unknown)` if `data.ownKingdomId` is null.
- **Opponent** listed second: `(${period.opponentId})`, or `(unknown)` if
  the opponent could not be identified.
- **Date range** uses the war period dates via `fmtDate()`, with fallbacks
  `"start of log"` and `"end of log"` when `period.startDate` or
  `period.endDate` is null.
- The `[War Only]` tag prefix is dropped from both the header and the
  warning line; the warning text becomes simply:
  `Warning: war opponent could not be identified — no filtering applied`

---

## Implementation — `js/parser.js`, `formatKingdomNewsOutput` (~line 1664)

```javascript
// Before
if (data.warOnly && data.warPeriods && data.warPeriods.length > 0) {
    for (const period of data.warPeriods) {
        let vsStr;
        if (!period.opponentId) {
            vsStr = '(unknown)';
        } else if (period.opponentName) {
            vsStr = `${period.opponentName} (${period.opponentId})`;
        } else {
            vsStr = `(${period.opponentId})`;
        }
        const startStr = period.startDate ? fmtDate(period.startDate) : 'start of log';
        const endStr   = period.endDate   ? fmtDate(period.endDate)   : 'present';
        output.push(`[War Only] Showing attacks vs. ${vsStr} \u2014 ${startStr} to ${endStr}`);
        if (!period.opponentId) {
            output.push('[War Only] Warning: war opponent could not be identified \u2014 no filtering applied');
        }
    }
}

// After
if (data.warOnly && data.warPeriods && data.warPeriods.length > 0) {
    for (const period of data.warPeriods) {
        const ownStr  = data.ownKingdomId ? `(${data.ownKingdomId})` : '(unknown)';
        const oppStr  = period.opponentId  ? `(${period.opponentId})` : '(unknown)';
        const startStr = period.startDate ? fmtDate(period.startDate) : 'start of log';
        const endStr   = period.endDate   ? fmtDate(period.endDate)   : 'end of log';
        output.push(`Showing only attacks between Kingdoms ${ownStr} and ${oppStr} \u2014 ${startStr} to ${endStr}`);
        if (!period.opponentId) {
            output.push(`Warning: war opponent could not be identified \u2014 no filtering applied`);
        }
    }
}
```

---

## Tests

The kingdom-news-log test suite (`tests/kingdom-news-log.test.js`) does not
exercise War Only mode — it uses the full unfiltered log. No test changes
are needed.

Manually verify in the browser:
1. Parse a Kingdom News log that contains a war declaration and enable the
   War Only toggle — confirm the header reads
   `Showing only attacks between Kingdoms (X:X) and (Y:Y) — …`.
2. Own kingdom appears first.
3. When the war opponent cannot be identified, the warning line appears
   without the `[War Only]` prefix.
4. Multiple war periods each produce their own header line.
