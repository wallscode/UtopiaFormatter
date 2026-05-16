---
id: Uto-y6ky
status: open
deps: []
links: []
created: 2026-05-16T12:25:31Z
type: task
priority: 2
assignee: Jamie Walls
---
# Post-massacre land attack penalty in Attacker Impact Rankings

Land captures on a province within N in-game days of it receiving a massacre attack should receive a reduced impact score. When an attacker massacres a thief/mage province and then another attacker takes land from it shortly after, the land capture is considered counterproductive (land attacks on a T/M province shrink it, increasing their mages/thieves-per-acre ratio). This penalty should be configurable via a new weight (e.g. postMassacreLandMultiplier, default ~0.3) and a window setting (e.g. postMassacreWindow, default 3 in-game days). Requires end-of-war detection (see linked ticket) to avoid penalising legitimate late-war land captures on T/M provinces.

## Design

The attack records (data.attackRecords) added in Uto-8w3l already include dateVal, type, and per-attacker/defender keys, so the data is available. Implementation: in formatAttackerImpactRanking, build a per-defender map of massacre dates; for each capture attack on a chain-threshold or T/M province, check if a massacre occurred within the postMassacreWindow; if so, multiply the attack value by postMassacreLandMultiplier. Add two new weight fields to the Impact Ranking Weights Advanced Settings section.

## Acceptance Criteria

New weight fields postMassacreLandMultiplier and postMassacreWindow appear in Advanced Settings. Setting postMassacreLandMultiplier to 1.0 disables the penalty. A unit test verifies a land capture within the window scores lower than one outside it. End-of-war exclusion is handled by the linked end-of-war detection ticket.

