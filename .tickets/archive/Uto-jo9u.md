---
id: Uto-jo9u
status: closed
deps: []
links: []
created: 2026-03-01T00:42:38Z
type: task
priority: 2
assignee: Jamie Walls
---
# Kingdom News: track ritual types in Rituals Started (parallel to Dragons Started)

Currently the Kingdom News Report tracks the number of rituals started as a
plain integer and outputs only the count:

```
-- Rituals Started: 2
```

Dragons Started already records the type of each dragon started and appends
them in parentheses:

```
-- Dragons Started: 2 (Fire, Plague)
```

Apply the same pattern to Rituals Started so the output becomes:

```
-- Rituals Started: 2 (Barrier)
```

(The second start in the test data is a failed summoning with no named ritual,
so it does not appear in the type list.)

---

## Current behaviour

In `parseSpecialLine` (`js/parser.js`):

- `data.kingdoms[ownKingdom].ritualsStarted` is initialised to `0` (integer).
- On a successful ritual start line (`"We have started developing a ritual! (Barrier)!"`),
  the handler does `data.kingdoms[ownKingdom].ritualsStarted++`.
- On a failed summoning line (`"Sadly, we have failed summoning the ritual to cover our lands!"`),
  it also does `ritualsStarted++`.

In `formatKingdomNewsOutput` (~line 1721):

```javascript
if (ownKingdom.ritualsStarted > 0)
    output.push(`-- Rituals Started: ${ownKingdom.ritualsStarted}`);
```

---

## Target behaviour

```
-- Rituals Started: 2 (Barrier)
```

- `ritualsStarted` becomes an array of strings (ritual names) or `null` for
  failed summonings with no identified type.
- The type list uses the same `dragonTypeSuffix` helper already defined in
  `formatKingdomNewsOutput`.
- Failed summonings (null entries) are filtered out by `dragonTypeSuffix`,
  so they increment the count but do not appear in the type list.

---

## Implementation — `js/parser.js`

### 1. Change `ritualsStarted` initialisations from `0` to `[]`

There are 5 places where `ritualsStarted: 0` appears — 2 in kingdom
initialisation blocks and 3 in enemy inline-init blocks inside
`parseSpecialLine`. Change all to `ritualsStarted: []`.

### 2. Push type (or null) instead of incrementing

In `parseSpecialLine`, locate the two handlers:

```javascript
// Ritual start (successful)
// Before
data.kingdoms[ownKingdom].ritualsStarted++;

// After
const rm = line.match(/\(([^)]+)\)/);
data.kingdoms[ownKingdom].ritualsStarted.push(rm ? rm[1] : null);
```

```javascript
// Failed summoning
// Before
data.kingdoms[ownKingdom].ritualsStarted++;

// After
data.kingdoms[ownKingdom].ritualsStarted.push(null);
```

### 3. Update output in `formatKingdomNewsOutput`

```javascript
// Before
if (ownKingdom.ritualsStarted > 0)
    output.push(`-- Rituals Started: ${ownKingdom.ritualsStarted}`);

// After
if (ownKingdom.ritualsStarted.length > 0)
    output.push(`-- Rituals Started: ${ownKingdom.ritualsStarted.length}${dragonTypeSuffix(ownKingdom.ritualsStarted)}`);
```

---

## Tests

Update `tests/Kingdom News Report target format.txt`: change

```
-- Rituals Started: 2
```

to

```
-- Rituals Started: 2 (Barrier)
```

Run `tests/kingdom-news-log.test.js` and verify it passes.

