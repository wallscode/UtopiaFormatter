---
id: Uto-vwyy
status: closed
deps: []
links: []
created: 2026-03-04T02:02:27Z
type: task
priority: 2
assignee: Jamie Walls
---
# Mobile copy renders as single line — fix by using <pre> with inheriting inline CSS

After Uto-w2yl, the contenteditable+execCommand approach successfully copies all content to the clipboard and the forum stores it correctly (PageSource1238.html shows proper newlines and indentation). However the forum wraps the content in a bare <p> tag, and on mobile Safari there is no white-space: pre-wrap CSS applied to the post area, so all the literal newlines are collapsed to spaces — producing single-line output (ForumPost.txt). Desktop works because the desktop forum view applies white-space preservation CSS that the mobile view does not. The clipboard mechanism itself is fine; the issue is what HTML structure gets stored. We already know from Uto-a40i that the forum preserves <pre> tags in post content (PageSource1121.html showed <pre><br> structure). The problems with that attempt were (1) monospace font and (2) horizontal overflow beyond forum margins — both caused by the default <pre> CSS. Both are fixable with inline CSS.

## Design

Change textToHtml() to wrap in <pre> instead of <p>, with inline CSS to override the two known problems: (1) font-family: inherit — uses the forum's surrounding font instead of monospace; (2) white-space: pre-wrap — preserves newlines AND wraps long lines (unlike white-space: pre which overflows); (3) overflow-wrap: break-word — prevents very long tokens from causing horizontal overflow. The resulting tag: <pre style="font-family:inherit;font-size:inherit;white-space:pre-wrap;overflow-wrap:break-word;">. The contenteditable+execCommand mechanism in writeToClipboard() stays the same — it successfully copies the content. The difference is that <pre> is stored by the forum as a <pre> element (confirmed from PageSource1121.html), and <pre> with white-space:pre-wrap renders newlines correctly on all devices regardless of the forum's surrounding CSS. The forum may strip inline styles; if so, the post will appear in monospace (acceptable fallback) but will at least have correct line breaks.

## Acceptance Criteria

1. On mobile iOS Safari, Copy to Clipboard button copies text that when pasted into the forum WYSIWYG editor renders with correct line breaks and indentation on mobile. 2. The pasted text renders with the forum's default body font (not monospace) — confirmed by visually comparing to adjacent posts. 3. The text does not overflow the post border / forum margins. 4. Desktop behavior unchanged (plain text via writeText()).

