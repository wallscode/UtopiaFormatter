---
id: Uto-y05b
status: closed
deps: []
links: []
created: 2026-03-01T17:20:36Z
type: bug
priority: 2
assignee: Jamie Walls
---
# Province Logs: Steal War Horses showing as Unknown in Thievery Targets

## Root Cause

Two Unknown entries remain in Thievery Targets (both for `mystic (4:8)`). Both are Steal War Horses ops:

```
Our thieves were able to steal 25 war horses. (mystic (4:8), sent 1653)
Our thieves were able to steal 25 war horses. (mystic (4:8), sent 1653)
```

The fallback detection block inside the thievery success block in `formatProvinceLogs` (`js/parser.js`, ~line 641) only checks for `gold coins`, `bushels`, and `runes`. War horses is not included, so `matchedOpName` stays `null` and the op is pushed to `thiefOps` as Unknown.

Note: a separate war horses parser at ~line 761 handles the `"release X horses... bring back Y"` format, which is a different log line. This ticket is specifically about the `"able to steal N war horses"` format appearing in the thievery success block.

## Fix

Add a `war horses` case to the fallback block:

```javascript
// Current
if (!matchedOpName) {
    if (line.includes('gold coins')) { ... }
    else if (line.includes('bushels')) { ... }
    else if (line.includes('runes') && !line.includes('begin casting')) { ... }
}

// Fix — add war horses
else if (line.includes('war horses')) {
    matchedOpName = 'Steal War Horses';
    const m = line.match(/([\d,]+)\s+war horses/i);
    if (m) { matchedImpact = parseInt(m[1].replace(/,/g, '')); matchedUnit = 'war horses'; }
}
```

## Verification

After the fix, the two Unknown entries for `mystic (4:8)` should disappear. Update `tests/provincelogs_expected_output.txt` and confirm `tests/province-logs.test.js` passes with zero Unknown entries in Thievery Targets.

