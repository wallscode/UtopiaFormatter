# UtopiaFormatter — Behavioural Specification

This document is the authoritative reference for what UtopiaFormatter currently does. It is written for AI agents implementing future changes. When behaviour is ambiguous, this document reflects intent; the code reflects reality. If they conflict, update this document to match the code (or fix the code if it is wrong).

Game domain knowledge (attack formats, spell names, thievery op names, date rules) lives in `docs/Utopia Game Parser Requirements.md`. Consult it when implementing or debugging parsing behaviour.

---

## Architecture Constraints

These must not change without deliberate decision:

- **No build step.** The site is plain HTML/CSS/JS. No bundler, no npm scripts, no transpilation.
- **No external runtime dependencies.** All logic lives in the five JS files loaded by `index.html`.
- **Script load order matters.** `index.html` loads: `js/app-config-default.js` → `js/config.js` → `js/parser.js` → `js/ui.js` → `js/main.js`. Each file depends on globals set by earlier files.
- **`parser.js` dual-environment pattern.** `parser.js` uses `module.exports` at the bottom, guarded so it runs in both Node.js (tests) and the browser (where `module` is undefined). New parser exports must be added to the `module.exports` block and tested.
- **Dark mode only.** There is no light mode. The theme toggle was removed. Do not re-introduce it.
- **Tests run directly with Node.js** — no test runner required. See CLAUDE.md for commands.

---

## Input Detection

`detectInputType(text)` in `parser.js` returns one of `'kingdom-news-log'`, `'province-logs'`, `'province-news'`, or `null`.

Detection order (first match wins):

1. **Province Logs** — text contains any of: `early indications show that our operation`, `your wizards gather`, `you have ordered`, `you have given orders to commence work`, `begin casting`, `we have sent`, `our thieves have returned with`, `our thieves were able to steal` (case-insensitive).
2. **Kingdom News** — text contains any of: `captured N acres of land`, `and captured N acres of land`, `recaptured N acres of land`, `ambushed armies from`, `and razed N acres`, `razed N acres of`, `invaded and looted`, `attacked and looted`, `killed N people`, `invaded and pillaged`, `attacked and pillaged`, `attempted an invasion of`, `but was repelled` (case-insensitive). Kingdom News takes priority over Province Logs if both match.
3. **Province News** — text matches `/\bof YR\d+\t/` (tab-delimited date format). Only reached when neither Province Logs nor Kingdom News markers are present.
4. **null** — unrecognised input.

**Auto-detect badge** (`#detect-badge`) shows the detected mode after paste. It updates on paste events to both the primary and secondary textareas.

**Combined mode** triggers when both the primary textarea and the secondary textarea have content AND the primary is either Province Logs or Province News. The badge reads `Auto-detected: Province Logs + Province News` or `Auto-detected: Province News + Province Logs` accordingly.

---

## Kingdom News Parser

**Function:** `parseKingdomNewsLog(text, options)` in `parser.js`

**Input:** Raw kingdom news text copied from the Utopia game. Each entry begins with a game date (`Month Day, YRN`). Lines without a recognised date prefix at the start of the entry are stripped.

**Options:**
- `uniqueWindow` (integer, default 6): number of in-game days defining the unique-attack window.
- `warOnly` (boolean, default false): when true, output covers only the war between own kingdom and the detected enemy.

### Output Format

```
Kingdom News Report from UtopiaFormatter.com
{DateRange} ({N} days)

** Own Kingdom {K:K} Summary **
Total Attacks Made: N (N acres)
-- Uniques: N
-- Trad March: N (N acres)
-- Ambush: N (N acres)
-- Conquest: N (N acres)
-- Raze: N (N acres)
-- Massacre: N (N people)
-- Bounces: N (N%)
-- Learn: N (N books)
-- Dragons Started: N (Type, Type, ...)
-- Dragons Completed: N
-- Enemy Dragons Killed: N
-- Dragons Cancelled: N
-- Rituals Started: N (Type, Type, ...)
-- Rituals Completed: N
-- Rituals Failed: N
-- Ritual Coverage: N
Total Attacks Suffered: N (N acres)
-- Uniques: N
-- ... (same sub-rows as Made)
-- Enemy Dragons Started: N (Type, ...)
-- Enemy Dragons Completed: N (Type, ...)
-- Enemy Dragons Cancelled: N

** Own Kingdom {K:K} **
Total land exchanged: +/-N (made/suffered)
  {net} | {province} ({made}/{suffered})
  ... (sorted by net descending)

** Uniques for {K:K} **
{province} {unique-count}
... (sorted by count descending, then name)

** The Kingdom of {K:K} **
Total land exchanged: +/-N (suffered-by-us/made-by-us)
  {net} | {province} ({made}/{suffered})
  ...

** Uniques for {K:K} **
...

** Highlights **
Most land gained in a single trad march - {province}: N
Most land lost in a single trad march - {province}: N
Most land gained in a single ambush - {province}: N
Most land lost in a single ambush - {province}: N
Most bounces made - {province}: N
Most bounces received - {province}: N

** Kingdom Relations **
-- War Declarations Against Us: N
-- Ceasefires Proposed: N
-- Ceasefires Accepted: N
```

