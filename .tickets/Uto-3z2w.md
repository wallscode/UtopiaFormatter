---
id: Uto-3z2w
status: closed
deps: []
links: []
created: 2026-03-01T00:53:43Z
type: task
priority: 2
assignee: Jamie Walls
---
# Kingdom News: allow Unique Window to be set to 0 (count every attack as unique)

The **Unique Window** field in Advanced Settings currently accepts values
1–30.  Setting it to **0** should mean "no window at all — every attack by a
given province counts as its own unique, even multiple attacks on the same
in-game date."

---

## Current behaviour

- `windowInput.min = '1'` prevents 0 from being entered.
- The `change` handler validates `val >= 1 && val <= 30` and silently
  ignores any other value.
- `calculateUniques(log, windowDays)` uses the algorithm
  `if (date > windowStart + windowDays)` — with `windowDays = 0` this
  reduces to `date > windowStart`, which still groups same-day attacks into
  a single unique (only the first attack on a new date opens a new window).

---

## Target behaviour

- The input accepts `0`–`30`.
- When `windowDays === 0`, every entry in the log is its own unique:
  `total = log.length`, and each attacker's unique count equals their raw
  attack count.
- The label `Days:` gains a hint so users understand what 0 means.

---

## Implementation

### 1. `calculateUniques` — `js/parser.js` (~line 423)

Add a short-circuit at the top of the function:

```javascript
// Before — no special handling for 0
function calculateUniques(log, windowDays) {
    const byAttacker = {};
    ...
}

// After
function calculateUniques(log, windowDays) {
    // windowDays === 0 → every attack is its own unique
    if (windowDays === 0) {
        const perAttacker = {};
        let total = 0;
        for (const { attackerKey } of log) {
            perAttacker[attackerKey] = (perAttacker[attackerKey] || 0) + 1;
            total++;
        }
        return { total, perAttacker };
    }

    const byAttacker = {};
    ...
}
```

### 2. `renderKingdomNewsSettings` — `js/ui.js` (~line 489)

```javascript
// Before
windowInput.min = '1';
windowInput.max = '30';
...
if (val >= 1 && val <= 30) {
    advSettings.kingdomNews.uniqueWindow = val;
    applyAndRerender(elements);
}

// After
windowInput.min = '0';
windowInput.max = '30';
...
if (val >= 0 && val <= 30) {
    advSettings.kingdomNews.uniqueWindow = val;
    applyAndRerender(elements);
}
```

Update the label to hint at the 0-value meaning:

```javascript
// Before
windowLabel.textContent = 'Days: ';

// After
windowLabel.textContent = 'Days (0 = every attack unique): ';
```

---

## Tests

No automated test changes are needed — the kingdom-news test uses the
default 6-day window and doesn't exercise `windowDays = 0`.

Manually verify in the browser:
1. Parse a Kingdom News log, then open Advanced Settings and set Days to 0.
2. Confirm the Uniques counts equal the raw attack counts (no windowing).
3. Confirm that multiple same-day attacks from the same province each count
   as a separate unique.
4. Set Days back to 6 and confirm the counts revert to the windowed values.

