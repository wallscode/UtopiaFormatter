---
id: Uto-zv6q
status: closed
deps: []
links: []
created: 2026-11-20T01:36:59Z
type: bug
priority: 1
assignee: Jamie Walls
tags: [parser, ui, detection]
---
# Auto-split mixed Province Logs + Province News pastes into a Combined Summary

detectInputType only picks Province News when no Province Logs or Kingdom News pattern matches. A single-box paste containing both Province Logs and Province News is parsed entirely as one type, so the other type's lines are silently dropped from the output and logged as unrecognized (e.g. Uto-a2mt, Uto-b2ao, Uto-0kil, Uto-exaf, Uto-hakd, Uto-k5zo, Uto-jf0z, Uto-xj92 — News lines logged as province-logs).

## Design

Classify each dated line by which parser recognizes it (using a sink on logUnrecognizedLine): News-only lines go to the news side, everything else to the logs side. When a province-logs or province-news paste has lines on both sides, run formatCombinedProvinceSummary on the split text. Applies in handleParse and the paste-time detect badge.

## Acceptance Criteria

Pure Province Logs and pure Province News test files still detect and parse exactly as before. Logs+News concatenated in one box produces a Combined Province Summary, and News lines are no longer reported as unrecognized province-logs lines. Tests cover the split and the end-to-end detection.


## Notes

**2026-11-20T01:39:47Z**

Implemented: splitProvinceInput/detectMixedProvinceInput in parser.js, renderCombinedProvince in ui.js, tests in combined-province.test.js, spec updated. All test suites pass.
