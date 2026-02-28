---
id: Uto-kcop
status: open
deps: [Uto-uv71, Uto-vjyl]
links: []
created: 2026-02-28T20:14:08Z
type: task
priority: 2
assignee: Jamie Walls
---
# Copy for Discord button with hybrid markdown formatting

Add a **Copy for Discord** button that transforms the current output into
Discord-flavoured markdown before copying. The button is hidden by default and
must be enabled per-mode via a checkbox in Advanced Settings.

---

## UI changes

### index.html
Add a second button next to the existing "Copy to Clipboard" button and a
separate feedback element for it:

```html
<button id="discord-copy-btn" class="hidden">Copy for Discord</button>
<div id="discord-copy-feedback" class="feedback hidden"></div>
```

The Discord feedback `<div>` sits separately from `copy-feedback` so both can
display at the same time without conflict.

### js/main.js
Register `'discordCopyBtn'` and `'discordCopyFeedback'` in the DOM element list
alongside the existing `'copyBtn'` and `'copyFeedback'`.

### js/ui.js — getDomElements()
Add `discordCopyBtn` and `discordCopyFeedback` to the returned object.

### js/ui.js — Advanced Settings (per mode)
Add a "Copy for Discord" checkbox to the **Display Options** group in each of
the three mode renderers:

```javascript
// advSettings initialisation — add to each mode:
advSettings.provinceNews.discordCopy  = false;
advSettings.provinceLogs.discordCopy  = false;
advSettings.kingdomNews.discordCopy   = false;
```

When the checkbox is toggled, call `applyAndRerender(elements)` which should
also re-evaluate Discord button visibility (see below).

### js/ui.js — button visibility
After every parse and after every Advanced Settings change, show or hide
`discordCopyBtn` based on the current mode's `discordCopy` flag:

```javascript
function updateDiscordButtonVisibility(elements, mode) {
    const show = mode && advSettings[mode] && advSettings[mode].discordCopy;
    elements.discordCopyBtn.classList.toggle('hidden', !show);
}
```

Call this at the end of `handleParse` and `applyAndRerender`.

### js/ui.js — handleDiscordCopy()
Wire `discordCopyBtn` click to a new `async function handleDiscordCopy(elements)`:

1. Read the current output text from `elements.outputText.value`.
2. Transform it with `toDiscordFormat(text, lastDetectedMode)`.
3. If the transformed text is over 2,000 characters, show a warning in
   `discordCopyFeedback`: `"Copied! (⚠ ${charCount} chars — Discord limit is 2,000)"`.
   Otherwise show `"Copied for Discord!"`.
4. Copy the transformed text to clipboard using the same
   `navigator.clipboard.writeText` / `fallbackCopyToClipboard` pattern as
   `handleCopy`.

---

## Discord transform logic

Implement `function toDiscordFormat(text, mode)` that dispatches to a
mode-specific helper. Each helper receives the already-settings-applied plain
text (the same text currently in the output textarea) and returns Discord
markdown.

### General transform rules (shared)

| Input pattern | Discord output |
|---|---|
| First line (report title) | `**Title**` |
| Lines ending in `:` that are flush-left (section headings) | `**Heading:**` |
| `** Block Header **` (Kingdom News `** ... **` blocks) | `**Block Header**` |
| `-- Key: value` lines (Kingdom News summary stats) | `Key: value` (strip `-- `) |
| Lines starting with `    ` (4-space, source sub-items after Uto-uv71/Uto-vjyl) | `- stripped text` |
| Lines starting with `  ` (2-space detail lines after Uto-uv71/Uto-vjyl) | plain text (strip 2 spaces) |
| Empty lines | preserved |

### Province News (`toDiscordProvinceNews`)

The section heading line and the first detail line on sections like
"Attacks Suffered" and "Thievery Impacts" are on the same line
(`Attacks Suffered: 3 (156 acres lost)`). Bold the whole line since it
acts as both heading and summary.

Example output:
```
**Province News Report** — February 1 of YR1 - February 4 of YR3

**Daily Login Bonus:**
205 acres · 1,234 gold coins · 5,678 science books

**Scientists Gained:**
Economy: 2 · Military: 1

**Aid Received:**
1,234 gold coins
166 explore pool acres (84 lost in transit)

**Thievery Impacts:** 5 operations detected (2 from unknown sources)
- SomeKingdom (3:1): 3
3 operations intercepted by Shadowlight
- OtherKingdom (2:2): 3
1,344 gold coins stolen · Incite Riots: 2 occurrences, 10 days

**Spell Impacts:** 5 attempts
- Province1 (1:1): 3 · Province2 (2:2): 2
Meteor shower: 3 days, 150 total casualties (peasants: 100)
Pitfalls: 3 occurrences, 35 days

**Shadowlight Thief IDs:**
- Arancini (2:4) · 10_Kentucky (3:3) · Flandern (3:3)

**Attacks Suffered:** 3 (156 acres lost)
- Odd-lympics (3:7): 56 acres · SomeProvince (2:3): 100 acres

**War Outcomes:**
Land given up: 90 acres (30 to enemies, 60 redistributed)
Resources received: 1,140 building credits, 22,152 science books
```

