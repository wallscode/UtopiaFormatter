---
id: Uto-of2a
status: open
deps: []
links: []
created: 2026-03-04T21:45:48Z
type: task
priority: 2
assignee: Jamie Walls
---
# Combined Province Summary: merge Province Logs and Province News into one output

Add a new parsing mode that accepts both a Province Logs paste and a Province News paste and generates a single combined output. The combined output merges data that represents two sides of the same activity (aid sent vs. received, offensive vs. defensive thievery/spells) while passing through data that only appears in one source.

---

## UI changes

The current single-input layout must be extended to accommodate two inputs.

### Option A (recommended): two-textarea layout in a new tab or mode
Add a second input textarea labeled "Province News" alongside the existing one (which would be labeled "Province Logs"). Both can be left blank; if only one is filled the tool falls back to the existing single-parser output. If both are filled, the combined mode activates automatically.

### Option B: single textarea, double-paste
The user pastes both blocks into the same textarea. The parser auto-detects that both types are present (Province Logs lines have spell/construction/thievery markers; Province News lines are tab-delimited date lines). Simpler UI change but harder to detect reliably.

Prefer Option A. The detect badge should update to show "Province Logs + Province News" when both inputs contain valid data.

---

## Parser / architecture changes

Add a new entry-point function:
```js
formatCombinedProvinceSummary(logsText, newsText)
```

Internally this calls both individual parsers to get their raw data objects (not the formatted strings), then merges the two data objects into a new combined output. This requires refactoring `formatProvinceLogs` and the Province News parser to separate the data-accumulation step from the format-to-string step (similar to how Kingdom News already separates `parseKingdomNewsLog` → `formatKingdomNewsOutput`).

---

## Resource name mapping

The two parsers use different keys for the same resources:

| Province Logs key (aidTotals) | Province News key (aidByResource) |
|---|---|
| `gold coins` | `gold` |
| `explore pool acres` | `exploreAcres` |
| `soldiers` | `soldiers` |
| `runes` | `runes` |
| `bushels` | `bushels` |

The combined formatter must map between these when building the Aid section.

---

## Combined output sections (in order)

### Header
```
Combined Province Summary from UtopiaFormatter.com
Province Logs:  Month Day, YRN – Month Day, YRN (N days)
Province News:  Month Day, YRN – Month Day, YRN (N days)
```

### 1. Aid Summary (COMBINED — new)
Province Logs `aidTotals` = aid WE SENT outward.
Province News `aidByResource[r].total` = aid WE RECEIVED.

Display per resource (omit rows where both sent and received are 0):
```
Aid Summary:
  Gold:              Sent: 120,000  |  Received: 45,000  |  Net: 75,000 sent
  Runes:             Sent: 0        |  Received: 8,000   |  Net: 8,000 received
  Bushels:           Sent: 50,000   |  Received: 50,000  |  Net: even
  Soldiers:          Sent: 500      |  Received: 0       |  Net: 500 sent
  Explore Pool:      Sent: 0        |  Received: 200 acres (12 lost in transit)
```
Net = Sent − Received (positive = net outflow). "even" when equal.
Explore pool includes Province News `aidByResource.exploreAcres.lost` if nonzero.

### 2. Offensive Thievery (Province Logs — pass-through)
Same content as the existing Province Logs Thievery Summary, Thievery Targets, and Resources Stolen from Opponents sections.

### 3. Defensive Thievery (Province News — pass-through)
Same content as the existing Province News Thievery Impacts and Shadowlight Thief IDs sections.

### 4. Offensive Spells (Province Logs — pass-through)
Same content as the existing Province Logs Spell Summary and Spell Targets sections.

### 5. Defensive Spells (Province News — pass-through)
Same content as the existing Province News Spell Impacts section.

### 6. Military Activity
- Attacks Suffered (Province News `attacks[]`) — pass-through
- Military Training (Province Logs `trainingCounts`, `releaseCounts`, `draftRate`, `militaryWagesPercent`) — pass-through

### 7. Land & Construction (Province Logs — pass-through)
Exploration, Construction, Razed Buildings sections.

### 8. Science (Province Logs — pass-through)
Science Summary section.

### 9. Dragons & Rituals (Province Logs — pass-through)
Dragon Summary and Ritual Summary sections.

### 10. War Outcomes (Province News — pass-through)
War Outcomes section if present.

### 11. Starvation (Province News — pass-through)
Starvation section if present.

### 12. Daily Login Bonus / Scientists (Province News — pass-through)
Daily Login Bonus and Scientists Gained sections.

---

## Propaganda / desertion cross-reference (stretch goal)
Province Logs tracks Propaganda operations by troop type deserted (`propagandaCounts`).
Province News tracks the resulting desertions (`desertions.byType`).
If both are present, these can be shown side-by-side under Offensive Thievery: "N Propaganda ops — X thieves/soldiers/wizards deserted." This is a stretch goal; initial implementation can show them in their respective sections without cross-linking.

---

## Advanced Settings

Combined mode gets its own `advSettings.combinedProvince` object that is the superset of `provinceLogs` and `provinceNews` settings, with all existing defaults preserved exactly. The `"Aid Summary"` section replaces both `"Aid Summary"` (Province Logs) and `"Aid Received"` (Province News) — those two entries do not appear separately in combined mode.

### Section order and visibility defaults

