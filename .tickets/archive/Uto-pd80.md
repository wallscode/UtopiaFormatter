---
id: Uto-pd80
status: closed
deps: []
links: []
created: 2026-02-27T12:18:24Z
type: feature
priority: 2
tags: [parser, kingdom-news, ui, advanced-settings, filtering]
---
# Kingdom News: War Only filter in Advanced Settings

Add a **War Only** toggle to the Advanced Kingdom News Settings panel. When active, the summary is restricted to attacks and dragon events that:

1. Involve the kingdom our kingdom was at war with, AND
2. Fall within the war's active time window

Events involving non-war kingdoms and events outside the war window are excluded from all counts, acreage totals, per-province summaries, and highlights.

## War Detection

The parser must scan the raw news for two sentinel strings to detect a war and determine its time window.

### War start event
Any line containing `"declared WAR"`.

Two forms occur:
- `"<Kingdom Name> (<X:Y>) declared WAR on us!"` — an enemy kingdom declared on us
- `"We have declared WAR on <Kingdom Name> (<X:Y>)!"` — we declared on them

In both forms the opposing kingdom's identifier `(X:Y)` is present and must be extracted. This identifier is the **war opponent**.

### War end event
Any line containing `"Our kingdom is now in a post-war period"`.

When this line is present, the **event that immediately precedes it** in the log also identifies the war opponent (the last combat event of the war). Use the war start event as the primary source for the opponent identifier; fall back to extracting the opponent from the preceding event only when no start event is present in the log.

### Conditional UI display

The **War Only** option is only shown in the Advanced Kingdom News Settings panel if the parsed news contains **at least one** war start or war end event. If neither is detected, the option is hidden entirely — do not show a disabled/greyed-out state, just hide it.

## Time Window Logic

All four combinations of start/end event presence must be handled:

| War Start in log | Post-War in log | Active war window |
|---|---|---|
| Yes | Yes | start event date → post-war event date (exclusive) |
| Yes | No | start event date → end of log (war assumed ongoing) |
| No | Yes | beginning of log → post-war event date (exclusive) |
| No | No | War not detected — option not shown |

"Exclusive" on the post-war date means: any event on the same date/tick as the post-war message is considered post-war and excluded.

Events that occur on the same date as the war start event are considered **inside** the war window and are kept.

## Filtering Rules When War Only Is Active

Apply all three filters simultaneously. Remove an event if it fails **any** of them:

### Filter 1 — Time window
Remove events whose date falls before the war start event (when a start event exists) or on/after the post-war event (when a post-war event exists).

### Filter 2 — Kingdom scope
Remove attacks where **neither** the attacker kingdom **nor** the defender kingdom matches the war opponent's `X:Y` identifier. Own-kingdom attacks on the opponent and opponent attacks on our kingdom both pass this filter.

### Filter 3 — Dragon scope
Remove dragon events that were not directed against the war opponent (and opponent dragon events not directed against our kingdom).

## Opponent Identification

The war opponent is identified by their kingdom `X:Y` coordinate string (e.g. `"4:1"`), not by name (names can change mid-war). Use the coordinate for all matching.

**Source priority:**
1. War start event — extract `(X:Y)` from the "declared WAR" line
2. Event immediately before the post-war message — extract `(X:Y)` from that line (fallback when no start event is in the log)

If a coordinate cannot be determined from either source, treat the war as unidentified: show the War Only option but display a warning in the output that the war opponent could not be identified, and do not filter anything.

## Multiple War Periods

If the log contains more than one war start/end pair (the log spans multiple wars), apply the filter to **all detected war periods** independently and retain events that fall within any of the war windows and involve the corresponding opponent. Each war period may have a different opponent.

This is an uncommon case; a clear implementation is more important than an optimised one.

## Output Changes

When War Only is active, add a header line to the Kingdom News output indicating the filter is applied:

```
[War Only] Showing attacks vs. <Kingdom Name> (<X:Y>) — <start date> to <end date or "present">
```

If the opponent name cannot be determined, omit the name: `vs. (<X:Y>)`.

If the time window is open-ended (no post-war event), write `"to present"`.

## UI Placement

Place the War Only checkbox below the existing Kingdom News advanced options (unique attack window, etc.), with a label such as:

```
[ ] War Only — show attacks involving war opponent only
```

The checkbox is unchecked by default. It only renders when war events are detected (see Conditional UI Display above).

## Acceptance Criteria

- [ ] Parser detects `"declared WAR"` and `"Our kingdom is now in a post-war period"` events and extracts dates and opponent `X:Y` from them
- [ ] War Only option is hidden when neither event type is present in the news
- [ ] War Only option appears when at least one war event is detected
- [ ] All four start/end combinations produce the correct time window (see table above)
- [ ] With War Only active: attacks involving a non-war kingdom are absent from output
- [ ] With War Only active: attacks outside the war time window are absent from output
- [ ] With War Only active: dragon events involving a non-war kingdom are absent from output
- [ ] With War Only active: events involving the war opponent within the window are present
- [ ] Output header line correctly names the filter, the opponent, and the date range
- [ ] With War Only inactive: output is identical to current behaviour (no regression)
- [ ] Multiple war periods in a single log are each filtered independently
- [ ] Unidentified opponent: option shown, warning in output, no filtering applied
- [ ] All existing Kingdom News tests pass with War Only off
