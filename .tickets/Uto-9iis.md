---
id: Uto-9iis
status: closed
deps: []
links: []
created: 2026-02-26T13:17:01Z
type: task
priority: 2
tags: [testing, kingdom-news, parser]
---
# Kingdom News tests: per-province attack count assertions

The kingdom-news-log.test.js currently validates full formatted output against a target file. Add focused test cases that assert per-province attack counts (attacks made and suffered) for key provinces to catch regressions in attack parsing.

## Acceptance Criteria

- Assert own-kingdom (5:1) per-province made/suffered counts match known values from test data
- Assert enemy-kingdom (4:1) per-province counts
- Assert total made/suffered for each kingdom section
- Verify 'An unknown province' appears with correct counts and is excluded from uniques
- Tests are co-located in kingdom-news-log.test.js or a dedicated counts test file

