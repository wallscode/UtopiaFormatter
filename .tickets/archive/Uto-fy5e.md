---
id: Uto-fy5e
status: closed
deps: [Uto-9wce]
links: []
created: 2026-02-27T18:45:14Z
type: feature
priority: 2
tags: [logging, tooling, dx]
---
# Log analysis tool: group unrecognized lines and create parser tickets

Build a local Node.js script that pulls unrecognized-line logs from S3, groups them by normalised pattern, and interactively creates `tk` tickets for each group so parser gaps can be systematically addressed.

## Overview

The script lives at `scripts/analyze-logs.js` and is run locally by the developer. It has no browser component and no runtime dependency on the deployed site.

```
node scripts/analyze-logs.js
```

## Workflow

1. Syncs logs from S3 to a local `./logs/` cache directory
2. Parses all JSONL files under `./logs/`
3. Normalises each line to collapse numeric variation so lines differing only in numbers/kingdoms group together
4. Groups by normalised pattern, counts occurrences, tracks contexts (kingdom-news, province-logs, province-news)
5. Prints a ranked summary (most frequent first) with representative examples
6. Interactively prompts: for each group, create a ticket / skip / quit

## Line Normalisation

Normalise each raw line before grouping to cluster structurally identical lines that differ only in variable parts:

- Replace all sequences of digits with `N` (e.g. `captured 347 acres` → `captured N acres`)
- Replace kingdom identifiers `(N:N)` with `(K:K)`
- Collapse multiple spaces to one, trim

Two lines with the same normalised form are the same pattern. Keep the most-frequent raw example of each group to show in the summary and use as ticket description context.

## Output Format

```
=== Unrecognized Line Report ===
Logs synced: 1,243 events across 14 days

 #  Count  Context(s)          Pattern (example)
--  -----  ------------------  ------------------------------------------------
 1    142  kingdom-news        N - ProvinceName (K:K) pledged allegiance to...
 2     89  province-news       We have received N free explore pool acres from...
 3     41  province-logs       Our dragon has been redirected to (K:K)
...
```

## Interactive Ticket Creation

After displaying the summary, loop through each group and prompt:

```
[1/12] 142 occurrences — kingdom-news
  Example: "12345 - The Dark Citadel (4:1) pledged allegiance to our cause!"

  (c) create ticket  (s) skip  (q) quit  >
```

On `c`: call `tk create` with:
- **Title**: auto-generated from the normalised pattern, e.g. `Kingdom News parser: handle "pledged allegiance" event`
- **Description**: includes the example line, occurrence count, context, and a note that `logUnrecognizedLine` is already instrumented — this is a parsing gap to fill
- **Type**: feature
- **Tags**: parser, and the context name (e.g. kingdom-news)

On `s`: skip to next group.
On `q`: exit immediately.

## S3 Access

The script reuses the developer's local AWS CLI credentials (OIDC is not available locally). Bucket name is read from a `LOG_BUCKET` environment variable or a local `.env` file (gitignored). It is never hardcoded.

Example `.env` (gitignored):
```
LOG_BUCKET=utopia-parser-logs-xxxxxxxx
```

The sync command:
```bash
aws s3 sync s3://$LOG_BUCKET/logs/ ./logs/
```

## Deduplication

Store acknowledged patterns in `scripts/.analyzed-patterns.json` (gitignored). On startup, load this file and skip any groups whose normalised pattern is already present. After creating a ticket, append the pattern immediately so a crash mid-session does not cause duplicates.

## Flags

- `--no-sync` — skip the S3 sync and analyse whatever is already in `./logs/` (useful for repeated runs without re-downloading)

## Implementation Notes

- No external npm dependencies — use Node.js built-ins (`fs`, `readline`, `child_process`) only
- Ticket creation via `child_process.execSync` calling `tk create`
- The script reads all `*.jsonl` files recursively under `./logs/`

## Acceptance Criteria

- [ ] `node scripts/analyze-logs.js` syncs logs from S3 and prints ranked pattern summary
- [ ] Lines are normalised so numeric variants group together
- [ ] Groups sorted by frequency, most common first
- [ ] Each group shows count, context(s), normalised pattern, and one raw example
- [ ] Interactive prompt offers create / skip / quit for each group
- [ ] Ticket created via `tk create` with auto-generated title, example line, count, and context
- [ ] Bucket name read from LOG_BUCKET env var or .env file — never hardcoded
- [ ] `.env` and `scripts/.analyzed-patterns.json` are gitignored
- [ ] Previously acknowledged patterns are skipped on subsequent runs
- [ ] `--no-sync` flag skips S3 sync and uses local `./logs/` cache
- [ ] No npm dependencies — Node.js built-ins only
