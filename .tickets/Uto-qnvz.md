---
id: Uto-qnvz
status: closed
deps: []
links: []
created: 2026-03-04T22:36:15Z
type: task
priority: 2
assignee: Jamie Walls
---
# Skip Edition header lines in Kingdom News and Province News parsers

The Province Logs parser already skips lines matching /^Edition\w+ YR\d+/ (Uto-jhdn). The same junk UI artifact lines can appear in Kingdom News and Province News input. Add the same skip guard to both parsers so these lines are silently ignored rather than logged as unrecognized.\n\nKingdom News: the guard is in the main attack-line loop before the logUnrecognizedLine call (~line 1526 in parser.js).\n\nProvince News: the guard is in parseProvinceNewsLine before the final logUnrecognizedLine call (~line 2820 in parser.js). Both occurrences of logUnrecognizedLine in Province News should be reviewed — the Edition pattern would only realistically appear at the final fallthrough.\n\nPattern to skip: /^Edition\w+ YR\d+/

## Acceptance Criteria

1. Edition header lines no longer appear in unrecognized-line logs for kingdom-news or province-news contexts. 2. All existing test suites pass.

