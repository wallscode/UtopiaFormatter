---
id: Uto-htd9
status: closed
deps: []
links: []
created: 2026-02-28T18:00:41Z
type: feature
priority: 2
tags: [github, issues, scripts, ui, footer]
assignee: Jamie Walls
---
# GitHub Issues integration: pull issues into tickets, comment on fix, close on deploy, website link

## Overview

Integrate GitHub Issues into the existing `scripts/analyze-logs.js` workflow so that one run handles both sources. Issues are prompted first, then log patterns. When a ticket linked to an issue is closed, post the fix commit as a comment and close the issue on GitHub.

Tooling: use the `gh` CLI (GitHub CLI) throughout — it handles auth and is already available in the project environment.

---

## Part 1 — Pull issues and create tickets (analyze-logs.js)

### Ordering

When `analyze-logs.js` runs, the new order is:
1. **GitHub Issues phase** (new) — fetch open issues, prompt to create tickets
2. **S3 log sync** (existing)
3. **Unrecognized line analysis** (existing)

### Fetching issues

Use the `gh` CLI to list open issues:

```
gh issue list --state open --json number,title,body,labels,createdAt
```

Display each issue with its number, title, and body (truncated to ~10 lines if long), then prompt:

```
[GitHub Issue #42] "Province News: Propaganda section wrong count"
  Body: "When I paste province news I see..."

  (c) create ticket  (s) skip  (a) acknowledge (no ticket)  (q) quit issues  >
```

Choices:
- **c** — create a `tk` ticket (title prefixed with `GH#<number>: `, body includes the issue URL and full body), record the mapping, then comment on the GitHub issue confirming the ticket ID
- **s** — skip this issue for now (reappears next run)
- **a** — acknowledge without creating a ticket (won't reappear)
- **q** — stop processing issues and move on to the log phase

### Issue–ticket mapping

Persist a mapping of GitHub issue number → tk ticket ID in `scripts/.github-issue-map.json` (gitignored). Format:

```json
{
  "42": "Uto-xxxx",
  "17": "Uto-yyyy"
}
```

Skip issues already present in the map (already have a ticket). Also skip issues whose linked tk ticket is already closed.

### Ticket format created from an issue

```
Title:       GH#42: Province News: Propaganda section wrong count
Type:        bug
Priority:    2
Tags:        github-issue
Description:
  GitHub Issue: https://github.com/wallscode/UtopiaFormatter/issues/42

  <full issue body text here>
```

---

## Part 2 — Comment on fix commit and close issue

When a `tk` ticket that is linked to a GitHub issue is closed, the workflow should:

1. Find the most recent commit on `main` (or the commit the user specifies) that addresses the fix
2. Post a comment on the GitHub issue:

```
gh issue comment <number> --body "Fixed in commit <sha>: <commit message>

Ticket: <tk-id>
Fix will be live after the next deployment."
```

3. After user confirmation, close the GitHub issue:

```
gh issue close <number>
```

### Trigger

Add a `--close-issues` flag to `analyze-logs.js`:

```
node scripts/analyze-logs.js --close-issues
```

This phase:
- Reads `.github-issue-map.json`
- For each entry, checks if the linked `tk` ticket is `closed`
- If the ticket is closed and the GitHub issue is still open, shows the issue title and prompts the user to confirm before commenting and closing
- Marks the entry as fully resolved in the map so it is not re-prompted

`--close-issues` can be combined with a normal run or used standalone. When combined, the close phase runs after the unrecognized line analysis.

---

## Part 3 — Website footer link

In `index.html`, update the footer to include a link to GitHub Issues:

```html
<footer>
    <p>&copy; 2026 UtopiaFormatter — Built for improving collaboration in the Utopia Kingdom Forum</p>
    <p class="footer-issues">Found a bug or want a feature? <a href="https://github.com/wallscode/UtopiaFormatter/issues" target="_blank" rel="noopener">Submit an issue on GitHub</a></p>
</footer>
```

Style the link in `css/main.css` to match the footer color scheme — muted by default (`color: #7a8290`), `#8aafc8` on hover.

---

## Implementation touch points

- `scripts/analyze-logs.js` — prepend GitHub Issues phase to `main()`; add `--close-issues` and `--no-issues` flags; reorder prompt flow
- `scripts/.github-issue-map.json` — new file (gitignored)
- `.gitignore` — add `scripts/.github-issue-map.json`
- `index.html` — footer update
- `css/main.css` — footer link styling

## Notes

- `gh` CLI must be authenticated (`gh auth login`). The script should check upfront with `gh auth status` and exit with a clear message if not authenticated.
- `--no-sync` skips S3 sync but GitHub Issues are still fetched (independent sources). Add `--no-issues` to skip the GitHub Issues phase entirely.
- Issue body may contain Markdown — display as plain text in the terminal (strip `#`, `**`, etc. or display raw).
- Do not auto-close issues without explicit user confirmation per issue.
- The `gh issue comment` on ticket creation (Part 1) should say something like: "Tracked as ticket Uto-xxxx — working on it."
