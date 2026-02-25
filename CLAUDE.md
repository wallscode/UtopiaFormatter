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
| `js/theme.js` | Light/dark theme toggle with `localStorage` persistence |
| `js/parser.js` | All parsing logic (1,200+ lines) — the core of the app |
| `js/logsparse.js` | Province log parsing helpers |
| `js/ui.js` | DOM manipulation, event listeners, keyboard shortcuts |
| `js/main.js` | App initialization, DOM validation |

`parser.js` uses `module.exports` to expose functions for testing in Node.js, while also running in the browser where `module` is undefined. New exports must be added to both the `module.exports` block at the bottom of `parser.js` and tested via the test files.

## Parsing Modes

**Kingdom News Log** (`parseKingdomNewsLog` in `parser.js`): Parses kingdom-vs-kingdom attack data. Extracts attack types (traditional march, conquest, ambush, raze, learn, massacre, plunder, bounces), computes acreage stats, and produces per-province summaries. Uses a configurable 6-day unique-attack window.

**Province Logs** (`formatProvinceLogs` in `logsparse.js`): Parses individual province log entries. Tracks 22 spell types, 11+ thievery operations, resource movements (aid, stolen goods), dragon donations, and ritual completions. Handles date prefix removal and timestamp line filtering.


## Test Data

Real-world test data lives in `tests/`:
- `Kingdom News original.txt` (48K) — input for kingdom news tests
- `Kingdom News Report target format.txt` (3.7K) — expected output to diff against
- `provincelogs.txt` (176K) — input for province log tests

When modifying parsing logic, run the relevant test and compare output against the target format file. The kingdom news test does line-by-line comparison against the target format.

## Issue Tracking

This project uses `tk` (ticket) for issue tracking. Tickets are stored as markdown files in `.tickets/` and committed to the repo.

```bash
tk ls          # list all tickets
tk ready       # tickets with no unresolved dependencies
tk blocked     # tickets waiting on other tickets
tk show <id>   # full details for a ticket
tk start <id>  # mark in progress
tk close <id>  # mark done
```

## Key Specifications

`Utopia Game Parser Requirements.md` (24K) contains detailed game mechanics, attack format specs, and parsing rules. Consult it when implementing or debugging parsing behavior.
