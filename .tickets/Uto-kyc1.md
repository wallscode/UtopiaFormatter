---
id: Uto-kyc1
status: open
deps: [Uto-cyh5]
links: []
created: 2026-02-24T22:35:40Z
type: feature
priority: 2
parent: Uto-cyh5
tags: [ui, advanced-settings, province-logs]
---
# Advanced Settings - Province Logs options

Implement the Province Logs-specific controls inside the Advanced Parser Settings panel. Options per requirements:

1. Section reordering - allow moving each output section (Thievery Summary, Resources Stolen, Spell Summary, Aid Summary, Dragon Summary, Ritual Summary) up or down
2. Show/hide science allocation summary
3. Show/hide military training info
4. Show/hide self-spells (spells cast on own province)
5. Show/hide averages (average counts/values per section)

## Acceptance Criteria

- Each toggle immediately updates the output without re-parsing the raw input
- Section reordering changes the order of sections in the output
- Hidden sections are fully omitted from output (not just visually hidden)
- Averages toggle adds/removes per-section average lines

