---
id: Uto-uf99
status: closed
deps: []
links: []
created: 2026-03-01T16:12:29Z
type: bug
priority: 1
assignee: Jamie Walls
---
# Province Logs: Thievery Targets and Spell Targets sections not rendering

## Root Cause

`applyProvinceLogsSettings` in `js/ui.js` has a hardcoded `sectionNames` array (line ~1176) that does not include `'Thievery Targets'` or `'Spell Targets'`. As a result, those sections are never extracted from the raw parser output and never included in the rendered output, regardless of the checkbox state in Advanced Settings.

```javascript
// Current (broken) — missing the two new sections
const sectionNames = [
    'Thievery Summary', 'Resources Stolen', 'Spell Summary',
    'Aid Summary', 'Dragon Summary', 'Ritual Summary',
    'Construction Summary', 'Science Summary',
    'Exploration Summary', 'Military Training'
];
```

## Fix

Add the two new sections to the `sectionNames` array in `applyProvinceLogsSettings`:

```javascript
const sectionNames = [
    'Thievery Summary', 'Thievery Targets', 'Resources Stolen',
    'Spell Summary', 'Spell Targets',
    'Aid Summary', 'Dragon Summary', 'Ritual Summary',
    'Construction Summary', 'Science Summary',
    'Exploration Summary', 'Military Training'
];
```

This is a one-line change (the array literal). No parser changes needed — the parser already outputs the sections correctly, and the `visible` / `sectionOrder` entries in `advSettings` are already in place.

## Verification

Parse a Province Log with thievery and spell ops against named enemy provinces. Enable Thievery Targets and/or Spell Targets in Advanced Settings — both sections should now appear in output. Disable both — neither should appear.

