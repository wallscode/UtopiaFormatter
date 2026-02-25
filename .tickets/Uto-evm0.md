---
id: Uto-evm0
status: open
deps: []
links: []
created: 2026-02-25T03:27:06Z
type: bug
priority: 2
tags: [parser, province-logs, output]
---
# Province Logs output: Ritual Summary section shown when ritual count is zero

The requirements specify:

> "If no ritual casts are detected, this section should not be shown."

The current `formatProvinceLogs` in `js/parser.js` always appends the Ritual Summary section, including when `ritualCasts === 0`, producing output like:

```
Ritual Summary:
0 successful ritual casts
```

## Required behaviour

Only output the Ritual Summary block (header + content) when `ritualCasts > 0`.

## Acceptance Criteria

- Ritual Summary section is absent from output when no ritual casts were detected
- Ritual Summary section appears correctly when one or more ritual casts are present
- The Province Logs section visibility toggle in Advanced Settings (Uto-kyc1) should still work correctly — the section should not appear in the toggle list if the parser produced no content for it