```js
advSettings.combinedProvince = {
    sectionOrder: [
        // Combined section (replaces "Aid Summary" from Logs and "Aid Received" from News)
        'Aid Summary',
        // Province Logs — offensive thievery
        'Thievery Summary',
        'Thievery Targets by Province',
        'Thievery Targets by Op Type',
        'Resources Stolen from Opponents',
        // Province News — defensive thievery
        'Thievery Impacts',
        'Shadowlight Thief IDs',
        // Province Logs — offensive spells
        'Spell Summary',
        'Spell Targets by Province',
        'Spell Targets by Spell Type',
        // Province News — defensive spells
        'Spell Impacts',
        // Military (both sources)
        'Attacks Suffered',
        'Military Training',
        // Province Logs — land and economy
        'Exploration Summary',
        'Construction Summary',
        'Science Summary',
        // Province Logs — kingdom activity
        'Dragon Summary',
        'Ritual Summary',
        // Province News — other
        'War Outcomes',
        'Daily Login Bonus',
        'Scientists Gained',
    ],
    visible: {
        // Combined
        'Aid Summary':                   true,   // default on (both sources were on)
        // Offensive thievery (Province Logs defaults)
        'Thievery Summary':              true,
        'Thievery Targets by Province':  false,
        'Thievery Targets by Op Type':   false,
        'Resources Stolen from Opponents': true,
        // Defensive thievery (Province News defaults)
        'Thievery Impacts':              true,
        'Shadowlight Thief IDs':         false,
        // Offensive spells (Province Logs defaults)
        'Spell Summary':                 true,
        'Spell Targets by Province':     false,
        'Spell Targets by Spell Type':   false,
        // Defensive spells (Province News defaults)
        'Spell Impacts':                 true,
        // Military (Province News / Province Logs defaults)
        'Attacks Suffered':              true,
        'Military Training':             false,
        // Land and economy (Province Logs defaults)
        'Exploration Summary':           false,
        'Construction Summary':          false,
        'Science Summary':               false,
        // Kingdom activity (Province Logs defaults)
        'Dragon Summary':                true,
        'Ritual Summary':                false,
        // Other Province News (Province News defaults)
        'War Outcomes':                  false,
        'Daily Login Bonus':             true,
        'Scientists Gained':             false,
    },

    // --- Display toggles: Province Logs originals (defaults preserved) ---
    showAverages:               false,
    showFailedThievery:         true,
    showFailedSpellAttempts:    false,
    showSuccessThieveryLosses:  false,
    showRazedBuildings:         false,
    showTroopsReleased:         false,
    showDraftPercentage:        false,
    showDraftRate:              false,
    showMilitaryWages:          false,
    exploreDetails:             false,

    // --- Display toggles: Province News originals (defaults preserved) ---
    showSourceIdentifiers:      false,

    discordCopy: false
};
```

### Section groups (for the reorder UI)

```js
sectionGroups: [
    { label: 'Aid Summary',              children: ['Aid Summary'] },
    { label: 'Offensive Thievery',       children: ['Thievery Summary', 'Thievery Targets by Province', 'Thievery Targets by Op Type', 'Resources Stolen from Opponents'] },
    { label: 'Defensive Thievery',       children: ['Thievery Impacts', 'Shadowlight Thief IDs'] },
    { label: 'Offensive Spells',         children: ['Spell Summary', 'Spell Targets by Province', 'Spell Targets by Spell Type'] },
    { label: 'Defensive Spells',         children: ['Spell Impacts'] },
    { label: 'Military',                 children: ['Attacks Suffered', 'Military Training'] },
    { label: 'Exploration Summary',      children: ['Exploration Summary'] },
    { label: 'Construction Summary',     children: ['Construction Summary'] },
    { label: 'Science Summary',          children: ['Science Summary'] },
    { label: 'Dragon Summary',           children: ['Dragon Summary'] },
    { label: 'Ritual Summary',           children: ['Ritual Summary'] },
    { label: 'War Outcomes',             children: ['War Outcomes'] },
    { label: 'Daily Login Bonus',        children: ['Daily Login Bonus'] },
    { label: 'Scientists Gained',        children: ['Scientists Gained'] },
]
```

### Display Options panel

The Display Options panel in combined mode shows all toggles from both Province Logs and Province News:

**From Province Logs:**
- Show averages in Thievery (default: off)
- Show failed thievery operations (default: on)
- Show failed spell attempts (default: off)
- Show thieves lost on successful ops (default: off)
- Show razed buildings (default: off)
- Show explore details (default: off)
- Show troops released (default: off)
- Show draft percentage (default: off)
- Show draft rate (default: off)
- Show military wages (default: off)

**From Province News:**
- Show source identifiers in Thievery/Spell Impacts (default: off)

**Shared:**
- Copy for Discord (default: off)

---

## Tests
Add a new test file `tests/combined-province.test.js` that:
1. Calls `formatCombinedProvinceSummary` with both the existing `provincelogs.txt` and `ProvinceNewsExample.txt` test data
2. Verifies the Aid Summary net calculations are correct for at least 3 resources
3. Verifies the combined output contains sections from both parsers
4. Verifies that calling with only one input falls back to the single-parser output

## Acceptance Criteria

1. Pasting Province Logs + Province News together produces a Combined Province Summary. 2. Aid section shows Sent, Received, and Net for each resource. 3. All existing Province Logs and Province News sections appear in the combined output under their respective headings. 4. Existing single-parser behaviour is unchanged when only one input is provided. 5. Combined Province Summary test file passes. 6. All existing test suites still pass.

