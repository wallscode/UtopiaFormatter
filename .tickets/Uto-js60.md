---
id: Uto-js60
status: closed
deps: []
links: []
created: 2026-03-03T23:32:19Z
type: bug
priority: 1
assignee: Jamie Walls
tags: [ui, mobile]
---
# Copy clipboard: revert to plain text on desktop, fix HTML format for mobile

Uto-a40i introduced ClipboardItem with text/html for all devices. On desktop this broke forum posts: the WYSIWYG editor accepted the HTML content and stored it as a literal <pre> tag, causing:
  1. Monospace font — different from all other forum posts (which use <p>)
  2. No word-wrap — content overflows beyond the forum column borders

Evidence: PageSource1121.html line 1121 shows the post stored as:
  <pre>Kingdom News Report...<br>...<br>...</pre>
Compared to PageSource831.html line 831 (correct, pre-fix):
  <p>Kingdom News Report...
  (real newlines preserved)
  ...</p>

Desktop was already working correctly before Uto-a40i — the forum editor handled plain text paste and stored it in <p> with newlines. Only mobile needs the HTML clipboard approach (mobile WYSIWYG editors strip newlines from plain text).

Fix — two changes to writeToClipboard() in js/ui.js:

1. Gate the ClipboardItem / text/html path on mobile detection only:
     const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
     if (isMobile && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
         // write text/html + text/plain via ClipboardItem
     } else if (navigator.clipboard && navigator.clipboard.writeText) {
         await navigator.clipboard.writeText(text);  // desktop: plain text as before
     } else {
         fallbackCopyToClipboard(text);
     }

2. Change textToHtml() wrapper from <pre> to <p> so the mobile HTML paste
   produces a <p> tag (matching existing forum posts) instead of a <pre> tag:
     return '<p>' + formatted + '</p>';
   (Remove the font-family/white-space style attributes — <p> + <br> + &nbsp;
   is sufficient and matches the forum's native structure.)

No changes needed to fallbackCopyToClipboard() or the discord copy path structure.

