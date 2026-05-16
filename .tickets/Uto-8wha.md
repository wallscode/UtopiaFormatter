---
id: Uto-8wha
status: closed
deps: []
links: []
created: 2026-05-16T12:25:41Z
type: task
priority: 2
assignee: Jamie Walls
---
# End-of-war detection for Attacker Impact Rankings

Detect when a war is in its final phase so that late-war land captures on thief/mage provinces are not penalised by the post-massacre land penalty (see linked ticket). Late-war land attacks on T/M provinces are considered acceptable strategy since the war is ending soon regardless. Two detection approaches to evaluate: (1) parse a 'WAR ENDS' or ceasefire line and treat the last N in-game days before it as late-war; (2) treat the final 8 in-game days of the parsed data window as late-war. The chosen approach should be surfaced as a configurable setting.

## Design

data.warPeriods and data.maxDateVal are already available in the parsed data object. The late-war window could be defined as maxDateVal - lateWarThreshold (default 8 in-game days). Alternatively, detect ceasefire or war-end events from data.ceasefireEntered / data.warsForced. The result should be a boolean flag or date threshold that formatAttackerImpactRanking can check when applying the post-massacre land penalty.

## Acceptance Criteria

A late-war threshold is computable from parsed data. The post-massacre land penalty (Uto-y6ky) is skipped for attacks that fall within the late-war window. A configurable lateWarWindow setting (in in-game days, default 8) appears in Advanced Settings.

