---
id: Uto-4dwq
status: closed
deps: []
links: []
created: 2026-03-01T16:35:06Z
type: bug
priority: 1
assignee: Jamie Walls
---
# Province Logs: exclude intelligence ops from Thievery Targets, fix Unknown entries

## Problem

The Thievery Targets section shows large `Unknown: N` entries for many target provinces. These are spy/intelligence operations (Spy Confidence, Spy Thieves, etc.) that are incorrectly being recorded as thievery ops.

These ops match the `"Early indications show that our operation was a success"` guard at the top of the thievery success block in `formatProvinceLogs` (`js/parser.js`), but they don't match any entry in `PROVINCE_LOGS_CONFIG.OPERATIONS` and don't contain gold/bushels/runes, so `matchedOpName` stays `null`. The target regex still matches, however, so they get pushed to `thiefOps` with `type: null` — which the Thievery Targets builder renders as `Unknown`.

The Thievery Summary is already correct (it never increments `thieveryCounts` for these lines). Only `thiefOps` is being polluted.

Intelligence ops can be identified by the phrase `"confidence in the information retrieved"` in the log line.

## Fix

In the thievery success block in `formatProvinceLogs` (~line 587 of `js/parser.js`), add an early-exit guard at the top of the block:

```javascript
if (line.includes("Early indications show that our operation was a success")) {
    // Skip intelligence/spy ops — they are not thievery ops
    if (line.includes('confidence in the information retrieved')) continue;

    const thiefTargetM = line.match(/\(([^()]+\(\d+:\d+\)),\s*sent (\d+)\)/);
    // ... rest of block unchanged
}
```

No changes to the Thievery Summary logic, `thieveryCounts`, or `thieveryImpacts` are needed — those are already correct.

## Verification

After the fix, the `Unknown` entries should disappear from Thievery Targets (or be significantly reduced to only genuine unrecognised op types). Run `tests/province-logs.test.js` to confirm no regressions.

