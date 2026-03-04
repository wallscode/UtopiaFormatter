---
id: Uto-r4d2
status: closed
deps: []
links: []
created: 2026-03-03T00:39:16Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs: round Greater Arson and Propaganda subcomponent averages to nearest whole number

Currently the per-subcomponent averages for Greater Arson and Propaganda are displayed with one decimal place when not a whole number (e.g. '32 Hospitals (3 ops, avg 10.7)'). Round these to the nearest whole number instead (e.g. '32 Hospitals (3 ops, avg 11)').

No change needed for Resources Stolen, which already uses the rounded Nk format.

## Design

In parser.js, in the Greater Arson and Propaganda output blocks (~lines 899-920), change the avgStr computation from:
  const avgStr = Number.isInteger(avg) ? `${avg}` : avg.toFixed(1);
to:
  const avgStr = `${Math.round(avg)}`;

This removes the decimal entirely for both cases.

## Acceptance Criteria

- [ ] Greater Arson subcomponent averages are whole numbers (e.g. avg 11, not avg 10.7)
- [ ] Propaganda subcomponent averages are whole numbers (e.g. avg 25, not avg 24.5)
- [ ] Expected output file updated
- [ ] All tests pass

