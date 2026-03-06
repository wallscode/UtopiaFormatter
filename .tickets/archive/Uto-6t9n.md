---
id: Uto-6t9n
status: closed
deps: []
links: []
created: 2026-03-04T02:17:27Z
type: task
priority: 2
assignee: Jamie Walls
---
# Mobile copy: write plain text with <br> and &nbsp; for the HTML-aware mobile editor

## Background & Evidence

Five approaches tried so far, all failing for different reasons:
1. Uto-a40i: ClipboardItem + <pre><br> for all devices — desktop stored <pre><br> (ClipboardItem DOES write HTML to forum), but caused monospace font and overflow on desktop.
2. Uto-js60: ClipboardItem + <p> for mobile — mobile still single-line; <p> with literal newlines collapses on mobile.
3. Uto-w2yl + Uto-vwyy: contenteditable+execCommand — PageSource1238.html proves iOS Safari execCommand copies plain text only; HTML never reaches the forum.

## New findings (confirmed by direct testing)

**Mobile forum editor is HTML-aware; desktop forum editor is plain-text:**
- On mobile: manually typing `<br>` in the forum text box renders as a line break in the submitted post.
- On mobile: pressing Enter (actual newline) shows in the text box but is stripped on submission.
- On desktop: manually typing `<br>` appears as the literal text `<br>` in the submitted post.
- On desktop: pressing Enter produces a preserved line break in the submitted post.

This explains all prior failures:
- Plain text with `\n` newlines → mobile strips them on submit → single line.
- Any clipboard approach that delivers actual newlines (writeText, execCommand) → same stripping.
- ClipboardItem text/html → even if the forum receives HTML, its mobile submission layer strips plain newlines and may strip HTML structure too.

## Root cause

The mobile Utopia forum editor interprets pasted content as HTML. Real newlines (`\n`) are stripped on submit. HTML tags like `<br>` and `&nbsp;` are interpreted and preserved.

## Design

Replace the entire mobile path in `writeToClipboard()` with a simple `navigator.clipboard.writeText()` call, but transform the text first so it uses HTML markup instead of whitespace characters:
- Replace `\n` with `<br>`
- Replace runs of leading spaces on each line with equivalent `&nbsp;` entities

No ClipboardItem, no contenteditable div — just plain text that the mobile editor treats as HTML markup.

Desktop path unchanged: `navigator.clipboard.writeText(text)` with real newlines.

The existing `textToHtml()` helper already produces the correct inner content (escaped HTML entities, `<br>` for newlines, `&nbsp;` for spaces). Extract that transformation for re-use, or inline it in `writeToClipboard()`. The `<pre>` wrapper is not needed — just the raw transformed text string.

## Acceptance Criteria

1. On mobile iOS Safari, Copy to Clipboard copies text that when pasted into the forum WYSIWYG editor renders with correct line breaks and indentation.
2. Leading-space alignment (the acreage columns) is preserved on mobile.
3. Desktop behavior unchanged — plain text with real newlines, renders correctly as before.
4. No ClipboardItem or contenteditable elements used in the mobile path.
