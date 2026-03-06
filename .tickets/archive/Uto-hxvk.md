---
id: Uto-hxvk
status: closed
deps: []
links: []
created: 2026-02-24T22:48:12Z
type: feature
priority: 1
tags: [ui, auto-detect]
---
# Remove manual mode radio buttons — auto-detect only

Now that auto-detection is in place, remove the mode radio buttons and the 'Parsing Mode' section from the UI entirely. The parser should determine the correct mode from the pasted input with no manual selection needed.

Changes required:
- Remove the mode-section from index.html (h2, descriptive p, .mode-selector div, detect-badge span)
- Remove modeRadios and related logic from getDomElements and setupEventListeners in ui.js
- Remove the manual radio-change listener that cleared the detect badge (badge may still show detected mode, or be removed too if redundant)
- Remove updateInputDescription and its call sites since the description is now a single static string
- Remove or simplify handleParse mode-branching: call autoDetectMode first, then dispatch to the right parser; if type cannot be detected, show a clear error message asking the user to check their input
- Clean up any dead CSS for .mode-selector in main.css

## Acceptance Criteria

- No radio buttons or mode selector visible in the UI
- Pasting Kingdom News text and clicking Parse produces Kingdom News output
- Pasting Province Logs text and clicking Parse produces Province Logs output
- Pasting unrecognisable text shows a helpful error (e.g. 'Could not detect input type — paste Kingdom News or Province Logs text')
- The detect badge (or equivalent indicator) still tells the user what was detected before they parse