Zero-count rows are suppressed. Rows without data (e.g. no ambushes) do not appear. The Highlights section is omitted if there is no data to show. Kingdom Relations is hidden by default (toggle in Advanced Settings).

### Unique Attack Window Algorithm

A "unique" is counted per attacking province within a rolling window. Window starts at the first attack date. Any attack within `uniqueWindow` days of the window start (i.e. `date <= windowStart + uniqueWindow`) falls in the same unique. When `date > windowStart + uniqueWindow`, a new window starts and a new unique is counted. `UNIQUE_WINDOW_DAYS = 6` by default, meaning a window spans days 0–6 inclusive (7 calendar days).

### Own Kingdom Detection

`detectOwnKingdom(text)` scans all attack lines to find the kingdom that appears most often on both sides (attacking and defending). It is dynamic — not hardcoded. The detected kingdom ID is used to label the "Own Kingdom" sections.

---

## Province Logs Parser

**Function:** `formatProvinceLogs(text)` in `parser.js` (exported; `logsparse.js` contains an older version that is not used by tests or the UI).

**Input:** Raw province log text. Date prefixes are stripped from the start of each log entry. Timestamp-only lines are filtered out.

### Tracked Categories

**Thievery operations (11+):** Assassination, Kidnapping, Robbery, Arson, Greater Arson, Night Strike, Propaganda, Learn Secrets, Shadowlight, Steal War Horses, Espionage, and others tracked as generic ops.

**Spells (22 types):** Includes Lightning Strike, Mystic Vortex, Meteor Shower, Pitfalls, Fireball, and others. Both offensive (cast on enemies) and self-cast spells are tracked separately.

**Other:** Aid sent/received, resources stolen from opponents, dragon donations, ritual completions, construction orders, science allocations, exploration orders, military training.

### Output Sections (default visibility)

| Section | Default |
|---|---|
| Thievery Summary | ON |
| Thievery Targets by Province | off |
| Thievery Targets by Op Type | off |
| Resources Stolen from Opponents | ON |
| Spell Summary | ON |
| Spell Targets by Province | off |
| Spell Targets by Spell Type | off |
| Aid Summary | ON |
| Dragon Summary | ON |
| Ritual Summary | off |
| Construction Summary | off |
| Science Summary | off |
| Exploration Summary | off |
| Military Training | off |

Sections within the Thievery group and Spells group can be reordered only within their group. Top-level groups can be reordered relative to each other.

---

## Province News Parser

**Function:** `parseProvinceNews(text)` in `parser.js`

**Input:** Raw province news text. Each line has a tab-delimited date prefix (`Month Day of YRN\t`). Lines are grouped and parsed by event type.

### Output Sections (default visibility)

| Section | Default |
|---|---|
| Attacks Suffered | ON |
| Thievery Impacts | ON |
| Shadowlight Thief IDs | off |
| Spell Impacts | ON |
| Aid Received | ON |
| Daily Login Bonus | ON |
| Scientists Gained | off |
| War Outcomes | off |

---

## Combined Province Summary

**Function:** `formatCombinedProvinceSummary(logsText, newsText)` in `parser.js`

Triggered when both primary and secondary textareas have content and the primary is Province Logs or Province News (either direction works). The function always takes `(logsText, newsText)` — `ui.js` handles swapping arguments when Province News is in the primary textarea.

