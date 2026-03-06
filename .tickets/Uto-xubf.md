---
id: Uto-xubf
status: closed
deps: []
links: []
created: 2026-03-06T18:22:43Z
type: task
priority: 2
assignee: Jamie Walls
---
# Advanced Settings: Add Copy Buttons section with configurable copy options

Currently the Advanced Settings panel for all three parser views (Kingdom News, Province Logs, Province News) has a 'Show Copy for Discord button' toggle scattered in the Display Options section. This ticket consolidates copy-related toggles into a dedicated 'Copy Buttons' section and adds a new toggle to expose the alternative platform copy behaviour.

**Current copy behaviour recap:**
- Desktop Copy to Clipboard: copies plain text (no HTML formatting)
- Mobile Copy to Clipboard: copies HTML-formatted text (inline styles, <br> tags, &nbsp;) for pasting into WYSIWYG KD forum editors
- Copy for Discord: copies hybrid markdown-formatted text

**Changes required:**

1. Add a new 'Copy Buttons' adv-group-title section to the right column of Advanced Settings for all three parser views (Kingdom News, Province Logs, Province News).

2. Move the existing 'Show Copy for Discord button' toggle into this new section (remove it from Display Options). Default remains off.

3. Add a new toggle whose label is dynamic based on the user's device:
   - On mobile (window.innerWidth < 768 or touch detection): label = 'Show Copy Raw Text button'
   - On desktop: label = 'Show Copy Text for KD Forum on Mobile button'
   Default: off.

4. When the new toggle is enabled, render a new button in the output button-group:
   - On mobile: button labelled 'Copy Raw Text' — performs the plain-text copy path (same logic as the current desktop Copy to Clipboard, i.e. navigator.clipboard.writeText with no HTML formatting)
   - On desktop: button labelled 'Copy for Mobile' — performs the HTML copy path (same logic as the current mobile Copy to Clipboard, i.e. ClipboardItem with text/html and inline CSS formatting)

5. The new toggle state should be stored in advSettings for each parser (e.g. advSettings.kingdomNews.showAltCopy, advSettings.provinceLogs.showAltCopy, advSettings.provinceNews.showAltCopy) and the corresponding button shown/hidden via updateDiscordButtonVisibility or a new equivalent helper.

**Implementation notes:**
- The plain-text copy path is in handleCopy() — extract the core logic into a reusable copyPlainText(elements) helper.
- The HTML/mobile copy path is in handleCopy() behind the isMobile branch — extract into a reusable copyMobileHtml(elements) helper.
- handleDiscordCopy() already exists as a pattern to follow for the new button wiring.

## Acceptance Criteria

- All three parser views (Kingdom News, Province Logs, Province News) have a 'Copy Buttons' section in Advanced Settings right column
- 'Show Copy for Discord button' toggle has been moved into 'Copy Buttons' (no longer in Display Options)
- A new device-dynamic toggle is present in 'Copy Buttons', defaulting to off
  - On mobile the label reads 'Show Copy Raw Text button'
  - On desktop the label reads 'Show Copy Text for KD Forum on Mobile button'
- Enabling the new toggle shows the corresponding button in the output button group
  - Mobile: 'Copy Raw Text' button copies plain text (no HTML formatting)
  - Desktop: 'Copy for Mobile' button copies HTML-formatted text with inline styles
- Disabling either toggle hides the corresponding button
- Both new copy paths produce correct output (verified by copying and pasting into a plain text editor and a WYSIWYG editor respectively)
- Existing Copy to Clipboard and Copy for Discord buttons are unaffected
- All toggle states default to off

