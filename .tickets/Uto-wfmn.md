---
id: Uto-wfmn
status: closed
deps: []
links: []
created: 2026-02-24T22:35:51Z
type: task
priority: 2
tags: [province-news, planning]
---
# Province News parser - define requirements

The requirements doc currently says 'Will be added later' for Province News. This ticket covers writing the detailed spec for the Province News parser before any implementation begins.

Province News is distinct from Province Logs - it shows the news feed for a single province (incoming and outgoing events as seen from that province's perspective), whereas Province Logs is the internal action log.

Deliverable: Expand the 'Overview of Province News Requirements' section in 'Utopia Game Parser Requirements.md' with:
- Input format details
- Supported event types and their text patterns
- Output format and section structure
- Any special calculation rules

## Completed

Requirements written in `Utopia Game Parser Requirements.md` under "Overview of Province News Requirements", covering:

- Input format (date-tab pattern, "of YR" distinguisher from Province Logs)
- Auto-detection heuristics
- 20 event types with patterns and extraction rules
- Output format for 10 sections (header, monthly land, monthly income, scientists, aid received, resources stolen, thievery, spell attempts, attacks suffered, hazards & events, war outcomes)
- Special parsing rules (multi-part lines, prefix stripping, meteor aggregation)

Based on analysis of `ProvinceNewsExample.txt` (237 lines, YR1–YR3).
