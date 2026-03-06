---
id: Uto-m4da
status: closed
deps: []
links: []
created: 2026-03-01T00:50:43Z
type: task
priority: 2
assignee: Jamie Walls
---
# Kingdom News: count incoming Learn attacks in Attacks Suffered

When an enemy province does a **Learn** attack against our kingdom, the attack
line in the log reads:

```
February 1 of YR1 15 - Max Tool Inc (2:6) attacked and looted 3,288 books from 18 - Sushi Sampo Time (5:1).
```

These attacks are not appearing in the **Total Attacks Suffered** breakdown
of the Kingdom News Report (no `-- Learn: N (N books)` line is output), and
they are not being included in the total `attacksSuffered` count.

---

## Expected behaviour

Learn attacks into our kingdom should be counted and displayed in the Attacks
Suffered section, following the same pattern as Raze and Plunder suffered:

```
Total Attacks Suffered: 12 (3200 acres)
-- Uniques: 5
-- Trad March: 8 (3200 acres)
-- Learn: 2 (6,576 books)
-- Plunder: 2
```

---

## Root cause

In `parseAttackLine` (`js/parser.js`), the `isAttack` detection regex at
~line 1045 already includes `"attacked and looted"`, so learn attack lines
reach `parseAttackLine`.  However, `learnPattern` at ~line 1127 is:

```javascript
const learnPattern = /invaded and looted|attacked and looted/;
```

The `"attacked and looted"` case — the format used when OUR kingdom is the
**defender** — is present in the pattern and should match.  Nevertheless,
player testing has confirmed the attacks do not appear in the output.

The most likely cause is that the `isActualAttack = false` flag set for
learns at ~line 1351 is being (incorrectly) used to skip the per-type
defender stat update.  Confirm by tracing the branch at ~line 1398 — the
`else` branch (non-bounce attacks) runs both the attacker-side update
(`if (attackerKingdom === ownKingdomId)`) and the defender-side update
(`if (defenderKingdom === ownKingdomId)`).  The defender update sets
`learnSuffered` and `learnSufferedAcres`.  If this code path is reached,
the output section at ~line 1734 should display the line:

```javascript
if ((ownKingdom.learnSuffered || 0) > 0)
    output.push(`-- Learn: ${ownKingdom.learnSuffered} (${formatNumber(ownKingdom.learnSufferedAcres || 0)} books)`);
```

---

## Investigation steps

1. Add a synthetic `"attacked and looted"` line to
   `tests/Kingdom News original.txt` and run the kingdom-news-log test to
   reproduce the missing count in a controlled environment.

2. If the line IS counted in the test (suggesting only real-data format
   variants fail), inspect actual game log lines for subtle differences
   (e.g. `"attacked & looted"`, multi-word numbers without commas, extra
   whitespace, or a format such as
   `"attacked 18 - Sushi Sampo Time and looted 3,288 books"`).

3. Update `learnPattern` and/or the `booksMatch` regex in `parseAttackLine`
   to cover any additional formats discovered.

---

## Implementation — `js/parser.js`

If the root cause is a pattern mismatch, update `learnPattern` (~line 1127)
to cover the confirmed formats:

```javascript
// Before (if a variant is missing)
const learnPattern = /invaded and looted|attacked and looted/;

// After (extend as needed based on investigation)
const learnPattern = /invaded and looted|attacked and looted/;
```

If the root cause is a logic error that skips the defender stat update, fix
the conditional flow in the stat-update block (~line 1414) so that
`learnSuffered` and `learnSufferedAcres` are always set when
`defenderKingdom === ownKingdomId` and `attackType === 'learn'`.

---

## Tests

1. Add at least one `"attacked and looted"` line to
   `tests/Kingdom News original.txt` (as an attack against our own kingdom
   5:1, attacker from 4:1).

2. Update `tests/Kingdom News Report target format.txt` to include the
   expected `-- Learn: N (N books)` line in the Attacks Suffered section.

3. Run `tests/kingdom-news-log.test.js` and verify the test passes.

