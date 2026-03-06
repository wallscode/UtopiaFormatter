---
id: Uto-7yw3
status: closed
deps: []
links: []
created: 2026-03-01T15:29:06Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs: Thievery Targets and Spell Targets sections

## Goal

Add two optional sections to Province Logs output — both off by default and
toggled via the existing section visibility controls in Advanced Settings:

- **Thievery Targets** — appears after *Thievery Summary*. Lists each target
  province with a breakdown of every op type performed against it and the
  outcomes (impact values, thieves lost, failures).
- **Spell Targets** — appears after *Spell Summary*. Lists each target
  province with a breakdown of every spell cast against it and the outcomes
  (impact values, failures). Self-targeted spells (no province in the log
  line) are omitted.

---

## Current limitation

`formatProvinceLogs` (`js/parser.js`) only stores **aggregated totals** — no
per-operation records exist. Target province names appear in the raw log
lines but are currently discarded:

```
// Thievery success
Early indications show that our operation was a success. Our thieves have
returned with 117,211 gold coins. (Bikini Bottom (3:6), sent 3900)
                                   ↑ target extracted from here

// Thievery failure
Sources have indicated the mission was foiled. We lost 27 thieves.
(Bikini Bottom (3:6), sent 3000)

// Spell (targeted)
Your wizards gather 8,289 runes and begin casting, and the spell succeeds.
Meteors will rain across the lands of ARRROT (4:8) for 9 days. (ARRROT (4:8))
                                                                 ↑ target

// Spell (self-cast — no target)
Your wizards gather 2,570 runes and begin casting, and the spell succeeds.
Our builders have been blessed with unnatural speed for 14 days!
```

---

## Target extraction regexes

```javascript
// Thievery — "(Province Name (k:k), sent N)" at end of line
const thiefTargetMatch = line.match(/\((.+?\(\d+:\d+\)),\s*sent \d+\)/);
const thiefTarget = thiefTargetMatch ? thiefTargetMatch[1] : null;

// Spell — "(Province Name (k:k))" at end of line
const spellTargetMatch = line.match(/\((.+?\(\d+:\d+\))\)\s*$/);
const spellTarget = spellTargetMatch ? spellTargetMatch[1] : null;
// spellTarget is null for self-cast spells → omit from Spell Targets
```

---

## Implementation

### 1. New per-operation arrays — `js/parser.js`, `formatProvinceLogs`

Add two arrays to the local data init block (alongside `thieveryCounts`,
`spellCounts`, etc.):

```javascript
const thiefOps = [];   // one entry per successful or failed thievery op
const spellOps = [];   // one entry per spell cast with a target province
```

**thiefOps entry shape:**
```javascript
{
    target:     'Bikini Bottom (3:6)',  // province reference string
    type:       'Vault Robbery',        // op type name, or null if unrecognised
    success:    true,                   // false for foiled ops
    impact:     117211,                 // numeric value or null
    impactUnit: 'gold coins',           // unit string or null
    thieves:    3900                    // sent (from "sent N" in line), or 0
}
```

**spellOps entry shape:**
```javascript
{
    target:     'ARRROT (4:8)',     // province reference string
    spell:      'Meteor Showers',  // spell name
    success:    true,              // false when "the spell fails"
    impact:     9,                 // numeric value or null
    impactUnit: 'days'             // unit string or null
}
```

### 2. Populate `thiefOps` — inside the existing thievery parsing blocks

**Successful ops** (inside `if (line.includes("Early indications ..."))`):

After the existing `thieveryCounts` / `thieveryImpacts` updates, append a
record to `thiefOps`:

```javascript
const thiefTargetM = line.match(/\((.+?\(\d+:\d+\)),\s*sent (\d+)\)/);
if (thiefTargetM) {
    // Determine type, impact, impactUnit from the same matching already done above
    thiefOps.push({
        target:     thiefTargetM[1],
        type:       matchedOpName,   // captured in existing loop
        success:    true,
        impact:     matchedImpact,   // numeric or null
        impactUnit: matchedUnit,     // string or null
        thieves:    parseInt(thiefTargetM[2])
    });
}
```

**Failed ops** (inside `if (line.includes("Sources have indicated the mission was foiled"))`):

