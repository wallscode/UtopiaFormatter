---
id: Uto-w2yl
status: closed
deps: []
links: []
created: 2026-03-04T01:23:35Z
type: task
priority: 2
assignee: Jamie Walls
---
# Mobile Copy to Clipboard still produces single-line output after Uto-js60

After Uto-js60, desktop copy works correctly but mobile copy still produces single-line output when pasted into the WYSIWYG forum editor (see ForumPost.txt). The current implementation gates ClipboardItem with text/html behind an isMobile check, but iOS Safari does not support the text/html MIME type in ClipboardItem — the write either fails silently or falls back to writeText(), which gives plain text that the mobile forum editor collapses into a single line.

## Design

Replace the ClipboardItem path on mobile with a hidden contenteditable div + document.execCommand('copy'). This legacy API has broad iOS Safari support and writes HTML to the clipboard in a way that WYSIWYG editors accept. Steps: (1) Create a hidden off-screen div with contenteditable='true'. (2) Set its innerHTML to the output of textToHtml(text) — the existing helper that produces a <p> wrapper with <br> and &nbsp; entities. (3) Select all content in the div using a Range + window.getSelection(). (4) Call document.execCommand('copy'). (5) Clear the selection and remove the div. Use <p> wrapper with no explicit font-family or font-size in textToHtml() so the pasted content inherits the forum's default text styling rather than introducing a foreign font.

## Acceptance Criteria

1. On mobile (iOS Safari and Android Chrome), Copy to Clipboard button copies text that when pasted into the forum WYSIWYG editor preserves all line breaks and leading spaces. 2. The pasted text in the forum renders with the forum's default body font (not monospace, not a different size). 3. Desktop behavior is unchanged — plain text via navigator.clipboard.writeText(). 4. The fallbackCopyToClipboard() path remains for browsers with no clipboard API at all.

