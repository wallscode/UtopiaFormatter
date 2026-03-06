---
id: Uto-v8rp
status: closed
deps: []
links: []
created: 2026-02-25T03:27:06Z
type: bug
priority: 2
tags: [parser, kingdom-news, output, highlights]
---
# Kingdom News Highlights section: bounces missing and header shown unconditionally

Two related gaps in the Highlights section of `formatKingdomNewsOutput` in `js/parser.js`:

## 1. Bounces highlights not output

The requirements specify two bounce highlights:

> **Most bounces made**
> Format: "Most bounces made - [province number] - [province name]: [count]"
> If multiple provinces tie, list all separated by commas.
> If no bounces were made, show "Most bounces made - : 0"

> **Most bounces received**
> Format: "Most bounces received - [province number] - [province name], ...: [count]"
> If no bounces were received, this should not be shown.

The `data.highlights` object already has `mostBouncesMade` and `mostBouncesReceived` fields, but the output formatter (lines 1167–1181) never emits them. They need to be populated during parsing and written to output.

## 2. "Highlights" header printed even when no highlights exist

The header `output.push('Highlights')` is unconditional. If no attack data exists to produce any highlights, the output still contains a lone "Highlights" line. The header should only be written when at least one highlight line will follow.

## Changes required

- Populate `data.highlights.mostBouncesMade` and `data.highlights.mostBouncesReceived` during `parseAttackLine` when bounce attacks are processed
- In `formatKingdomNewsOutput`, emit "Most bounces made" (always, even if 0) and "Most bounces received" (only if count > 0) per the requirements
- Guard the `Highlights` header so it is only written when at least one highlight line will follow it

## Acceptance Criteria

- "Most bounces made" line always appears in Highlights when the section is shown
- "Most bounces received" line only appears when at least one bounce was received
- "Most bounces made - : 0" shown (per requirements) when no bounces were made but other highlights exist
- "Highlights" header is suppressed entirely if no highlight data exists
