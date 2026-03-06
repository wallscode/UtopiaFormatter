---
id: Uto-a40i
status: closed
deps: []
links: []
created: 2026-03-03T23:19:57Z
type: bug
priority: 1
assignee: Jamie Walls
tags: [ui, mobile]
---
# Mobile copy: preserve line breaks and spacing when pasting into WYSIWYG forum editor

When using Copy to Clipboard on mobile and pasting into the Utopia forum's WYSIWYG editor, all newlines and leading spaces are stripped. The entire output collapses to a single line of text. The same paste on desktop works correctly.

Evidence:
- ForumPost.txt — the result of a mobile paste: all content on one line, no newlines or indentation
- PageSource831.html line 831 — the result of a desktop paste (inside <td><p>): newlines and spacing fully preserved

Root cause:
The current handleCopy() function calls navigator.clipboard.writeText(text), which writes only text/plain to the clipboard. Mobile WYSIWYG editors (including the Utopia forum editor on iOS/Android) interpret plain-text clipboard content as a single run of text, stripping newlines and collapsing whitespace. Desktop browsers handle plain-text paste more conservatively and preserve newlines. The fallbackCopyToClipboard() path has the same issue.

Fix — write both text/html and text/plain using ClipboardItem:

The HTML representation must convert the plain text so that a WYSIWYG editor receiving it as HTML will see the correct structure:
  - Escape HTML special characters (&, <, >)
  - Convert each \n to <br>
  - Convert sequences of leading spaces on a line to &nbsp; (preserves column alignment in the per-province rows)
  - Wrap in <pre style="font-family:monospace;white-space:pre-wrap"> so the browser signals preformatted content

Implementation in handleCopy() (js/ui.js):

  function textToHtml(text) {
      return '<pre style="font-family:monospace;white-space:pre-wrap">' +
          text
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/\n/g, '<br>')
              .replace(/(^|<br>)([ ]+)/g, (_, br, spaces) => br + '&nbsp;'.repeat(spaces.length)) +
          '</pre>';
  }

Primary copy path (where navigator.clipboard.write and ClipboardItem are supported):
  const htmlBlob  = new Blob([textToHtml(outputText)], { type: 'text/html' });
  const textBlob  = new Blob([outputText],              { type: 'text/plain' });
  await navigator.clipboard.write([new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob })]);

Fallback path (when ClipboardItem is not available, fall back to writeText):
  await navigator.clipboard.writeText(outputText);

The same textToHtml() conversion and ClipboardItem approach should be applied to the Discord copy path (handleDiscordCopy) for consistency.

Browser support: ClipboardItem is available in Chrome 76+, Firefox 87+, Safari 13.1+ — all current mobile browsers. The writeText() fallback covers any edge cases.

The fallbackCopyToClipboard() function (execCommand path) already uses white-space:pre on the hidden textarea and is less likely to be reached on modern mobile, but no changes are needed there.