Merges sections from both parsers into a unified output using `advSettings.combinedProvince` section order. Sections from Province Logs and Province News are interleaved according to the configured section order.

### Combined Section Order (default)

Aid Summary → Offensive Thievery group → Defensive Thievery group → Offensive Spells group → Defensive Spells group → Military group → Exploration Summary → Construction Summary → Science Summary → Dragon Summary → Ritual Summary → War Outcomes → Daily Login Bonus → Scientists Gained

---

## Advanced Settings Panel

The Advanced Settings panel (`#advanced-settings`) appears after a successful parse. It is hidden until content is parsed and collapses when Clear is pressed.

The panel has two columns: **Sections** (left) for visibility toggles and reordering, and **Display Options** (right) for formatting toggles. A **Copy Buttons** section appears at the bottom of the right column for all parser views.

Settings persist for the duration of the page session (reset on page reload).

### Kingdom News Advanced Settings

**Show / Hide (left column):**
- Attacks (parent toggle for all attack sub-rows); children: Trad March, Learn, Massacre, Plunder
- Dragons (parent toggle); child: Dragon Cancellations (default off)
- Rituals (parent toggle); child: Rituals Failed (default off)
- Ritual Coverage (default on)
- Kingdom Relations (default off); children: War Declarations, Ceasefires

**Sections (right column, reorderable):**
Own Kingdom Summary, Per-Kingdom Summaries, Uniques, Highlights, Kingdom Relations

- **Unique Window:** numeric input (default 6). Setting to 0 counts every attack as a unique.
- **War Only:** when checked, filters output to only the war between own kingdom and detected enemy. Appears only when war events are detected in the input.
- **Uniques grouped with kingdoms:** when checked, the Uniques block for each kingdom appears directly below that kingdom's summary rather than as a separate section.

**Copy Buttons (right column):**
- Copy for Discord (default off)
- Copy Text for KD Forum on Mobile / Copy Raw Text (default off, label is device-dynamic)

### Province Logs Advanced Settings

**Sections (left column, group-constrained reordering):**
Groups: Thievery, Spells, Aid Summary, Dragon Summary, Ritual Summary, Construction Summary, Science Summary, Exploration Summary, Military Training. Sections within a group stay together; groups can be reordered relative to each other.

**Display Options (right column):**
- Show averages in Thievery (default off)
- Show failed thievery operations (default on)
- Show failed spell attempts (default off)
- Show thieves lost on success (default off)
- Show razed buildings (default off)
- Show troops released (default off)
- Show draft percentage (default off)
- Show draft rate (default off)
- Show military wages (default off)
- Show explore details (default off)

**Copy Buttons (right column):**
- Copy for Discord (default off)
- Copy Text for KD Forum on Mobile / Copy Raw Text (default off)

**Combined Summary (right column):**
- Toggle to reveal secondary input for Province News (default off). When revealed, the secondary textarea accepts Province News to produce a Combined Province Summary.

### Province News Advanced Settings

**Sections (left column, reorderable):**
Attacks Suffered, Thievery Impacts, Shadowlight Thief IDs, Spell Impacts, Aid Received, Daily Login Bonus, Scientists Gained, War Outcomes.

**Display Options (right column):**
- Show thief/spell source identifiers (default off)

**Copy Buttons (right column):**
- Copy for Discord (default off)
- Copy Text for KD Forum on Mobile / Copy Raw Text (default off)

**Combined Summary (right column):**
- Toggle to reveal secondary input for Province Logs (default off). When revealed, the secondary textarea accepts Province Logs to produce a Combined Province Summary.

### Combined Province Advanced Settings

**Sections (left column, group-constrained reordering):**
Groups: Aid Summary, Offensive Thievery, Defensive Thievery, Offensive Spells, Defensive Spells, Military, Exploration Summary, Construction Summary, Science Summary, Dragon Summary, Ritual Summary, War Outcomes, Daily Login Bonus, Scientists Gained.

**Display Options (right column):**
All Province Logs display toggles plus `showSourceIdentifiers` from Province News.

**Copy Buttons (right column):**
- Copy for Discord (default off)
- Copy Text for KD Forum on Mobile / Copy Raw Text (default off)

---

## Copy Buttons

Three copy button types exist. All appear in `#output-text`'s button group.

