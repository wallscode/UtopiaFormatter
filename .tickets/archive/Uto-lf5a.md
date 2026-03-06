---
id: Uto-lf5a
status: closed
deps: []
links: []
created: 2026-03-02T22:46:40Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Merge showRobberyOpCounts into showAverages

Consolidate the two Display Options checkboxes in Province Logs Advanced Settings — 'Show averages' and 'Show robbery op counts & averages' — into a single 'Show averages' toggle that activates both behaviours at once.

## Design

## Current behaviour

Two separate checkboxes:
- **Show averages** (`showAverages`): appends `(avg X)` to lines matching `N thing for a total of Y thing` when count > 1.
- **Show robbery op counts & averages** (`showRobberyOpCounts`): when OFF, strips ` (N ops Avg: X)` suffixes from robbery lines (i.e. it is an 'on by default but hidden' toggle). Default value is `false`.

## Desired behaviour

A single **Show averages** checkbox controls both:
- Keep `(N ops Avg: X)` robbery suffixes when checked; strip them when unchecked.
- Append `(avg X)` per-item averages when checked; omit them when unchecked.

## Files to change

### `js/ui.js`

1. **`advSettings.provinceLogs`** — remove `showRobberyOpCounts: false` field.
2. **`renderProvinceLogsSettings`** — remove the 'Show robbery op counts & averages' `adv-group` block entirely (the `robberyGroup` variable and its surrounding code).
3. **`applyProvinceLogsSettings`** — change the robbery-op-counts guard from:
   ```javascript
   if (!advSettings.provinceLogs.showRobberyOpCounts) {
       output = output.split('\n').map(line => line.replace(/ \(\d+ ops Avg: \S+\)$/, '')).join('\n');
   }
   ```
   to:
   ```javascript
   if (!advSettings.provinceLogs.showAverages) {
       output = output.split('\n').map(line => line.replace(/ \(\d+ ops Avg: \S+\)$/, '')).join('\n');
   }
   ```
   The existing `showAverages` block below is unchanged.

## Acceptance Criteria

1. Advanced Settings for Province Logs shows only one averages checkbox labelled 'Show averages'.
2. When unchecked: robbery op-count suffixes are stripped AND per-item averages are not appended.
3. When checked: robbery op-count suffixes are preserved AND per-item averages are appended.
4. No other Display Options are affected.

