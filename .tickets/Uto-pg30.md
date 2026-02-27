---
id: Uto-pg30
status: closed
deps: []
links: []
created: 2026-02-27T19:03:01Z
type: bug
priority: 1
tags: [parser, province-logs, spells]
---
# Province Logs: Mystic Vortex impact count wrong when negating 1 spell

Mystic Vortex shows 0 active spells negated when the vortex negates exactly 1 spell.

Root cause: the impact config string is "active spells" (plural). The extraction regex is built dynamically from this string as /([\d,]+)\s+active spells/i. When the game reports "negating 1 active spell" (singular), the regex fails to match and the impact stays 0.

Fix: change the config impact to "active spell" (singular) so the regex becomes /([\d,]+)\s+active spell/i which matches both singular and plural game text. Add pluralization in the output formatter (following the existing day/days pattern) so the aggregate still displays as "active spells" when total > 1.

Affected code: PROVINCE_LOGS_CONFIG.SPELLS in parser.js (~line 37) and the spell output formatter (~line 635).

