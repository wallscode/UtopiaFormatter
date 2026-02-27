---
id: Uto-c3to
status: open
deps: []
links: []
created: 2026-02-27T18:47:39Z
type: bug
priority: 1
tags: [parser, detection]
---
# Bug: province logs misdetected as province news by detectInputType

Pasting province logs results in the province news parser being invoked instead of the province logs parser, producing no meaningful output.

## Root Cause

`detectInputType` in `parser.js` (around line 2082) checks for province news **first**, before province logs patterns are tested:

```javascript
// Province News: "Month Day of YR##<tab>" format — check first (most specific)
if (/\bof YR\d+\t/.test(text)) return 'province-news';
```

Province logs exported from the game also contain dates in the format `"Month Day of YR<N><tab>..."` (date and event on the same line, tab-separated). The province-news sentinel therefore fires on province logs input, short-circuiting before the province-logs-specific patterns (`begin casting`, `Early indications show that our operation`, `you have ordered`, etc.) are ever evaluated.

## Detection Order (current, broken)

1. `province-news` — checked first via `/\bof YR\d+\t/`
2. `kingdom-news-log` — checked via attack patterns
3. `province-logs` — checked via operation/spell patterns
4. `null` — unknown

Because province logs also match step 1, they are never correctly identified.

## Fix

Check province-logs-specific patterns **before** the tab-date province-news heuristic. Province logs have unambiguous markers (`begin casting`, `Early indications show that our operation was a success`, `our thieves have returned with`, etc.) that cannot appear in province news. If any of those match, return `province-logs` immediately without running the province-news check.

Revised detection order:

1. `province-logs` — checked first via existing operation/spell patterns
2. `kingdom-news-log` — checked via attack patterns
3. `province-news` — checked last via tab-date heuristic (only reached if no other type matched)
4. `null` — unknown

This is safe because:
- Province logs patterns are specific enough that kingdom news or province news input would never match them
- Province news has no patterns as distinctive as `begin casting` or `Early indications show...`, so it correctly falls through to the tab-date heuristic only when the other two fail
- The existing kingdom-over-province priority rule is unaffected

## Affected Code

`js/parser.js` — `detectInputType` function (~line 2082). Reorder the three checks; no pattern changes required.

## Reproduction Steps

1. Copy province logs text from the game (text containing `begin casting` or thievery operation lines)
2. Paste into the parser input
3. Observe: auto-detected badge shows "Province News" and output is empty or near-empty
4. Expected: auto-detected badge shows "Province Logs" and summary is produced correctly

## Acceptance Criteria

- [ ] Province logs input (containing `begin casting`, `Early indications show...`, etc.) is detected as `province-logs`
- [ ] Province news input (tab-separated date+event lines without spell/op markers) is detected as `province-news`
- [ ] Kingdom news input is unaffected
- [ ] All existing tests pass
- [ ] Manual test: paste `tests/provincelogs.txt` content — badge reads "Province Logs"