Notes:
- **Short, flat lists** (Shadowlight Thief IDs, minor resource lines) can be
  joined with ` · ` to reduce line count and stay within Discord's 2,000-char
  limit where possible. Use judgment — don't join more than 3–4 items or
  anything that would be hard to read on one line.
- The **date line** moves to the end of the title line separated by ` — `.

### Kingdom News (`toDiscordKingdomNews`)

The province breakdown table uses space-padded columns that only read cleanly
in monospace. Wrap each such block in a code fence:

````
**Own Kingdom 5:1 Summary**
Total Attacks Made: 279 (8,091 acres)
Trad March: 267 (7,959 acres) · Ambush: 4 (114 acres) · Bounces: 1 (0%)
Dragons Started: 3 (Ruby, Topaz, Topaz) · Rituals Started: 2
Total Attacks Suffered: 196 (6,959 acres)
Uniques: 82 · Trad March: 181 (6,800 acres) · Bounces: 4 (2%)

**Own Kingdom 5:1**
```
   219 | 2 - your time is up Give in (8/2)
   216 | 4 - Waste of Time (11/2)
   ...
```

**Uniques for 5:1**
12 - Misstress Of Time: 6 · 3 - RazorclawTime: 6 · 7 - Slow Attack times: 6 · ...

**Highlights**
Most land gained (trad march): 1 - Time to Shine — 67 acres
Most land lost (trad march): 10 - Timeless Rock Band — 81 acres
````

Notes:
- Province breakdown blocks (`** Own Kingdom X **` and `** The Kingdom of Y **`)
  are detected by the presence of ` | ` column separators and wrapped in
  ```` ``` ```` code fences.
- Summary stat lines (`-- Key: value`) are stripped of `-- ` and formatted as
  plain text; short ones may be joined with ` · `.
- Uniques lists are joined with ` · ` up to 5–6 entries per line.

### Province Logs (`toDiscordProvinceLogs`)

```
**Province Log Summary**

**Thievery Summary:**
5 Arson for a total of 2 acres · 3 Bribe Generals ops
**Propaganda:**
- 100 elites · 50 soldiers
2 failed thievery attempts (1 thieves lost)

**Resources Stolen:**
12,345 gold coins · 890 runes · 50 war horses

**Spell Summary:**
4 Pitfalls for a total of 14 days · 2 Greed for a total of 8 days

**Aid Summary:**
50,000 gold coins · 1,200 runes

**Dragon Summary:**
25,000 gold coins donated · 500 troops sent and weakened by 1,200 points

**Construction Summary:**
10 farms · 5 guilds · 2 towers razed

**Science Summary:**
5,000 books to Bookkeeping · 3,000 books to Tools

**Exploration Summary:**
150 acres explored · 3,000 soldiers sent at a cost of 45,000 gold coins

**Military Training:**
500 Archers · 200 Elf Lords released · Draft: 15% · Wages: 100%
```

Notes:
- Flat, short resource/stat lines within a section are joined with ` · `.
- `Propaganda:` is treated as a sub-heading (bold) with its troop breakdown
  as a single joined `- ` bullet line.
- The Military Training settings lines (Draft %, Draft rate, Military wages)
  are condensed onto one line.

---

## Character limit handling

Discord's per-message limit is **2,000 characters** (4,000 for Nitro).
The app has no way to detect the user's Nitro status, so always warn at 2,000.

- If `transformedText.length <= 2000`: feedback = `"Copied for Discord!"`
- If `transformedText.length > 2000`: feedback =
  `"Copied for Discord ⚠ ${charCount.toLocaleString()} chars (Discord limit: 2,000)"`
  and show the feedback in a warning style (yellow, matching the existing
  `showCopyFeedback` warning state).

---

## CSS

Add a style for `#discord-copy-btn` that distinguishes it visually from the
plain "Copy to Clipboard" button — a muted blue-purple tint to hint at Discord's
brand colour without being garish.

---

## Tests

No automated tests required for the transform functions, but manually verify
the output for all three modes in Discord (or a Discord markdown previewer)
before closing the ticket.
