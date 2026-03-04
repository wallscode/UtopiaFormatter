---
id: Uto-miij
status: closed
deps: []
links: []
created: 2026-03-03T02:32:50Z
type: feature
priority: 2
assignee: Jamie Walls
tags: [scripts]
---
# analyze-logs.js: delete downloaded log files after ticket creation phase

After Phase 3 (the interactive ticket creation loop) completes — whether the user finishes all patterns or quits early — the script should delete the .jsonl files it downloaded from S3 in Phase 2.

The files to delete are the entries in the `files` array built by `findJsonl(LOGS_DIR)` at the start of Phase 3. Deleting them keeps the local `logs/` directory clean and prevents old log events from being re-processed on the next run.

Behaviour:
- Only delete files after Phase 3 has run (not if Phase 3 is skipped due to no files/events).
- Delete all files in `files`, regardless of whether the user chose (c), (s), or (q) for each pattern — the session is considered complete once the interactive loop exits.
- If a file deletion fails, log a warning but do not abort.
- If --no-sync was used (files were not freshly downloaded), still delete them — the user opted in to processing them.

