---
id: Uto-t7od
status: closed
deps: []
links: []
created: 2026-03-06T18:52:16Z
type: task
priority: 2
assignee: Jamie Walls
---
# Project documentation: create living spec, archive closed tickets, reorganise docs

The project has matured to a stable, feature-complete state. All future work will be done with Claude Code agents. The current documentation approach — closed tickets acting as requirements history — is noisy and hard for agents to parse. This ticket reorganises documentation into a clean present-tense spec that agents can read efficiently.

## Tasks

### 1. Create docs/ folder and move existing requirements file
- Create the docs/ directory
- Move `Utopia Game Parser Requirements.md` from the repo root into `docs/Utopia Game Parser Requirements.md`
- Update the reference to it in CLAUDE.md (currently points to the root path)

### 2. Create docs/spec.md
A living present-tense behavioural spec covering everything the app currently does. Written for AI agents — structured, specific, and testable. Sections should include:
- Input detection (how detectInputType works, what triggers each mode)
- Kingdom News parser: output format, attack types, sections, unique window algorithm
- Province Logs parser: output format, all tracked categories, section list
- Province News parser: output format, all tracked categories
- Combined Province Summary: when it triggers, how the two inputs are merged
- Advanced Settings: per-parser toggles and what each one does
- Copy button behaviours: standard, Discord, alt copy (plain text vs mobile HTML)
- UI layout and interaction rules (secondary input toggle, auto-detect badge, keyboard shortcuts)
- Key design decisions that must not be undone (e.g. no build step, module.exports pattern, dark-mode only)

### 3. Update CLAUDE.md
- Add reference to docs/spec.md as the behavioural spec
- Update the path reference for Utopia Game Parser Requirements.md
- Keep CLAUDE.md focused on how to work in the codebase; let docs/spec.md own what the app does

### 4. Archive closed tickets
- Create .tickets/archive/ directory
- Move all closed tickets from .tickets/ into .tickets/archive/
- Leave only open tickets in .tickets/ (plus any README or index file if useful)
- Delete Uto-9djf.md and remove the reference from .gitignore

### 5. CI/CD pipeline — docs/ folder
- docs/ is developer documentation and should NOT be added to the S3 sync in deploy.yml (it is not site content)
- docs/ will be tracked by git automatically once files exist in it — no pipeline change needed for git
- Add a comment to deploy.yml near the sync allowlist noting that docs/ is intentionally excluded from S3 sync

## Acceptance Criteria

- docs/ directory exists and is committed to git
- docs/spec.md exists and covers all parser behaviours, Advanced Settings toggles, copy behaviours, UI rules, and key design decisions in present tense
- docs/Utopia Game Parser Requirements.md exists (moved from repo root)
- CLAUDE.md references both docs/spec.md and the new path for Utopia Game Parser Requirements.md
- All closed tickets have been moved to .tickets/archive/
- Only open tickets remain in .tickets/ root
- deploy.yml has a comment confirming docs/ is intentionally excluded from S3 sync
- No docs/ files are added to the S3 sync allowlist in deploy.yml