```javascript
const thiefTargetM = line.match(/\((.+?\(\d+:\d+\)),\s*sent (\d+)\)/);
if (thiefTargetM) {
    const lostM = line.match(/We lost ([\d,]+) thieves?/i);
    thiefOps.push({
        target:     thiefTargetM[1],
        type:       null,
        success:    false,
        impact:     lostM ? parseInt(lostM[1].replace(/,/g, '')) : 0,
        impactUnit: 'thieves lost',
        thieves:    parseInt(thiefTargetM[2])
    });
}
```

### 3. Populate `spellOps` — inside the existing spell parsing block

After incrementing `spellCounts` / `spellImpacts`, append to `spellOps`:

```javascript
const spellTargetM = line.match(/\((.+?\(\d+:\d+\))\)\s*$/);
if (spellTargetM) {
    const success = line.includes('the spell succeeds');
    spellOps.push({
        target:     spellTargetM[1],
        spell:      spell.name,
        success,
        impact:     success && spell.impact ? matchedImpactValue : null,
        impactUnit: spell.impact || null
    });
}
```

For spell failures (`line.includes('but the spell fails')`), the same target
regex applies; push a record with `success: false, impact: null`.

### 4. New output section helpers — `js/parser.js`

Add two helper functions just before the return statement of
`formatProvinceLogs`:

#### `buildThieveryTargetsSection(thiefOps)`

```
Thievery Targets:
  Bikini Bottom (3:6) — 15 ops (3 failed):
    Vault Robbery: 4 (1,404,731 gold coins)
    Arson: 3 (17 acres)
    Spy Confidence: 5
    Failed: 3 (27 thieves lost)
  to hell and back (3:9) — 8 ops:
    Propaganda: 3
    Incite Riots: 2 (14 days)
    Assassinate Wizards: 3 (112 wizards)
```

Rules:
- Group by target, sorted descending by total op count.
- Within each target, list successful op types sorted descending by count,
  each with its aggregate impact if applicable.
- If any failures exist, list them last as `Failed: N (X thieves lost)`.
- Header: `TargetName — N ops` or `N ops (F failed)` when F > 0.

#### `buildSpellTargetsSection(spellOps)`

```
Spell Targets:
  ARRROT (4:8) — 6 casts (1 failed):
    Meteor Showers: 5 (47 days)
    Failed: 1
  Bikini Bottom (3:6) — 5 casts:
    Chastity: 3 (21 days)
    Amnesia: 2 (1,234 books)
```

Rules:
- Same grouping and sorting logic as thievery targets.
- Self-cast spells (no target extracted) are excluded entirely.
- Failures listed last per target as `Failed: N`.

### 5. Wire sections into output — `js/parser.js`

In the section-building part of `formatProvinceLogs`, add the two new
sections at the end of the existing section outputs (they will be inserted
into the correct position by the UI's `sectionOrder` reordering, so order
here does not matter):

```javascript
if (thiefOps.length > 0) {
    const thiefTargetLines = buildThieveryTargetsSection(thiefOps);
    if (thiefTargetLines.length) {
        output.push('\nThievery Targets:');
        output.push(...thiefTargetLines);
    }
}
if (spellOps.length > 0) {
    const spellTargetLines = buildSpellTargetsSection(spellOps);
    if (spellTargetLines.length) {
        output.push('\nSpell Targets:');
        output.push(...spellTargetLines);
    }
}
```

### 6. Register sections — `js/ui.js`

**`sectionOrder`** — insert the new sections immediately after their
summary counterparts:

```javascript
// Before
sectionOrder: ['Thievery Summary', 'Resources Stolen', 'Spell Summary', ...]

// After
sectionOrder: ['Thievery Summary', 'Thievery Targets', 'Resources Stolen',
               'Spell Summary', 'Spell Targets', ...]
```

**`visible`** — add both as off by default:

```javascript
'Thievery Targets': false,
'Spell Targets':    false,
```

No other UI changes are needed — the existing section toggle mechanism
renders checkboxes for every key in `visible` automatically.

---

## Tests

No changes to existing test files are needed since both sections default to
`false`. Verify `tests/province-logs.test.js` still passes unchanged after
the implementation.

Manual verification:
1. Parse a Province Log containing thievery and spell ops against named enemy
   provinces.
2. Enable *Thievery Targets* in Advanced Settings — confirm per-province
   groupings appear with correct counts and impact totals.
3. Enable *Spell Targets* — confirm per-province spell breakdowns appear;
   confirm self-targeted spells (e.g. Builders Boon, Inspire Army) are absent.
4. Disable both — confirm neither section appears in output.
