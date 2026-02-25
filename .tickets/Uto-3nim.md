---
id: Uto-3nim
status: open
deps: [Uto-wfmn]
links: []
created: 2026-02-24T22:36:10Z
type: feature
priority: 3
tags: [province-news, parser]
---
# Province News parser - implementation

Implement the Province News parsing mode once requirements are fully specified (see dependency ticket).

Scope:
- New parsing function in parser.js (or its own module)
- Add 'Province News' as a third mode option in the UI
- Add Province News-specific Advanced Settings options
- New test file with real Province News data and expected output format

## Acceptance Criteria

- Province News text is correctly parsed to the specified output format
- Auto-detection identifies Province News input correctly
- Advanced Settings panel shows Province News options when this mode is active
- Test suite passes with real-world Province News data

