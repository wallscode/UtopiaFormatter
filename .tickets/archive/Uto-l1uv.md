---
id: Uto-l1uv
status: closed
deps: []
links: []
created: 2026-03-05T01:54:56Z
type: task
priority: 2
assignee: Jamie Walls
---
# Date range: track min/max dates across all parsers to handle out-of-order input

All three parsers assume input lines arrive in chronological order and track dates by recording the first/last line seen. When a user pastes lines in reverse order or mixed order the span calculation can produce a negative number of days.

## Current behaviour per parser

**Kingdom News** (parseKingdomNewsLog):
- `data.startDate` = first date line encountered (line ~1463)
- `data.endDate` = last attack date seen (lastAttackDate, line ~1541)
- Span: `dateToNumber(endDate) - dateToNumber(startDate) + 1` (line ~2177)
- If input is newest-first, startDate > endDate → negative days.

**Province News** (accumulateProvinceNewsData):
- `data.firstDate` = first tab-delimited date line encountered (line ~3096)
- `data.lastDate` = last tab-delimited date line encountered (line ~3097)
- Span: `dateToNumber(lastDate) - dateToNumber(firstDate) + 1` (line ~2836)
- Same issue.

**Province Logs** (accumulateProvinceLogsData):
- No date range tracking exists. The output header is a fixed string with no date info.
- Should track date range and include it in the output header (alongside the existing 'Summary of Province Log Events from UtopiaFormatter.com' line).

**Combined Province Summary** (formatCombinedProvinceSummary):
- Shows Province News date range from newsData.firstDate/lastDate (same bug).
- Province Logs date range not shown at all (fix Province Logs first, then surface it here as a 'Province Logs: ...' line in the combined header).

## Fix

In each parser that tracks dates, replace first/last tracking with min/max tracking using dateToNumber() as the comparison key:

```js
// Replace:
if (!data.firstDate) data.firstDate = dateStr;
data.lastDate = dateStr;

// With:
const dateVal = dateToNumber(dateStr);
if (data.minDateVal === null || dateVal < data.minDateVal) { data.minDateVal = dateVal; data.minDateStr = dateStr; }
if (data.maxDateVal === null || dateVal > data.maxDateVal) { data.maxDateVal = dateVal; data.maxDateStr = dateStr; }
```

Span is then always `maxDateVal - minDateVal + 1`, which is always >= 1.

Apply the same pattern to Kingdom News (replacing startDate/endDate tracking) and to the new Province Logs date range.

## Province Logs header change

Province Logs currently outputs:
  Summary of Province Log Events from UtopiaFormatter.com

After fix it should output:
  Summary of Province Log Events from UtopiaFormatter.com
  Month Day, YRN - Month Day, YRN (N days)

(when date range is available)

## Combined Province Summary header

After fix:
  Combined Province Summary from UtopiaFormatter.com
  Province Logs:  Month Day, YRN - Month Day, YRN (N days)
  Province News:  Month Day, YRN - Month Day, YRN (N days)

## Acceptance Criteria

1. Pasting logs in reverse chronological order produces a correct positive day count. 2. Province Logs output includes a date range line below the title. 3. Combined Province Summary shows both Province Logs and Province News date ranges in the header. 4. All existing test suites pass.

