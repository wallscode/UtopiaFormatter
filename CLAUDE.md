# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UtopiaFormatter is a static web application that parses raw game data from the Utopia online text game into clean, forum-ready formatted output. It has no build step and no external dependencies.

## Running Tests

Tests use Node.js directly — no test runner or package.json required:

```bash
/opt/homebrew/bin/node tests/parser.test.js
/opt/homebrew/bin/node tests/kingdom-news-log.test.js
/opt/homebrew/bin/node tests/province-logs.test.js
```

## Development Server

Since this is a static site, any static file server works:

```bash
python -m http.server 3000
# or
npx serve .
```

Debug utilities are available in the browser console on localhost via `window.NewsParserDebug`.

## Architecture

Five JS modules loaded sequentially via `<script>` tags in `index.html` (no bundler):

| File | Role |
|---|---|
| `js/app-config-default.js` | Default APP_CONFIG values |
| `js/config.js` | Generated in CI — sets `window.APP_CONFIG.logEndpoint` (gitignored) |
| `js/parser.js` | All parsing logic (3,000+ lines) — the core of the app |
| `js/ui.js` | DOM manipulation, event listeners, Advanced Settings, copy handlers |
| `js/main.js` | App initialization, DOM validation |

`parser.js` uses `module.exports` to expose functions for testing in Node.js, while also running in the browser where `module` is undefined. New exports must be added to both the `module.exports` block at the bottom of `parser.js` and tested via the test files.

## Parsing Modes

**Kingdom News Log** (`parseKingdomNewsLog` in `parser.js`): Parses kingdom-vs-kingdom attack data. Extracts attack types (traditional march, conquest, ambush, raze, learn, massacre, plunder, bounces), computes acreage stats, and produces per-province summaries. Uses a configurable 6-day unique-attack window.

**Province Logs** (`formatProvinceLogs` in `parser.js`): Parses individual province log entries. Tracks 22 spell types, 11+ thievery operations, resource movements (aid, stolen goods), dragon donations, and ritual completions. Handles date prefix removal and timestamp line filtering.

**Province News** (`parseProvinceNews` in `parser.js`): Parses province-level incoming event news. Tracks attacks suffered, thievery and spell impacts, aid received, daily login bonuses, and war outcomes.

**Combined Province Summary** (`formatCombinedProvinceSummary` in `parser.js`): Merges Province Logs and Province News into a single unified output. Triggered when both the primary and secondary textareas have content.


## Test Data

Real-world test data lives in `tests/`:
- `Kingdom News original.txt` (48K) — input for kingdom news tests
- `Kingdom News Report target format.txt` (3.7K) — expected output to diff against
- `provincelogs.txt` (176K) — input for province log tests

When modifying parsing logic, run the relevant test and compare output against the target format file. The kingdom news test does line-by-line comparison against the target format.

## Issue Tracking

This project uses `tk` (ticket) for issue tracking. Tickets are stored as markdown files in `.tickets/` and committed to the repo.

```bash
tk create "title" -d "description" --design "..." --acceptance "..."  # create ticket (NOT tk new)
tk ls          # list all tickets
tk ready       # tickets with no unresolved dependencies
tk blocked     # tickets waiting on other tickets
tk show <id>   # full details for a ticket
tk start <id>  # mark in progress
tk close <id>  # mark done
```

## Key Specifications

`docs/spec.md` — current-state behavioural specification covering all parser outputs, Advanced Settings toggles, copy button behaviours, UI interactions, and architectural constraints. **Read this first** when implementing any new feature or fixing a bug.

`docs/Utopia Game Parser Requirements.md` — game domain knowledge: attack formats, spell names, thievery op names, date rules, kingdom/province structure. Consult when implementing or debugging parsing behaviour.
