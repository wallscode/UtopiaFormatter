---
id: Uto-szsj
status: closed
deps: []
links: []
created: 2026-03-04T12:26:06Z
type: task
priority: 2
assignee: Jamie Walls
---
# Repo cleanup: delete files with no remaining purpose

Review every tracked file in the repo and delete any that no longer serve a purpose. A file should be deleted if it is: dead code (not loaded by index.html and not used by tests), leftover dev scaffolding that has been superseded, or test artifacts that were committed by mistake.

## Candidates identified

**Definite deletes:**
- `test-output.txt` — committed test artifact, ignored in .gitignore by pattern but still tracked. No purpose now that tests produce their own output.
- `git-workflow.sh` — dev scaffolding of basic git commands. Has no project-specific content; superseded by CLAUDE.md and normal git usage.
- `git-automation.md` — similar scaffolding doc of generic git/gh CLI tips. No project-specific value.
- `setup-git.sh` — one-time repo initialisation script (git init, gh repo create, etc.). Repo is long since initialised; this is dead.
- `OutputExampleFromOldFormatter.txt` — example output from the old formatter. No test references it; the new target format file in tests/ supersedes it.

**Review carefully before deciding:**
- `js/logsparse.js` — 360-line old version of the province-logs parser. CLAUDE.md notes it is not used by tests. Verify it is not loaded by index.html and not imported anywhere; if so, delete.
- `ProvinceNewsExample.txt` — 236-line Province News example. Check whether any test references it. If it is pure dev reference with no test usage, delete or move to tests/.
- `scripts/analyze-logs.js` — 533-line Node script for syncing S3 unrecognised-line logs and creating tk tickets. The logUnrecognizedLine feature was removed (security ticket Uto-7lc6). Verify that it still has any value; if the log endpoint is gone or the feature removed, delete.

**Keep (confirmed useful):**
- `js/config.example.js` — developer reference for creating the gitignored `js/config.js`. Keep.
- `infra/template.yaml` — CloudFormation / SAM template for AWS infrastructure. Keep.
- `lambda/log-handler.mjs` — Lambda function source. Keep (used by infra).
- `tests/provincelogs_expected_output.txt` — used by province-logs test. Keep.
- `Utopia Game Parser Requirements.md` — spec document. Keep.
- All `.tickets/` files — issue history. Keep.
- All favicon/PWA assets — used by index.html. Keep.

## Acceptance Criteria

1. All confirmed-dead files are deleted from the repo. 2. No file used by index.html, tests, or CI is removed. 3. Changes committed and pushed.

