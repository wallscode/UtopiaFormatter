---
id: Uto-7j78
status: closed
deps: []
links: []
created: 2026-03-04T02:34:50Z
type: task
priority: 2
assignee: Jamie Walls
---
# Strip non-date lines at start and end of input for all three parsers

When a user copies an entire page instead of just the log content, extra lines appear before and/or after the actual log data. The three parsers handle this inconsistently:

**Kingdom News (parseKingdomNewsLog)**: Already finds the first date line via findIndex() and slices from there (startIndex), handling leading garbage. However lines.slice(startIndex) keeps everything after, including trailing garbage lines that get passed to the main parse loop.

**Province Logs (formatProvinceLogs)**: Strips date prefixes using replace(/^.*?YR\d+\s*/, ''). Non-date lines (no YR\d+ in them) don't match the regex, so they pass through the replace unchanged and enter the event parser as raw garbage text. Both leading and trailing garbage lines cause issues.

**Province News (parseProvinceNews)**: Already robust. The parsing loop uses const dateLineRe = /^(\w+ \d+ of YR\d+)\t(.+)$/ and does 'if (\!match) continue' — non-date lines are silently skipped. No change needed.

## Design

All three parsers share the same date format: 'Month Day of YRX' (with a tab following in Province Logs and Province News, without a tab in Kingdom News since parseText() normalises whitespace to spaces before the parse loop).

**Kingdom News fix**: After finding startIndex (first date line), also find endIndex = index of last line matching dateRegex. Replace lines.slice(startIndex) with lines.slice(startIndex, endIndex + 1).

**Province Logs fix**: Before the date-prefix-stripping map/replace step, add a filter to keep only lines that contain the date pattern (i.e., /\bYR\d+\b/.test(line) or similar). Non-date lines are dropped before any processing. This cleanly removes both leading and trailing garbage.

**Province News**: No change needed.

The date pattern to use for each:
- Kingdom News: existing dateRegex = /^(January|...|December) \d{1,2} of YR\d+/
- Province Logs: /\bYR\d+\b/ (the replace regex already targets YR\d+ so this is consistent)

## Acceptance Criteria

1. Kingdom News parser produces correct output when non-date lines appear before OR after the log content. 2. Province Logs parser produces correct output when non-date lines appear before OR after the log content. 3. Province News parser behaviour unchanged (already handled). 4. Existing test output is unchanged for all parsers. 5. The existing 'some random text that can be ignored' at the top of tests/Kingdom News original.txt continues to be ignored.

