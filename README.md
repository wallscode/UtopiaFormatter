# UtopiaFormatter

A static web tool that parses raw game data from the Utopia online text game into clean, forum-ready summaries.

## Features

- **Auto-detection**: Paste any supported text — the parser identifies the input type automatically
- **Three parsing modes**: Kingdom News Log, Province News, Province Logs (see below)
- **Advanced Settings**: Per-mode toggles for section visibility, display options, and ordering
- **Wide mode**: Header toggle expands the layout to 95vw on large monitors (persisted via localStorage)
- **Clipboard support**: One-click copy to clipboard
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
- Ceasefire proposals and withdrawals

**Output sections** (reorderable in Advanced Settings):
- Own Kingdom Summary
- Per-Kingdom Summaries
- Uniques
- Highlights

**Advanced Settings options:**
- Show/hide learn, massacre, plunder, dragon, ritual, ceasefire events
- Unique attack window (days)
- War-only filter (show only attacks involving war opponent)
- Section order

---

### Province News

Parses the Province News tab — the log of events that happened *to* your province.

**Tracked data:**
- **Daily Login Bonus**: acres, gold, science books; tier counts (extreme / impressive)
- **Scientists Gained**: new scientists grouped by field
- **Aid Received**: gold, runes, bushels, soldiers, explore pool acres (with transit loss)
- **Resources Stolen**: gold, runes, bushels, war horses
- **Thievery Impacts**: detected ops by source, Shadowlight interceptions by source, Incite Riots (count + days), Sabotage Wizards (count + days), Propaganda desertions (by troop type), Bribe Generals, failed propaganda
- **Spell Impacts**: spell attempts by source, Meteor Showers (days + casualties), Pitfalls, Greed (count + days)
- **Shadowlight Attacker IDs**: provinces identified attacking you
- **Attacks Suffered**: per-attacker acres captured or books looted
- **War Outcomes**: land penalty or resource bonus from war resolution

**Output sections** (reorderable, default order):
1. Thievery Impacts *(visible)*
2. Spell Impacts *(visible)*
3. Aid Received *(visible)*
4. Scientists Gained *(visible)*
5. Daily Login Bonus *(visible)*
6. Resources Stolen *(hidden)*
7. Shadowlight Attacker IDs *(hidden)*
8. Attacks Suffered *(hidden)*
9. War Outcomes *(hidden)*

**Advanced Settings options:**
- Section visibility and order
- Show attacker names in Thievery & Spell Impacts (source identifier lines, hidden by default)

---

### Province Logs

Parses the Province Logs tab — the log of actions *your* province took.

**Tracked data:**
- **Thievery Summary**: all 16 sabotage operations with success/failure counts and impact totals; individual building counts for Greater Arson; resource totals for Rob the Granaries/Vaults/Towers; horse counts for Steal War Horses
- **Resources Stolen**: gold, runes, bushels
- **Spell Summary**: 22 offensive spell types with cast count, duration, and impact totals
- **Aid Summary**: resources sent to kingdommates (gold, runes, bushels, soldiers)
- **Dragon Summary**: dragon troop donations
- **Ritual Summary**: rituals started, completed, failed
- **Construction Summary**: buildings constructed
- **Science Summary**: books invested by field
- **Exploration Summary**: acres explored, explore costs
- **Military Training**: troops trained

**Output sections** (reorderable in Advanced Settings):

| Section | Default |
|---|---|
| Thievery Summary | visible |
| Resources Stolen | visible |
| Spell Summary | visible |
| Aid Summary | visible |
| Dragon Summary | visible |
| Ritual Summary | hidden |
| Construction Summary | hidden |
| Science Summary | hidden |
| Exploration Summary | hidden |
| Military Training | hidden |

**Advanced Settings options:**
- Section visibility and order
- Show/hide per-operation robbery counts and averages
- Show/hide failed thievery attempts
- Show/hide thief losses on successful ops
- Show/hide razed buildings, released troops
- Show/hide draft rate, draft percentage, military wages
- Show/hide exploration detail lines
- Show/hide per-operation averages

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
│   ├── parser.js                       # All parsing logic (~1,300 lines)
│   ├── ui.js                           # DOM manipulation and event handling
│   └── main.js                         # App initialization
├── tests/
│   ├── parser.test.js                  # HTML cleaning utility tests
│   ├── kingdom-news-log.test.js        # Kingdom News Log tests
│   ├── province-logs.test.js           # Province Logs tests
│   ├── province-news.test.js           # Province News tests
│   ├── Kingdom News original.txt       # Kingdom News test input (493 lines)
│   ├── Kingdom News Report target format.txt  # Expected Kingdom News output
│   ├── provincelogs.txt                # Province Logs test input (1,172 lines)
│   └── provincelogs_expected_output.txt
├── ProvinceNewsExample.txt             # Province News test input
├── Utopia Game Parser Requirements.md  # Game mechanics and parsing specs
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
```

### Test Coverage

| File | What it tests |
|---|---|
| `parser.test.js` | HTML tag removal, entity cleanup, whitespace and line break normalization |
| `kingdom-news-log.test.js` | Per-province attack counts, unique window algorithm, highlights |
| `province-logs.test.js` | Thievery, spells, aid, dragon, ritual parsing against 1,172-line real-world input |
| `province-news.test.js` | All Province News sections against real-world example file |

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
