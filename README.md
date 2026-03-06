# UtopiaFormatter

A static web tool that parses raw game data from the Utopia online text game into clean, forum-ready summaries.

## Features

- **Auto-detection**: Paste any supported text — the parser identifies the input type automatically
- **Four parsing modes**: Kingdom News Log, Province News, Province Logs, Combined Province Summary
- **Advanced Settings**: Per-mode toggles for section visibility, display options, and ordering
- **Clipboard support**: Copy to Clipboard (device-aware formatting), Copy for Discord, and an alternate copy button (Raw Text on mobile / Copy for Mobile on desktop) — all configurable in Advanced Settings
- **Keyboard shortcuts**: `Ctrl+Enter` to parse, `Esc` to clear, `Ctrl+Shift+C` to copy
- **Mobile responsive**: Works on all device sizes
- **No build step**: Pure HTML/CSS/Vanilla JS — open `index.html` or serve statically

---

## Parsing Modes

### Kingdom News Log

Parses kingdom-vs-kingdom combat reports. Detects your own kingdom dynamically and produces per-province and per-kingdom attack summaries.

**Tracked data:**
- Attack types: Traditional March, Conquest, Ambush, Raze, Learn, Massacre, Plunder
- Bounces (failed attacks)
- Unique attacks per province (configurable window, default 6 in-game days)
- Dragon and ritual events (own kingdom and enemy)
- War declarations, ceasefire proposals and acceptances

**Output sections** (reorderable in Advanced Settings):
- Own Kingdom Summary
- Per-Kingdom Summaries
- Uniques
- Highlights
- Kingdom Relations

**Advanced Settings options:**
- Show/hide learn, massacre, plunder, dragon cancellations, rituals failed, ritual coverage, kingdom relations
- Unique attack window (days)
- War-only filter (show only attacks involving war opponent)
- Uniques grouped with kingdoms
- Section visibility and order
- Copy for Discord, alt copy button

---

### Province News

Parses the Province News tab — the log of events that happened *to* your province.

**Tracked data:**
- **Attacks Suffered**: per-attacker acres captured or books looted (learn)
- **Thievery Impacts**: detected ops by source, Shadowlight interceptions, Incite Riots (count + days), Sabotage Wizards (count + days), Propaganda desertions (by troop type), Bribe Generals, turncoat generals, failed propaganda; resources stolen (gold, runes, bushels)
- **Shadowlight Thief IDs**: provinces identified as attacking you via Shadowlight
- **Spell Impacts**: spell attempts by source, Meteor Showers (days + casualties), Pitfalls (count + days), Greed (count + days), and other received spells
- **Aid Received**: gold, runes, bushels, soldiers, explore pool acres (with transit loss)
- **Daily Login Bonus**: acres, gold, science books; tier counts (extreme / impressive); includes monthly land and income grants
- **Scientists Gained**: new scientists grouped by field
- **War Outcomes**: land penalty or resource bonus from war resolution

**Output sections** (reorderable, default visibility):

| Section | Default |
|---|---|
| Attacks Suffered | visible |
| Thievery Impacts | visible |
| Shadowlight Thief IDs | hidden |
| Spell Impacts | visible |
| Aid Received | visible |
| Daily Login Bonus | visible |
| Scientists Gained | hidden |
| War Outcomes | hidden |

**Advanced Settings options:**
- Section visibility and order
- Show source identifiers (attacker/caster names in Thievery and Spell Impacts)
- Combined Summary toggle (reveals secondary input for Province Logs)
- Copy for Discord, alt copy button

---

### Province Logs

Parses the Province Logs tab — the log of actions *your* province took.

**Tracked data:**
- **Thievery Summary**: all thievery operations with success/failure counts and impact totals; individual building counts for Greater Arson; resource totals for Vault/Granary/Tower Robbery; horse counts for Steal War Horses
- **Resources Stolen from Opponents**: gold, runes, bushels, war horses
- **Spell Summary**: 22 offensive spell types with cast count and impact totals
- **Aid Summary**: resources sent to kingdommates (gold, runes, bushels, soldiers, explore pool acres)
- **Dragon Summary**: gold/bushel donations, troop weakening contributions
- **Ritual Summary**: ritual casts
- **Construction Summary**: buildings constructed and demolished
- **Science Summary**: books invested by field
- **Exploration Summary**: acres explored and explore costs
- **Military Training**: troops trained and released

**Output sections** (reorderable in Advanced Settings, default visibility):

| Section | Default |
|---|---|
| Thievery Summary | visible |
| Thievery Targets by Province | hidden |
| Thievery Targets by Op Type | hidden |
| Resources Stolen from Opponents | visible |
| Spell Summary | visible |
| Spell Targets by Province | hidden |
| Spell Targets by Spell Type | hidden |
| Aid Summary | visible |
| Dragon Summary | visible |
| Ritual Summary | hidden |
| Construction Summary | hidden |
| Science Summary | hidden |
| Exploration Summary | hidden |
| Military Training | hidden |

