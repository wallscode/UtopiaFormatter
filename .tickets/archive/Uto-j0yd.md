---
id: Uto-j0yd
status: closed
deps: []
links: []
created: 2026-02-28T02:57:32Z
type: task
priority: 2
assignee: Jamie Walls
---
# Province Logs: set Ritual, Construction, Science, Exploration, Military Training sections to hidden by default

In `advSettings.provinceLogs.sectionOrder`, set `visible: false` for the following sections:

- Ritual Summary
- Construction Summary
- Science Summary
- Exploration Summary
- Military Training

These sections are currently visible by default but contain detail that most users won't need in a typical paste. The core sections (Thievery Summary, Resources Stolen, Spell Summary, Aid Summary, Dragon Summary) should remain visible by default.