### Copy to Clipboard (always visible after parse)
- **Desktop:** copies plain text with real newlines. The desktop Utopia forum editor preserves newlines correctly.
- **Mobile:** copies HTML-formatted text (`<br>` for newlines, `&nbsp;` for leading spaces). The mobile Utopia forum WYSIWYG editor strips real newlines on submit but preserves `<br>` and `&nbsp;`.

Detection: `navigator.userAgent` tested against `/Mobi|Android|iPhone|iPad|iPod/i`.

### Copy for Discord (hidden by default, toggle in Advanced Settings)
Transforms output into Discord markdown: section headings become `**bold**`, list items become bullet points. Warns if output exceeds Discord's 2,000 character limit.

### Alt Copy button (hidden by default, toggle in Advanced Settings)
Device-dynamic — provides access to the opposite copy path from the standard button:
- **On mobile:** button label is "Copy Raw Text". Copies plain text (the desktop path) — useful when the user wants to paste into a plain text context.
- **On desktop:** button label is "Copy for Mobile". Copies HTML-formatted text (the mobile path) — useful when the user is preparing output to hand off to a mobile player.

---

## UI Layout & Interactions

### Layout
- Wide screens (>= 768px): two-column layout. Left column: primary input, secondary input (when visible), Advanced Settings panel. Right column: formatted output.
- Narrow screens: single-column, output scrolled into view after parse.

### Secondary Input Section (`#secondary-input-section`)
- Hidden by default (`class="hidden"`).
- Revealed only via the "Combined Summary" toggle in Advanced Settings (Province Logs or Province News views).
- Heading and label text update dynamically based on which parser is in the primary textarea:
  - Primary = Province Logs → secondary heading "Province News (optional)"
  - Primary = Province News → secondary heading "Province Logs (optional)"
- Clear resets visibility to hidden and clears the textarea content.

### Keyboard Shortcuts
- `Ctrl+Enter` (or `Cmd+Enter`) — parse text (when focus is in the primary textarea or the Province News textarea)
- `Esc` — clear all inputs and output
- `Ctrl+Shift+C` — copy output to clipboard

### Parse Button State
Disabled (opacity 0.6) when both textareas are empty. Enabled when either has content.

### Advanced Settings Toggle
Collapsed by default (`aria-expanded="false"`, `hidden` attribute on content). Persists open/collapsed within the session. Automatically shown (but still collapsed) after first parse; user must click to expand.

---

## Unrecognised Line Logging

Parser calls `logUnrecognizedLine(line, context)` for lines that are not matched by any parser rule and are not truncated attack lines. This sends a POST request to the API Gateway endpoint configured in `window.APP_CONFIG.logEndpoint`. If `logEndpoint` is falsy, logging is silently skipped. Truncated attack lines (lines ending in `attacked` with no result, or lines with `captured N acres` but not `captured N acres of land`) are collected in `data.truncatedLines` and shown as a warning in the output, not logged as unrecognised.

---

## Deployment

- **CI/CD:** GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers on every push to any branch.
- **main branch** → syncs to S3 bucket root → invalidates prod CloudFront distribution.
- **non-main branches** → syncs to `dev/` prefix in the same bucket → invalidates dev CloudFront distribution.
- **S3 sync allowlist** (explicit `--include` rules): `index.html`, `css/*`, `img/*`, `favicon.ico`, `favicon-*.png`, `apple-touch-icon.png`, `android-chrome-*.png`, `site.webmanifest`, `js/config.js`, `js/parser.js`, `js/ui.js`, `js/main.js`, `emphieltes/*`. **New site content folders must be explicitly added here.**
- `docs/` is intentionally excluded from the S3 sync — it is developer documentation, not site content.
- `js/config.js` is generated in CI from the `LOG_ENDPOINT` GitHub Secret and is gitignored locally.
- Authentication: GitHub Actions OIDC (no long-lived AWS credentials). Role ARN stored in `AWS_ROLE_ARN` GitHub Secret.

---

## Sensitive Values — Never Commit

The following are gitignored and must never be committed:

- `js/config.js` — contains the `LOG_ENDPOINT` API URL
- `infra/params.json` and `infra/*.auto.tfvars` — account-specific infra parameters
- `.tickets/Uto-9djf.md` — S3 OAC migration ticket containing AWS account identifiers
- `.env` / `.env.*` — any environment files
