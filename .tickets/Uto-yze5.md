---
id: Uto-yze5
status: closed
deps: []
links: []
created: 2026-03-02T23:11:20Z
type: feature
priority: 2
assignee: Jamie Walls
---
# Province Logs: subcomponent averages for Greater Arson/Propaganda; normalize Resources Stolen format

Three related improvements to the Show Averages feature in Province Logs:

1. Greater Arson subcomponent lines: each building-type line currently shows total buildings burned (e.g. '33 Watch Towers'). When Show Averages is on, add '(N ops, avg M)' where N = number of ops that burned that building type and M = total/N rounded to 1 decimal if non-integer.
   Current: '    33 Watch Towers'
   New:     '    33 Watch Towers (13 ops, avg 2.5)'

2. Propaganda subcomponent lines: each troop-type line currently shows total troops converted (e.g. '130 specialist troops'). When Show Averages is on, add '(N ops, avg M)' where N = number of ops that converted that troop type.
   Current: '    130 specialist troops'
   New:     '    130 specialist troops (11 ops, avg 11.8)'

3. Resources Stolen format normalization (always shown, not gated on Show Averages): change '(X ops Avg: Nk)' to '(X ops, avg Nk)' — add comma, lowercase 'avg'.
   Current: '  1,404,731 gold coins (24 ops Avg: 59k)'
   New:     '  1,404,731 gold coins (24 ops, avg 59k)'

## Design

**Greater Arson per-building-type op counts:**
- Add a new object 'greaterArsonBuildingOpCounts' alongside 'greaterArsonBuildingCounts' (initialized similarly).
- In the parsing block (parser.js ~line 619-628), when a building type is matched, increment greaterArsonBuildingOpCounts[normalized]++ (one per GA op, regardless of how many buildings were burned).
- In the output block (~line 899-906), when showAverages is true, append ' (N ops, avg M)' to each building-type line using greaterArsonBuildingOpCounts[bName] and bCount/opCount.

**Propaganda per-troop-type op counts:**
- Add a new object 'propagandaOpCounts' alongside 'propagandaCounts'.
- In the parsing block (~line 634-639), increment propagandaOpCounts[key]++ for each matched Propaganda op.
- In the output block (~line 893-898), when showAverages is true, append ' (N ops, avg M)'.

**Resources Stolen format:**
- In robberyDetail (~line 938), change '$(count) ops Avg: $(avgStr)' to '$(count) ops, avg $(avgStr)'.
- This is NOT gated on showAverages — it was always shown when ops > 0.

**Average formatting:**
- avg = total / opCount
- If avg is a whole number, show as integer (e.g., avg 2)
- Otherwise round to 1 decimal place (e.g., avg 2.5)
- For Resources Stolen keep existing Nk format (no change needed there)

**showAverages gate:**
- The subcomponent avg annotation is only appended when advSettings showAverages is true (same as other averages in Province Logs).
- Resources Stolen is not gated — keep existing behavior.

## Acceptance Criteria

- [ ] Greater Arson subcomponent lines show '(N ops, avg M)' when Show Averages is on
- [ ] Propaganda subcomponent lines show '(N ops, avg M)' when Show Averages is on
- [ ] Subcomponent avg lines are absent when Show Averages is off
- [ ] Resources Stolen lines use '(X ops, avg Nk)' format (comma, lowercase avg)
- [ ] Expected output file updated to match new format
- [ ] Province Logs test assertions updated if needed
- [ ] All tests pass