**Advanced Settings options:**
- Section visibility and order (groups stay together; groups reorderable relative to each other)
- Show/hide failed thievery attempts
- Show/hide thief losses on successful ops
- Show/hide failed spell attempts
- Show/hide razed buildings
- Show/hide released troops
- Show/hide draft percentage, draft rate, military wages
- Show/hide exploration detail lines
- Show/hide per-operation averages
- Combined Summary toggle (reveals secondary input for Province News)
- Copy for Discord, alt copy button

---

### Combined Province Summary

Triggered automatically when both the primary and secondary textareas have content and one contains Province Logs and the other contains Province News. The secondary input is revealed via the "Combined Summary" toggle in Advanced Settings.

Merges both parsers into a single unified output — Aid Summary shows sent, received, and net for each resource; all other sections are drawn from their respective parsers.

**Default section order:**
Aid Summary → Offensive Thievery → Defensive Thievery → Offensive Spells → Defensive Spells → Military → Exploration Summary → Construction Summary → Science Summary → Dragon Summary → Ritual Summary → War Outcomes → Daily Login Bonus → Scientists Gained

---

## Technology Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — no frameworks, no build step, no external dependencies
- **Node.js** — used only for running tests (not required for the app itself)

### File Structure

```
UtopiaFormatter/
├── index.html                          # Main page
├── css/
│   └── main.css                        # Stylesheet (dark mode only)
├── js/
│   ├── app-config-default.js           # Default APP_CONFIG values
│   ├── config.js                       # Generated in CI from secrets (gitignored)
│   ├── config.example.js               # Template for local config.js
│   ├── parser.js                       # All parsing logic (~1,300 lines)
│   ├── ui.js                           # DOM manipulation and event handling
│   └── main.js                         # App initialization
├── docs/
│   ├── spec.md                         # Behavioural specification for AI agents
│   └── Utopia Game Parser Requirements.md  # Game mechanics and parsing specs
├── emphieltes/
│   └── index.html                      # Emphieltes redirect page
├── tests/
│   ├── parser.test.js                  # HTML cleaning and detectInputType tests
│   ├── kingdom-news-log.test.js        # Kingdom News Log tests
│   ├── province-logs.test.js           # Province Logs tests
│   ├── province-news.test.js           # Province News tests
│   ├── combined-province.test.js       # Combined Province Summary tests
│   ├── Kingdom News original.txt       # Kingdom News test input (493 lines)
│   ├── Kingdom News Report target format.txt  # Expected Kingdom News output
│   ├── provincelogs.txt                # Province Logs test input
│   ├── provincelogs_expected_output.txt
│   └── ProvinceNewsExample.txt         # Province News test input
├── CLAUDE.md                           # AI assistant project instructions
└── README.md                           # This file
```

---

## Running Tests

No package.json or test runner required — tests use Node.js directly:

```bash
/opt/homebrew/bin/node tests/parser.test.js
/opt/homebrew/bin/node tests/kingdom-news-log.test.js
/opt/homebrew/bin/node tests/province-logs.test.js
/opt/homebrew/bin/node tests/province-news.test.js
/opt/homebrew/bin/node tests/combined-province.test.js
```

### Test Coverage

| File | What it tests |
|---|---|
| `parser.test.js` | HTML cleaning utilities, `detectInputType` (all markers, priority ordering, null cases) |
| `kingdom-news-log.test.js` | Full output format match, per-province attack/unique counts, `calculateUniques` unit tests, `applyKingdomNewsSettings` filter tests |
| `province-logs.test.js` | Full output match against expected file, 54 value assertions across all sections, `applyProvinceLogsSettings` filter tests, `accumulateProvinceLogsData` unit tests for every input line type |
| `province-news.test.js` | Full parse against real-world example file, section value assertions, `applyProvinceNewsSettings` filter tests, synthetic unit tests for every input line type |
| `combined-province.test.js` | Combined output structure, aid net calculation, `accumulateProvinceLogsData` / `accumulateProvinceNewsData` accumulator contracts |

---

## Local Development

Any static file server works:

```bash
python -m http.server 3000
# or
npx serve .
```

Open `http://localhost:3000`.

### Debug Utilities

When running on localhost, `window.NewsParserDebug` is available in the browser console:

```javascript
NewsParserDebug.testParser()   // parse a sample Kingdom News line
NewsParserDebug.getState()     // current app state
NewsParserDebug.clearAll()     // clear both textareas
```

---

## Usage

1. **Paste** raw Kingdom News, Province News, or Province Logs text into the input box
2. **Parse** — click "Parse Text" or press `Ctrl+Enter`
3. **Adjust** — open Advanced Settings to toggle sections or reorder output
4. **Copy** — click "Copy to Clipboard" or press `Ctrl+Shift+C`
5. **Post** — paste the formatted output into the Utopia Kingdom Forum

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` | Parse input |
| `Esc` | Clear |
| `Ctrl+Shift+C` | Copy output |

---

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Android Chrome)

## Security

- Client-side only — no server-side processing
- No external API calls or CDN dependencies
- No user data stored (localStorage used only for UI preferences)
- Input is HTML-sanitized before processing
