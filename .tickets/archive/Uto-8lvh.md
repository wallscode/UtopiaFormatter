---
id: Uto-8lvh
status: closed
deps: []
links: []
created: 2026-03-03T00:58:14Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs: extend showFailedThievery toggle to Thievery Targets and Thievery by Op Type sections

When 'Show failed thievery attempts' is unchecked, currently only the summary line ('76 failed thievery attempts (1589 thieves lost)') is removed from Thievery Summary. The toggle should also affect two other sections:

1. Thievery Targets — for each province entry:
   - Remove the 4-space-indented 'Failed: N (N thieves lost)' line
   - Strip the '(N failed)' annotation from the province header line
     Before: 'Willaimia Sherman (4:11) — 47 ops (1 failed):'
     After:  'Willaimia Sherman (4:11) — 47 ops:'

2. Thievery by Op Type — remove the entire 'Failed' op-type block:
   - Remove the block header line: 'Failed — 76 ops:'
   - Remove all province sub-lines under it (4-space-indented lines following that header)

## Design

Changes are entirely in applyProvinceLogsSettings in ui.js. The parser output is unchanged.

**Thievery Targets — remove 'Failed: N' lines:**
In the showFailedThievery=false block, add a filter pass:
  output = output.split('\n')
    .filter(line => !/^    Failed: \d+/.test(line))
    .join('\n');

**Thievery Targets — strip '(N failed)' from header lines:**
The province header lines in Thievery Targets look like:
  '  Willaimia Sherman (4:11) — 47 ops (1 failed):'
Strip the parenthetical count using a regex replace on those lines:
  output = output.split('\n')
    .map(line => line.replace(/ \(\d+ failed\)(?=:$)/, ''))
    .join('\n');
The lookahead (?=:$) ensures only province header lines are matched (they end with colon).

**Thievery by Op Type — remove entire 'Failed' block:**
The block header is '  Failed — N ops:' (2-space indent). All province lines under it are '    Prov (K:N): ...' (4-space indent). Filter using stateful line-by-line scan:
  let skipBlock = false;
  output = output.split('\n').filter(line => {
    if (/^  Failed —/.test(line)) { skipBlock = true; return false; }
    if (skipBlock && /^    /.test(line)) { return false; }
    skipBlock = false;
    return true;
  }).join('\n');

All three passes should be applied together inside the existing showFailedThievery=false guard.

## Acceptance Criteria

- [ ] showFailedThievery=false removes 'Failed: N (N thieves lost)' lines from Thievery Targets
- [ ] showFailedThievery=false strips '(N failed)' from Thievery Targets province header lines
- [ ] showFailedThievery=false removes the entire 'Failed — N ops:' block from Thievery by Op Type
- [ ] showFailedThievery=true leaves all Failed lines/blocks intact (no change from current)
- [ ] Expected output file not changed (parser output unchanged)
- [ ] applyProvinceLogsSettings test updated to cover the new filter behaviors
- [ ] All tests pass

