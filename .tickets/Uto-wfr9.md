---
id: Uto-wfr9
status: open
deps: []
links: []
created: 2026-03-01T12:21:19Z
type: task
priority: 2
assignee: Jamie Walls
---
# Kingdom News: fix failed summoning counted as Ritual Started; add Rituals Failed tracking

## Bug

`"Sadly, we have failed summoning the ritual to cover our lands!"` is
currently handled in `parseSpecialLine` (`js/parser.js`, ~line 1561) by:

```javascript
data.kingdoms[own].ritualsCompleted++;
data.kingdoms[own].ritualsStarted.push(null);
```

Both increments are wrong for a failed summoning:

- **`ritualsStarted.push(null)`** — the failed summoning does not begin a
  new development cycle; that would only happen if a subsequent
  `"We have started developing a ritual!"` line appears. This null entry
  inflates the Rituals Started count and adds no meaningful type information.
- **`ritualsCompleted++`** — the ritual was not completed; it failed. The
  development phase finished, but the summoning itself did not succeed.
  Counting this as a completion is misleading.

With the test data, the bug produces `-- Rituals Started: 2 (Barrier)` when
there is only one actual ritual start (the Barrier), and `-- Rituals
Completed: 1` when no ritual actually completed.

---

## Target behaviour

| Log line | ritualsStarted | ritualsCompleted | ritualsFailed |
|---|---|---|---|
| `"We have started developing a ritual! (Barrier)!"` | push "Barrier" | — | — |
| `"Sadly, we have failed summoning the ritual..."` | — | — | + 1 |
| `"Our ritual [name] has been completed!"` | — | + 1 | — |

`-- Rituals Failed: N` is **hidden by default** with an Advanced Settings
toggle to enable it.

---

## Implementation

### 1. Fix the failed-summoning handler — `js/parser.js` (~line 1561)

```javascript
// Before
if (line.includes('failed summoning the ritual')) {
    if (own && data.kingdoms[own]) {
        data.kingdoms[own].ritualsCompleted++;
        data.kingdoms[own].ritualsStarted.push(null);
    }
    return true;
}

// After
if (line.includes('failed summoning the ritual')) {
    if (own && data.kingdoms[own]) {
        data.kingdoms[own].ritualsFailed = (data.kingdoms[own].ritualsFailed || 0) + 1;
    }
    return true;
}
```

### 2. Add `ritualsFailed: 0` to all kingdom init blocks — `js/parser.js`

There are 6 places where kingdoms are initialised (2 in `parseAttackLine`,
4 inline inits in `parseSpecialLine`). Add `ritualsFailed: 0` alongside
`ritualsCompleted: 0` in each block.

### 3. Output `-- Rituals Failed` — `js/parser.js`, `formatKingdomNewsOutput` (~line 1751)

Add the output line immediately after `-- Rituals Completed`:

```javascript
if ((ownKingdom.ritualsFailed || 0) > 0)
    output.push(`-- Rituals Failed: ${ownKingdom.ritualsFailed}`);
```

### 4. Add `showRitualsFailed` setting — `js/ui.js`

In `advSettings.kingdomNews`:

```javascript
// Before
showRituals: true,

// After
showRituals: true,
showRitualsFailed: false,
```

### 5. Add the toggle to the settings panel — `js/ui.js`, `renderKingdomNewsSettings`

Add an entry to the existing checkboxes list alongside the other Rituals
toggles (~line 445):

```javascript
{ key: 'showRitualsFailed', label: 'Rituals failed (summoning)' },
```

### 6. Add the filter — `js/ui.js`, `applyKingdomNewsSettings` (~line 1004)

```javascript
// Before
if (!s.showRituals && /^-- Rituals (Started|Completed):/.test(line)) return false;

// After
if (!s.showRituals        && /^-- Rituals (Started|Completed):/.test(line)) return false;
if (!s.showRitualsFailed  && /^-- Rituals Failed:/.test(line))              return false;
```

---

## Tests

Update `tests/Kingdom News Report target format.txt`:

```
// Before
-- Rituals Started: 2 (Barrier)
-- Rituals Completed: 1

// After
-- Rituals Started: 1 (Barrier)
```

(`-- Rituals Completed` disappears because the only thing that was
incrementing it was the failed-summoning handler, which is now fixed.
`-- Rituals Failed: 1` does not appear in the default output because
`showRitualsFailed` defaults to `false`.)

Run `tests/kingdom-news-log.test.js` and verify it passes.

