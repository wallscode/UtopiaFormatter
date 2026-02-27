---
id: Uto-4f5g
status: open
deps: []
links: []
created: 2026-02-27T21:58:00Z
type: analysis
priority: 2
tags: [parser, analysis, comparison, features, research]
---
# Analysis: Compare parsing features with emphieltes.github.io Utopia Parser v1.4.3

Analysis of the external Utopia Parser v1.4.3 to identify features and parsing logic differences that may be missing from our current implementation.

## Source Analyzed
- **URL**: https://emphieltes.github.io/utopia.github.io/Parser%20v1.4.3.html
- **Version**: v1.4.3 (labeled as "Utopia T/M War Parser v2.0 - FINAL & PERFECT")
- **Focus**: Province news parsing with offensive/defensive modes

## Key Features Identified

### 1. **Comprehensive Spell Tracking**
**Spells Tracked (both offensive and defensive):**
- Abolish Ritual (with % destruction tracking)
- Amnesia (books destroyed)
- Blizzard (duration tracking)
- Chastity (duration tracking)
- Droughts (duration tracking)
- Explosions (duration tracking, affects aid shipments)
- Expose Thieves (duration tracking)
- Fireball (peasant casualties)
- Fool's Gold (gold conversion)
- Gluttony (duration tracking)
- Greed (duration tracking)
- Lightning Strike (runes destroyed)
- Land Lust (acres captured)
- Magic Ward
- Meteor Showers (defensive: casualties, offensive: duration)
- Mystic Vortex (active spells removed)
- Nightmares (people forced into rehab)
- Nightfall (duration tracking)
- Pitfalls (duration tracking)
- Storms (duration tracking)
- Tornadoes (building acres destroyed)
- Vermin (food destroyed)

**Current Project**: Similar spell list but may lack some defensive tracking details

### 2. **Advanced Thievery Operations**
**Operations Tracked:**
- Kidnapping (peasants kidnapped, average)
- Night Strike (troops killed, average)
- Arson (acres burned, average)
- Bribe Generals
- Sabotage Wizards (total days, average)
- Riots (total days, average)
- Propaganda (detailed troop type conversion)
- Vault Robbery (gold stolen)
- Granary Robbery (food stolen)
- Tower Robbery (runes stolen)

**Current Project**: Basic thievery tracking, may lack detailed averages and troop breakdowns

### 3. **Detailed Per-Target Tracking**
- **Map-based tracking**: `perTarget[operation].set(target, {count: 0, total: 0})`
- **Target extraction**: Sophisticated regex to identify target provinces
- **Success rates**: Tracks attempts vs success percentages
- **Averages**: Calculates average impact per operation

**Current Project**: Basic counting, may lack per-target detailed tracking

### 4. **Aid Summary with Net Calculations**
- **In/Out tracking**: Separate tracking for aid sent vs received
- **Net calculations**: Color-coded net values (green for positive, red for negative)
- **Resource types**: Gold, Runes, Soldiers, Food
- **Formatted output**: "Out X | In Y | Net ±Z"

**Current Project**: Basic aid tracking, may lack net calculations and formatting

### 5. **Dragon Contributions**
- **Gold donations**: Total gold donated
- **Food donations**: Total food donated
- **Troops sent**: Number of troops and damage dealt
- **Comprehensive tracking**: All dragon-related contributions

**Current Project**: May have basic dragon tracking, verify completeness

### 6. **Defensive Mode Specific Features**
- **Meteor damage tracking**: Peasants, soldiers, troops killed separately
- **Incoming spell tracking**: Defensive spell interceptions
- **Damage assessment**: Detailed breakdown of defensive actions

**Current Project**: No dedicated defensive mode

### 7. **Advanced Output Formatting**
- **HTML output**: Rich formatting with colors and styling
- **Expandable details**: Collapsible detail sections
- **Success rates**: Percentage calculations with formatting
- **Color coding**: Visual indicators for net values
- **Copy functionality**: One-click copy to clipboard

**Current Project**: Plain text output, may lack rich formatting

### 8. **Theme System**
- **Dark/Light mode toggle**: Persistent theme switching
- **Local storage**: Remembers user preference
- **UI adaptation**: Full theme support

**Current Project**: Has theme system, compare implementation

## Potential Missing Features

### High Priority (Significant Gaps)
1. **Per-Target Detailed Tracking** - Map-based operation tracking
2. **Success Rate Calculations** - Attempts vs success percentages
3. **Aid Net Calculations** - In/out tracking with net values
4. **Advanced Thievery Averages** - Detailed impact calculations

### Medium Priority (Enhancement Opportunities)
1. **Rich HTML Output** - Formatted output with colors/styling
2. **Expandable Details** - Collapsible detail sections
3. **Defensive Spell Tracking** - Incoming spell damage assessment
4. **Dragon Contribution Details** - Comprehensive dragon tracking
5. **Target Province Extraction** - Sophisticated target identification

### Low Priority (Nice to Have)
1. **Copy to Clipboard** - One-click copy functionality
2. **Color-Coded Net Values** - Visual indicators
3. **Detailed Troop Type Conversion** - Propaganda breakdown by troop type
4. **Operation Averages** - Per-operation average calculations

## Parsing Logic Differences

### Target Province Extraction
```javascript
// External parser uses sophisticated regex
const hasTargetProvince = /\(\s*[^()]+\s*\(\d+:\d+\)\s*\)$/i.test(trimmed);
const guildsMatch = origLine.match(/guilds of ([^()]+?)\s*\(\d+:\d+\)/i);
```

**Current Project**: May have simpler target extraction logic

### Success Rate Tracking
```javascript
// External parser tracks attempts and success
c.spellAttempts++;
c.spellSuccess++;
// Later calculates: Math.round(c.spellSuccess/c.spellAttempts*100)
```

**Current Project**: May only track successful operations

### Per-Operation Impact Tracking
```javascript
// External parser uses Maps for detailed tracking
perTarget.abolish.set(abolishTarget,{c:0,t:0});
perTarget.abolish.get(abolishTarget).c++;
perTarget.abolish.get(abolishTarget).t += v;
```

**Current Project**: May use simple counters

## Recommendations

### Immediate Actions
1. **Audit current parser** against this feature list
2. **Identify specific gaps** in our implementation
3. **Prioritize features** based on user value vs implementation effort
4. **Create enhancement tickets** for high-priority missing features

### Strategic Considerations
1. **Per-target tracking** would provide valuable insights for users
2. **Rich output formatting** would improve readability
3. **Success rate calculations** would help users assess operation effectiveness

### Implementation Approach
1. **Phase 1**: Add success rate tracking and net calculations
2. **Phase 2**: Implement per-target detailed tracking
3. **Phase 3**: Enhance output formatting and UI features

## Next Steps

1. **Verify current capabilities** against this analysis
2. **Create specific enhancement tickets** for prioritized features
3. **Assess implementation complexity** for each missing feature
4. **Plan incremental improvements** based on user feedback

## Files Referenced
- External parser: https://emphieltes.github.io/utopia.github.io/Parser%20v1.4.3.html
- Current parser: `js/parser.js`
- Current UI: `js/ui.js`, `index.html`

Make sure to keep the Copy to Clipboard functionality intact when adding new features so that results can cleanly be pasted into a WYSIWYG forum.