/**
 * NewsParser - Text parsing utilities for Utopia Kingdom Forum
 * @version 2.0.0
 * @author NewsParser Team
 */

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

// Error messages
const ERROR_MESSAGES = {
    EMPTY_INPUT: 'Input text cannot be empty'
};

// Number of in-game days that constitute one unique attack window
const UNIQUE_WINDOW_DAYS = 6;

// Province Logs configuration
const PROVINCE_LOGS_CONFIG = {
    SPELLS: [
        { name: "Abolish Ritual", text: "Their ritual is now", impact: "" },
        { name: "Amnesia", text: "You have caused the scientists", impact: "books" },
        { name: "Blizzard", text: "Blizzards will beset the works", impact: "days" },
        { name: "Chastity", text: "have taken a vow of chastity", impact: "days" },
        { name: "Droughts", text: "A drought will reign over", impact: "days" },
        { name: "Explosions", text: "Explosions will rock aid shipments", impact: "days" },
        { name: "Expose Thieves", text: "exposed the thieves", impact: "days" },
        { name: "Fireball", text: "A fireball burns through the skies", impact: "peasants" },
        { name: "Fool's Gold", text: "to worthless lead", impact: "gold coins" },
        { name: "Gluttony", text: "The gluttony of", impact: "days" },
        { name: "Greed", text: "soldiers to turn greedy", impact: "days" },
        { name: "Lightning Strike", text: "Lightning strikes the Towers", impact: "runes" },
        { name: "Land Lust", text: "Our Land Lust over", impact: "acres" },
        { name: "Magic Ward", text: "Magic Ward", impact: "" },
        { name: "Meteor Showers", text: "Meteors will rain across the lands", impact: "days" },
        { name: "Mystic Vortex", text: "A magic vortex overcomes", impact: "active spell" },
        { name: "Nightmares", text: "Some were forced into rehabilitation", impact: "of the men" },
        { name: "Nightfall", text: "Nightfall", impact: "days" },
        { name: "Pitfalls", text: "Pitfalls will haunt the lands", impact: "days" },
        { name: "Storms", text: "Storms will ravage", impact: "days" },
        { name: "Tornadoes", text: "Tornadoes scour the lands", impact: "acres of buildings" },
        { name: "Vermin", text: "Vermin", impact: "bushels" }
        // TODO (Uto-h3gw): Crystal Ball and Crystal Eye — log text unknown; add once seen in wild
    ],

    // Espionage operations we run on enemy provinces (Province Logs).
    // All log-text patterns are unknown — add text/impact once identified from real log data.
    // Ref: https://wiki.utopia-game.com/index.php?title=Thievery (Uto-9row)
    ESPIONAGE_OPS: [
        { name: "Spy on Throne" },
        { name: "Spy on Defense" },
        { name: "Spy on Exploration" },
        { name: "Snatch News" },
        { name: "Infiltrate" },
        { name: "Survey" },
        { name: "Spy on Military" },
        { name: "Spy on Sciences" }
    ],

    // Self spells we cast on our own province (Province Logs).
    // All log-text patterns are unknown — add text/impact once identified from real log data.
    // Ref: https://wiki.utopia-game.com/index.php?title=Mystics (Uto-h3gw)
    SELF_SPELLS: [
        // Defensive/Protection
        { name: "Divine Shield" }, { name: "Greater Protection" }, { name: "Magic Shield" },
        { name: "Minor Protection" }, { name: "Mist" }, { name: "Nature's Blessing" },
        { name: "Reflect Magic" }, { name: "Shadowlight" },
        // Army/Combat
        { name: "Aggression" }, { name: "Animate Dead" }, { name: "Bloodlust" },
        { name: "Fanaticism" }, { name: "Inspire Army" }, { name: "Mage's Fury" },
        { name: "Patriotism" }, { name: "Quick Feet" }, { name: "Righteous Aggressor" },
        { name: "Salvation" }, { name: "War Spoils" }, { name: "Wrath" },
        // Thievery-Related
        { name: "Clear Sight" }, { name: "Illuminate Shadows" },
        { name: "Invisibility" }, { name: "Town Watch" },
        // Economic/Production
        { name: "Builders' Boon" }, { name: "Fertile Lands" },
        { name: "Fountain of Knowledge" }, { name: "Love & Peace" },
        { name: "Mind Focus" }, { name: "Miner's Mystique" },
        { name: "Paradise" }, { name: "Tree of Gold" },
        // Utility
        { name: "Anonymity" }, { name: "Guile" }, { name: "Revelation" }
    ],
    
    OPERATIONS: [
        { name: "Arson", text: "burn", impact: "acres", unique_impact: true },
        { name: "Assassinate Wizards", text: "wizards of the enemy", impact: "wizards", unique_impact: false },
        { name: "Bribe Generals", text: "Our thieves have bribed an enemy general", impact: "", unique_impact: true },
        { name: "Bribe Thieves", text: "Our thieves have bribed members of our enemies", impact: "", unique_impact: true },
        { name: "Destabilize Guilds", text: "Our thieves have destablized", impact: "days", unique_impact: false },
        { name: "Free Prisoners", text: "Our thieves freed", impact: "prisoners", unique_impact: false },
        { name: "Incite Riots", text: "Our thieves have caused ri", impact: "day", unique_impact: false },
        { name: "Kidnapping", text: "Our thieves kidnapped many people", impact: "of them", unique_impact: false },
        { name: "Night Strike", text: "enemy troops.", impact: "enemy troops", unique_impact: false },
        { name: "Propaganda", text: "We have converted", impact: "", unique_impact: true },
        { name: "Sabotage Wizards", text: "ability to regain their mana", impact: "day", unique_impact: false }
    ],
    
    BUILDINGS: [
        "Homes", "Farms", "Mills", "Banks", "Training Grounds", "Armouries", 
        "Military Barracks", "Forts", "Castles", "Hospitals", "Guilds", "Towers", 
        "Thieves' Dens", "Watch Towers", "Universities", "Libraries", "Stables", "Dungeons"
    ],
    
    CONSTRUCTION_BUILDINGS: [
        "Guilds", "Homes", "Hospitals", "Libraries", "Mills",
        "Training Grounds", "Military Barracks", "Castles", "Thieves' Dens",
        "Stables", "Farms", "Banks", "Armouries", "Forts", "Towers",
        "Watch Towers", "Dungeons"
    ],

    SCIENCES: [
        "TOOLS", "ALCHEMY", "HOUSING", "PRODUCTION", "BOOKKEEPING", "ARTISAN",
        "STRATEGY", "SIEGE", "TACTICS", "VALOR", "HEROISM", "RESILIENCE",
        "CRIME", "CHANNELING", "SHIELDING", "CUNNING", "SORCERY", "FINESSE"
    ],

    PROPAGANDA_TROOPS: ["thieves", "soldiers", "wizards", "specialist troops"],

    AID_RESOURCES: ["soldiers", "gold coins", "bushels", "runes", "explore pool acres"]
};

// =============================================================================
// CUSTOM ERROR CLASSES
// =============================================================================

class ParseError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'ParseError';
        this.code = code;
    }
}

// =============================================================================
// TEXT CLEANING UTILITIES
// =============================================================================

/**
 * Comprehensive text cleaning function that applies all cleaning utilities
 * @param {string} text - Input text to clean
 * @returns {string} - Cleaned text
 */
function parseText(text) {
    let cleaned = text;
    cleaned = removeHtmlTags(cleaned);
    cleaned = removeHtmlEntities(cleaned);
    cleaned = normalizeWhitespace(cleaned);
    cleaned = removeProblematicCharacters(cleaned);
    cleaned = normalizeLineBreaks(cleaned);
    return cleaned;
}

/**
 * Removes HTML tags from text
 * @param {string} text - Input text containing HTML tags
 * @returns {string} - Text with HTML tags removed
 */
function removeHtmlTags(text) {
    return text.replace(/<[^>]*>/g, '');
}

/**
 * Converts HTML entities to their character equivalents
 * @param {string} text - Input text containing HTML entities
 * @returns {string} - Text with HTML entities converted
 */
function removeHtmlEntities(text) {
    return text.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'");
}

/**
 * Normalizes whitespace by replacing multiple spaces with single spaces
 * @param {string} text - Input text with irregular whitespace
 * @returns {string} - Text with normalized whitespace
 */
function normalizeWhitespace(text) {
    return text.split('\n').map(line => line.replace(/\s+/g, ' ').trim()).join('\n');
}

/**
 * Replaces problematic Unicode characters with ASCII equivalents
 * @param {string} text - Input text with Unicode characters
 * @returns {string} - Text with problematic characters replaced
 */
function removeProblematicCharacters(text) {
    return text.replace(/[\u2018\u2019]/g, "'")
               .replace(/[\u201C\u201D]/g, '"')
               .replace(/[\u2013\u2014]/g, '-')
               .replace(/[\u2026]/g, '...');
}

/**
 * Normalizes line breaks to use \n consistently
 * @param {string} text - Input text with mixed line break styles
 * @returns {string} - Text with normalized line breaks
 */
function normalizeLineBreaks(text) {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

// =============================================================================
// PROVINCE LOGS PARSING
// =============================================================================

/**
 * Escapes special regex characters for safe use in RegExp
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Formats a number with commas for readability
 * @param {number} n - Number to format
 * @returns {string} - Formatted number string
 */
function formatNumber(n) {
    return n.toLocaleString();
}

/**
 * Returns "N word" or "N words" based on count.
 */
function pluralize(n, word) {
    return n === 1 ? `${n} ${word}` : `${n} ${word}s`;
}

/**
 * Converts a Kingdom News date string to a numeric day value for window comparisons.
 * @param {string} dateStr - e.g. "February 1 of YR0"
 * @returns {number} - Day offset from start of YR0
 */
function dateToNumber(dateStr) {
    if (!dateStr) return 0;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const parts = dateStr.match(/^(\w+) (\d+) of YR(\d+)/);
    if (!parts) return 0;
    const monthIdx = months.indexOf(parts[1]);
    const day = parseInt(parts[2]);
    const year = parseInt(parts[3]);
    return year * 7 * 24 + monthIdx * 24 + (day - 1);
}

/**
 * Pre-scans attack lines to determine which kingdom the news was copied from.
 * The own kingdom appears in every attack line (as attacker or defender), while
 * enemy kingdoms only appear in lines specific to their interactions with us.
 * @param {string[]} lines - Cleaned and trimmed attack lines
 * @returns {string|null} - Kingdom ID e.g. '5:1', or null if undetermined
 */
function detectOwnKingdom(lines) {
    const kingdomCounts = {};
    const provincePattern = /\((\d+):(\d+)\)/g;
    const hasAttack = /captured \d+ acres|recaptured \d+ acres|ambushed armies|razed \d+ acres|invaded and looted|attacked and looted|killed \d+ people|invaded and pillaged|attacked and pillaged|attempted an invasion|attempted to invade|but was repelled/i;

    for (const line of lines) {
        if (!hasAttack.test(line)) continue;
        for (const m of line.matchAll(provincePattern)) {
            const kid = m[1] + ':' + m[2];
            kingdomCounts[kid] = (kingdomCounts[kid] || 0) + 1;
        }
    }

    let maxCount = 0;
    let ownKingdom = null;
    for (const [kid, count] of Object.entries(kingdomCounts)) {
        if (count > maxCount) {
            maxCount = count;
            ownKingdom = kid;
        }
    }
    return ownKingdom;
}

/**
 * Returns true if the raw text contains war-related sentinel events.
 * Used by the UI to decide whether to show the War Only option.
 * @param {string} text
 * @returns {boolean}
 */
function hasWarEvents(text) {
    return text.includes('declared WAR') || text.includes('Our kingdom is now in a post-war period');
}

/**
 * Pre-scans lines for war start/end events and builds an array of war periods.
 * Handles multiple consecutive wars. Each period describes the opponent and time window.
 * @param {string[]} lines - Cleaned, trimmed lines (same as relevantLines)
 * @param {string|null} ownKingdomId - Own kingdom ID (for fallback opponent extraction)
 * @returns {Array<{startDate:string|null, startDateVal:number|null, endDate:string|null, endDateVal:number|null, opponentId:string|null, opponentName:string|null}>}
 */
function detectWarPeriods(lines, ownKingdomId) {
    const dateRegex = /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2} of YR\d+/;
    const periods = [];
    let openPeriod = null;
    let prevContentLine = null;
    let currentDate = null;

    for (const line of lines) {
        const dateMatch = line.match(dateRegex);
        if (dateMatch) {
            currentDate = dateMatch[0];
        }

        // War start: any line containing "declared WAR"
        if (line.includes('declared WAR') && currentDate) {
            const coordMatch = line.match(/\((\d+):(\d+)\)/);
            const opponentId = coordMatch ? coordMatch[1] + ':' + coordMatch[2] : null;

            let opponentName = null;
            if (coordMatch) {
                // Format: "We have declared WAR on <Name> (<X:Y>)!"
                const weDecl = line.match(/declared WAR on (.+?) \(\d+:\d+\)/);
                if (weDecl) {
                    opponentName = weDecl[1].trim();
                } else {
                    // Format: "<Name> (<X:Y>) declared WAR..." or "<Name> (<X:Y>) has declared WAR..."
                    const text = line.replace(dateRegex, '').trim();
                    const theyDecl = text.match(/^(.+?) \(\d+:\d+\)/);
                    if (theyDecl) {
                        opponentName = theyDecl[1].trim();
                    }
                }
            }

            openPeriod = {
                startDate: currentDate,
                startDateVal: dateToNumber(currentDate),
                endDate: null,
                endDateVal: null,
                opponentId,
                opponentName
            };
            periods.push(openPeriod);
        }

        // War end: any line containing "Our kingdom is now in a post-war period"
        if (line.includes('Our kingdom is now in a post-war period') && currentDate) {
            if (openPeriod) {
                openPeriod.endDate = currentDate;
                openPeriod.endDateVal = dateToNumber(currentDate);
                openPeriod = null;
            } else {
                // No start event in log — fallback: extract opponent from last combat event
                let opponentId = null;
                let opponentName = null;
                if (prevContentLine) {
                    const allCoords = [];
                    for (const m of prevContentLine.matchAll(/\((\d+):(\d+)\)/g)) {
                        allCoords.push(m[1] + ':' + m[2]);
                    }
                    if (ownKingdomId) {
                        opponentId = allCoords.find(id => id !== ownKingdomId) || allCoords[0] || null;
                    } else {
                        opponentId = allCoords[0] || null;
                    }
                }
                periods.push({
                    startDate: null,
                    startDateVal: null,
                    endDate: currentDate,
                    endDateVal: dateToNumber(currentDate),
                    opponentId,
                    opponentName
                });
            }
        }

        // Track last non-post-war content line (for fallback opponent extraction)
        if (dateMatch && line.trim().length > dateMatch[0].length) {
            if (!line.includes('Our kingdom is now in a post-war period') &&
                !line.includes('withdrawn from war')) {
                prevContentLine = line;
            }
        }
    }

    return periods;
}

/**
 * Returns true if the event should be kept when War Only is active.
 * The event must fall within at least one war period's time window AND involve
 * the corresponding war opponent's (X:Y) coordinate.
 * @param {number} dateVal - Numeric date of the event
 * @param {string} line - Full raw line
 * @param {Array} warPeriods - Detected war periods
 * @returns {boolean}
 */
function linePassesWarFilter(dateVal, line, warPeriods) {
    for (const period of warPeriods) {
        // Time window check
        if (period.startDateVal !== null && dateVal < period.startDateVal) continue;
        if (period.endDateVal !== null && dateVal >= period.endDateVal) continue;

        // Within window — if opponent unidentified, keep everything in this window
        if (!period.opponentId) return true;

        // Check if line involves the opponent's (X:Y)
        for (const m of line.matchAll(/\((\d+):(\d+)\)/g)) {
            if (m[1] + ':' + m[2] === period.opponentId) return true;
        }
    }
    return false;
}

/**
 * Calculates unique attack counts using a sliding day-window per attacker province.
 * A "unique" is defined as a 6-day window: all attacks by a province within 6 in-game
 * days of their first attack count as 1 unique; on the 7th day a new window opens.
 * @param {Array<{dateVal: number, attackerKey: string}>} log - Dated attack log
 * @param {number} windowDays - Window size in in-game days
 * @returns {{total: number, perAttacker: Object<string, number>}}
 */
function calculateUniques(log, windowDays) {
    // windowDays === 0 means every attack is its own unique (no windowing)
    if (windowDays === 0) {
        const perAttacker = {};
        for (const { attackerKey } of log) {
            perAttacker[attackerKey] = (perAttacker[attackerKey] || 0) + 1;
        }
        return { total: log.length, perAttacker };
    }

    // Group dates by attacker province
    const byAttacker = {};
    for (const entry of log) {
        if (!byAttacker[entry.attackerKey]) byAttacker[entry.attackerKey] = [];
        byAttacker[entry.attackerKey].push(entry.dateVal);
    }

    let total = 0;
    const perAttacker = {};
    for (const [attacker, dates] of Object.entries(byAttacker)) {
        dates.sort((a, b) => a - b);
        let windowCount = 0;
        let windowStart = -Infinity;
        for (const date of dates) {
            if (date > windowStart + windowDays) {
                windowCount++;
                windowStart = date;
            }
        }
        perAttacker[attacker] = windowCount;
        total += windowCount;
    }
    return { total, perAttacker };
}

/**
 * Parses the pasted log text and returns a formatted summary string
 * @param {string} text - Raw province log text
 * @returns {string} - Formatted summary of province log events
 */
function formatProvinceLogs(text) {
    if (!text || text.trim() === '') {
        throw new ParseError(ERROR_MESSAGES.EMPTY_INPUT, 'EMPTY_INPUT');
    }

    // Split input text into lines, trim whitespace, and remove empty lines
    let lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // Remove date prefix and time stamps
    lines = lines.map(line => line.replace(/^.*?YR\d+\s*/, '').trim())
                 .filter(line => !/^\d{2}:\d{2}\b/.test(line))
                 .filter(Boolean);

    // Initialize counters
    const spellCounts = {};
    const spellImpacts = {};
    const aidTotals = {};
    const thieveryCounts = {};
    const thieveryImpacts = {};
    const greaterArsonBuildingCounts = {};
    const propagandaCounts = {};
    
    let dragonTroopsTotal = 0;
    let dragonPointsTotal = 0;
    let dragonGoldDonated = 0;
    let dragonBushelsDonated = 0;
    let greaterArsonOpsCount = 0;
    let ritualCasts = 0;
    let failedThieveryCount = 0;
    let thiervesLostCount = 0;
    let successThiervesLostCount = 0;
    let stealHorsesOps = 0;
    let stealHorsesReleased = 0;
    let stealHorsesBroughtBack = 0;
    let draftPercent = null;
    let draftRate = null;
    let militaryWagesPercent = null;
    let exploreAcres = 0;
    let exploreSoldiers = 0;
    let exploreCost = 0;

    const constructionCounts = {};
    const razedCounts = {};
    const scienceCounts = {};
    const trainingCounts = {};
    const releaseCounts = {};
    
    // Resources stolen counters
    let goldCoinsStolen = 0;
    let bushelsStolen = 0;
    let runesStolen = 0;
    let warHorsesStolen = 0;
    let vaultRobberyCount = 0;
    let granaryRobberyCount = 0;
    let towerRobberyCount = 0;

    // Initialize all counters to zero
    PROVINCE_LOGS_CONFIG.SPELLS.forEach(s => { 
        spellCounts[s.name] = 0; 
        spellImpacts[s.name] = 0; 
    });
    PROVINCE_LOGS_CONFIG.OPERATIONS.forEach(o => { 
        thieveryCounts[o.name] = 0; 
        thieveryImpacts[o.name] = 0; 
    });
    PROVINCE_LOGS_CONFIG.BUILDINGS.forEach(b => { 
        greaterArsonBuildingCounts[b] = 0; 
    });
    PROVINCE_LOGS_CONFIG.PROPAGANDA_TROOPS.forEach(p => {
        propagandaCounts[p] = 0;
    });
    propagandaCounts['elites'] = 0;
    PROVINCE_LOGS_CONFIG.AID_RESOURCES.forEach(r => {
        aidTotals[r] = 0;
    });
    PROVINCE_LOGS_CONFIG.CONSTRUCTION_BUILDINGS.forEach(b => { constructionCounts[b] = 0; });
    PROVINCE_LOGS_CONFIG.CONSTRUCTION_BUILDINGS.forEach(b => { razedCounts[b] = 0; });
    PROVINCE_LOGS_CONFIG.SCIENCES.forEach(s => { scienceCounts[s] = 0; });

    // Main parsing loop
    for (const line of lines) {
        // Parse spells
        if (line.includes("begin casting")) {
            for (const spell of PROVINCE_LOGS_CONFIG.SPELLS) {
                if (line.includes(spell.text)) {
                    spellCounts[spell.name]++;
                    if (spell.impact) {
                        const match = line.match(new RegExp(`([\\d,]+)\\s+${escapeRegExp(spell.impact)}`, "i"));
                        if (match) {
                            spellImpacts[spell.name] += parseInt(match[1].replace(/,/g, ""));
                        }
                    }
                }
            }
        }
        
        // Parse aid
        if (line.includes("We have sent")) {
            const match = line.match(/We have sent\s+([\d,]+)\s+(soldiers|gold coins|bushels|runes|explore pool acres)/i);
            if (match) {
                aidTotals[match[2].toLowerCase()] += parseInt(match[1].replace(/,/g, ""));
            }
        }
        
        // Parse thievery operations
        if (line.includes("Early indications show that our operation was a success")) {
            for (const op of PROVINCE_LOGS_CONFIG.OPERATIONS) {
                // Handle different operation types
                if (op.name === "Arson" && op.unique_impact) {
                    if (line.includes(op.text) && line.includes("buildings")) {
                        thieveryCounts[op.name]++;
                        const match = line.match(/([\d,]+)\s+acres/i);
                        if (match) thieveryImpacts[op.name] += parseInt(match[1].replace(/,/g, ""));
                    }
                } else if (op.name === "Propaganda" && op.unique_impact) {
                    if (line.includes(op.text)) {
                        const m = line.match(/We have converted ([\d,]+) (?:of the enemy's )?(.+?) (?:from the enemy|to our)/i);
                        if (m) {
                            thieveryCounts["Propaganda"]++;
                            const troopCount = parseInt(m[1].replace(/,/g, ''));
                            const troopName = m[2].trim().toLowerCase();
                            const namedTroop = PROVINCE_LOGS_CONFIG.PROPAGANDA_TROOPS.find(p => p.toLowerCase() === troopName);
                            const key = namedTroop || 'elites';
                            propagandaCounts[key] = (propagandaCounts[key] || 0) + troopCount;
                        }
                    }
                } else if (op.unique_impact) {
                    if (line.includes(op.text)) {
                        thieveryCounts[op.name]++;
                        if (op.name === "Bribe Generals" || op.name === "Bribe Thieves") {
                            thieveryImpacts[op.name]++;
                        }
                    }
                } else if (line.includes(op.text)) {
                    thieveryCounts[op.name]++;
                    if (op.impact) {
                        const match = line.match(new RegExp(`([\\d,]+)\\s+${escapeRegExp(op.impact)}`, "i"));
                        if (match) {
                            thieveryImpacts[op.name] += parseInt(match[1].replace(/,/g, ""));
                        }
                    }
                }
            }
        }
        
        // Parse ritual
        if (line.includes("We are now closer to completing our ritual project")) {
            ritualCasts++;
        }
        
        // Parse dragon donations
        if (line.includes("to the quest of launching a dragon")) {
            const goldMatch = line.match(/([\d,]+)\s+gold coins/i);
            if (goldMatch) dragonGoldDonated += parseInt(goldMatch[1].replace(/,/g, ""));
            
            const bushelsMatch = line.match(/([\d,]+)\s+bushels/i);
            if (bushelsMatch) dragonBushelsDonated += parseInt(bushelsMatch[1].replace(/,/g, ""));
        }
        
        // Parse dragon troops/points
        if (line.includes("the dragon is weakened by") && line.includes("troops")) {
            const troopsMatch = line.match(/([\d,]+)\s+troops/i);
            if (troopsMatch) dragonTroopsTotal += parseInt(troopsMatch[1].replace(/,/g, ""));
            
            const pointsMatch = line.match(/([\d,]+)\s+points/i);
            if (pointsMatch) dragonPointsTotal += parseInt(pointsMatch[1].replace(/,/g, ""));
        }
        
        // Parse construction orders (handles single and multi-building formats)
        if (line.includes("You have given orders to commence work on")) {
            const after = line.replace(/^.*commence work on\s+/i, '').replace(/\.?\s*$/, '');
            const segments = after.replace(/ and /gi, ', ').split(/,\s*/);
            for (const seg of segments) {
                const m = seg.match(/^([\d,]+)\s+(.+)$/);
                if (!m) continue;
                const count = parseInt(m[1].replace(/,/g, ''));
                const buildingText = m[2].trim().toLowerCase();
                for (const b of PROVINCE_LOGS_CONFIG.CONSTRUCTION_BUILDINGS) {
                    const bl = b.toLowerCase();
                    if (buildingText === bl ||
                        buildingText + 's' === bl ||
                        (bl.endsWith('ies') && buildingText === bl.slice(0, -3) + 'y')) {
                        constructionCounts[b] += count;
                        break;
                    }
                }
            }
        }

        // Parse building demolition
        if (line.includes("You have destroyed")) {
            const after = line.replace(/^.*You have destroyed\s+/i, '').replace(/\.?\s*$/, '');
            const segments = after.replace(/ and /gi, ', ').split(/,\s*/);
            for (const seg of segments) {
                const m = seg.match(/^([\d,]+)\s+(.+)$/);
                if (!m) continue;
                const count = parseInt(m[1].replace(/,/g, ''));
                const buildingText = m[2].trim().toLowerCase();
                for (const b of PROVINCE_LOGS_CONFIG.CONSTRUCTION_BUILDINGS) {
                    const bl = b.toLowerCase();
                    if (buildingText === bl ||
                        buildingText + 's' === bl ||
                        (bl.endsWith('ies') && buildingText === bl.slice(0, -3) + 'y')) {
                        razedCounts[b] += count;
                        break;
                    }
                }
            }
        }

        // Parse failed thievery attempts
        if (line.includes("Sources have indicated the mission was foiled")) {
            failedThieveryCount++;
            const lostMatch = line.match(/We lost ([\d,]+) thieves?/i);
            if (lostMatch) thiervesLostCount += parseInt(lostMatch[1].replace(/,/g, ""));
        }

        // Parse thieves lost in successful operations
        if (line.includes("We lost") && (line.includes("thieves in the operation") || line.includes("thief in the operation"))) {
            const lostMatch = line.match(/We lost ([\d,]+) thie(?:f|ves?) in the operation/i);
            if (lostMatch) successThiervesLostCount += parseInt(lostMatch[1].replace(/,/g, ""));
        }

        // Parse Steal War Horses thievery op
        if (line.includes("release") && line.includes("horses") && line.includes("bring back")) {
            const m = line.match(/release ([\d,]+) horses.*bring back ([\d,]+)/i);
            if (m) {
                stealHorsesOps++;
                stealHorsesReleased += parseInt(m[1].replace(/,/g, ''));
                stealHorsesBroughtBack += parseInt(m[2].replace(/,/g, ''));
            }
        }

        // Parse draft percentage order
        if (line.includes("You will draft up to") && line.includes("of your population")) {
            const m = line.match(/You will draft up to (\d+)%/);
            if (m) draftPercent = parseInt(m[1]);
        }

        // Parse draft rate setting
        if (line.includes("You have set your draft rate to")) {
            const m = line.match(/You have set your draft rate to (.+?)\./i);
            if (m) draftRate = m[1].trim();
        }

        // Parse military wages notification
        if (line.includes("You will pay") && line.includes("of military wages")) {
            const m = line.match(/You will pay (\d+)%/);
            if (m) militaryWagesPercent = parseInt(m[1]);
        }

        // Parse exploration orders
        if (line.includes("to explore") && line.includes("expedition")) {
            const acresMatch = line.match(/to explore ([\d,]+) acres/i);
            const soldiersMatch = line.match(/expedition of ([\d,]+) soldiers/i);
            const costMatch = line.match(/cost of ([\d,]+) gold coins/i);
            if (acresMatch) exploreAcres += parseInt(acresMatch[1].replace(/,/g, ""));
            if (soldiersMatch) exploreSoldiers += parseInt(soldiersMatch[1].replace(/,/g, ""));
            if (costMatch) exploreCost += parseInt(costMatch[1].replace(/,/g, ""));
        }

        // Parse military training orders
        if (line.includes("You have ordered that") && line.includes("be trained")) {
            const match = line.match(/You have ordered that ([\d,]+) (.+?) be trained/i);
            if (match) {
                const count = parseInt(match[1].replace(/,/g, ""));
                const unit = match[2].trim().toLowerCase();
                trainingCounts[unit] = (trainingCounts[unit] || 0) + count;
            }
        }

        // Parse military release orders
        if (line.includes("You have ordered that") && line.includes("be released from duty")) {
            const match = line.match(/You have ordered that ([\d,]+) (.+?) be released from duty/i);
            if (match) {
                const count = parseInt(match[1].replace(/,/g, ""));
                const unit = match[2].trim().toLowerCase();
                releaseCounts[unit] = (releaseCounts[unit] || 0) + count;
            }
        }

        // Parse science book allocation
        if (line.includes("books allocated to")) {
            const match = line.match(/([\d,]+) books allocated to (\w+)/i);
            if (match) {
                const count = parseInt(match[1].replace(/,/g, ""));
                const science = match[2].toUpperCase();
                if (PROVINCE_LOGS_CONFIG.SCIENCES.includes(science)) {
                    scienceCounts[science] += count;
                }
            }
        }

        // Parse stolen resources
        if (line.includes("Our thieves have returned with") || line.includes("Our thieves were able to steal")) {
            if (line.includes("gold coins")) {
                const match = line.match(/([\d,]+)\s+gold coins/i);
                if (match) { goldCoinsStolen += parseInt(match[1].replace(/,/g, "")); vaultRobberyCount++; }
            } else if (line.includes("bushels")) {
                const match = line.match(/([\d,]+)\s+bushels/i);
                if (match) { bushelsStolen += parseInt(match[1].replace(/,/g, "")); granaryRobberyCount++; }
            } else if (line.includes("runes")) {
                const match = line.match(/([\d,]+)\s+runes/i);
                if (match) { runesStolen += parseInt(match[1].replace(/,/g, "")); towerRobberyCount++; }
            } else if (line.includes("war horses")) {
                const match = line.match(/([\d,]+)\s+war horses/i);
                if (match) warHorsesStolen += parseInt(match[1].replace(/,/g, ""));
            }
        } else if (!line.includes("begin casting") &&
                   !line.includes("We have sent") &&
                   !line.includes("Early indications show that our operation was a success") &&
                   !line.includes("We are now closer to completing our ritual project") &&
                   !line.includes("to the quest of launching a dragon") &&
                   !(line.includes("the dragon is weakened by") && line.includes("troops")) &&
                   !line.includes("You have given orders to commence work on") &&
                   !line.includes("You have destroyed") &&
                   !line.includes("Sources have indicated the mission was foiled") &&
                   !(line.includes("We lost") && line.includes("thieves in the operation")) &&
                   !line.includes("books allocated to") &&
                   !(line.includes("to explore") && line.includes("expedition")) &&
                   !(line.includes("You have ordered that") && line.includes("be trained")) &&
                   !(line.includes("You have ordered that") && line.includes("be released from duty")) &&
                   !(line.includes("release") && line.includes("horses") && line.includes("bring back")) &&
                   !line.includes("You will draft up to") &&
                   !line.includes("You have set your draft rate to") &&
                   !(line.includes("You will pay") && line.includes("of military wages")) &&
                   !line.includes("Your topic was created successfully") &&
                   !line.includes("Post edited successfully") &&
                   !line.includes("The power of Mana Well surges through your forces") &&
                   !line.includes("Drawing from the ancient Mana Well")) {
            logUnrecognizedLine(line, 'province-logs');
        }
    }

    // Build output
    let output = "\nSummary of Province Log Events from UtopiaFormatter.com\n" + "-".repeat(40) + "\n";

    // Thievery Summary
    output += "\nThievery Summary:\n";
    const opTotals = [];
    for (const op of PROVINCE_LOGS_CONFIG.OPERATIONS) {
        let count = thieveryCounts[op.name];
        // Propaganda op count now tracked in thieveryCounts directly
        if (count > 0) {
            opTotals.push([count, op.name, op]);
        }
    }
    opTotals.sort((a, b) => b[0] - a[0]);

    for (const [count, name, op] of opTotals) {
        const impact = op.impact;
        const totalImpact = thieveryImpacts[name];
        
        if (op.unique_impact && name === "Propaganda") {
            output += `  ${count} Propaganda:\n`;
            Object.entries(propagandaCounts)
                .filter(([, c]) => c > 0)
                .sort((a, b) => b[1] - a[1])
                .forEach(([pName, pCount]) => {
                    output += `    ${pCount} ${pName}\n`;
                });
        } else if (op.unique_impact && (name === "Bribe Generals" || name === "Bribe Thieves")) {
            output += `  ${count} ${name} ops\n`;
        } else if (impact) {
            let impactStr = impact;
            if (impactStr === "day" && totalImpact > 1) {
                impactStr = "days";
            }
            if (impactStr === "of them") {
                impactStr = "peasants";
            }
            output += `  ${count} ${name} for a total of ${formatNumber(totalImpact)} ${impactStr}\n`;
        } else {
            output += `  ${count} ${name}\n`;
        }
    }

    if (stealHorsesOps > 0) {
        output += `  ${stealHorsesOps} Steal War Horses (${formatNumber(stealHorsesReleased)} released, ${formatNumber(stealHorsesBroughtBack)} stolen)\n`;
    }
    if (failedThieveryCount > 0) {
        output += `  ${failedThieveryCount} failed thievery attempt${failedThieveryCount !== 1 ? 's' : ''} (${thiervesLostCount} thieves lost)\n`;
    }
    if (successThiervesLostCount > 0) {
        output += `  ${formatNumber(successThiervesLostCount)} thieves lost in successful operations\n`;
    }

    // Resources Stolen Summary
    function robberyDetail(total, count) {
        if (count === 0) return '';
        const avg = Math.round(total / count);
        const avgStr = avg >= 1000 ? `${Math.round(avg / 1000)}k` : `${avg}`;
        return ` (${count} ops Avg: ${avgStr})`;
    }
    output += "\nResources Stolen:\n";
    if (goldCoinsStolen > 0) output += `  ${formatNumber(goldCoinsStolen)} gold coins${robberyDetail(goldCoinsStolen, vaultRobberyCount)}\n`;
    if (bushelsStolen > 0) output += `  ${formatNumber(bushelsStolen)} bushels${robberyDetail(bushelsStolen, granaryRobberyCount)}\n`;
    if (runesStolen > 0) output += `  ${formatNumber(runesStolen)} runes${robberyDetail(runesStolen, towerRobberyCount)}\n`;
    if (warHorsesStolen > 0) output += `  ${formatNumber(warHorsesStolen)} war horses\n`;

    // Spell Summary
    output += "\nSpell Summary:\n";
    const spellTotals = [];
    for (const spell of PROVINCE_LOGS_CONFIG.SPELLS) {
        const count = spellCounts[spell.name];
        if (count > 0) {
            spellTotals.push([count, spell.name, spell]);
        }
    }
    spellTotals.sort((a, b) => b[0] - a[0]);
    
    for (const [count, , spell] of spellTotals) {
        let impact = spell.impact;
        const totalImpact = spellImpacts[spell.name];
        if (impact === "of the men") {
            impact = "troops";
        }
        if (impact === "active spell" && totalImpact !== 1) {
            impact = "active spells";
        }
        if (impact) {
            output += `  ${count} ${spell.name} for a total of ${formatNumber(totalImpact)} ${impact}\n`;
        } else {
            output += `  ${count} ${spell.name}\n`;
        }
    }

    // Aid Summary
    output += "\nAid Summary:\n";
    Object.entries(aidTotals)
        .filter(([, total]) => total > 0)
        .sort((a, b) => b[1] - a[1])
        .forEach(([resource, total]) => {
            output += `  ${formatNumber(total)} ${resource}\n`;
        });

    // Dragon Summary
    output += "\nDragon Summary:\n";
    if (dragonGoldDonated > 0) output += `  ${formatNumber(dragonGoldDonated)} gold coins donated\n`;
    if (dragonBushelsDonated > 0) output += `  ${formatNumber(dragonBushelsDonated)} bushels donated\n`;
    if (dragonTroopsTotal > 0 || dragonPointsTotal > 0) {
        output += `  ${formatNumber(dragonTroopsTotal)} troops sent and weakened by ${formatNumber(dragonPointsTotal)} points\n`;
    }

    // Ritual Summary (omitted when no ritual casts detected)
    if (ritualCasts > 0) {
        output += "\nRitual Summary:\n";
        output += `  ${ritualCasts} successful ritual casts\n`;
    }

    // Construction Summary (omitted when no construction or demolition detected)
    const anyConstruction = PROVINCE_LOGS_CONFIG.CONSTRUCTION_BUILDINGS.some(b => constructionCounts[b] > 0);
    const anyRazed = PROVINCE_LOGS_CONFIG.CONSTRUCTION_BUILDINGS.some(b => razedCounts[b] > 0);
    if (anyConstruction || anyRazed) {
        output += "\nConstruction Summary:\n";
        PROVINCE_LOGS_CONFIG.CONSTRUCTION_BUILDINGS
            .filter(b => constructionCounts[b] > 0)
            .sort((a, b) => constructionCounts[b] - constructionCounts[a])
            .forEach(b => { output += `  ${formatNumber(constructionCounts[b])} ${b}\n`; });
        PROVINCE_LOGS_CONFIG.CONSTRUCTION_BUILDINGS
            .filter(b => razedCounts[b] > 0)
            .sort((a, b) => razedCounts[b] - razedCounts[a])
            .forEach(b => { output += `  ${formatNumber(razedCounts[b])} ${b} razed\n`; });
    }

    // Science Summary (omitted when no science allocations detected)
    const anyScience = PROVINCE_LOGS_CONFIG.SCIENCES.some(s => scienceCounts[s] > 0);
    if (anyScience) {
        output += "\nScience Summary:\n";
        PROVINCE_LOGS_CONFIG.SCIENCES
            .filter(s => scienceCounts[s] > 0)
            .sort((a, b) => scienceCounts[b] - scienceCounts[a])
            .forEach(s => { output += `  ${formatNumber(scienceCounts[s])} books to ${s}\n`; });
    }

    // Exploration Summary (omitted when no exploration orders detected)
    if (exploreAcres > 0) {
        output += "\nExploration Summary:\n";
        output += `  ${formatNumber(exploreAcres)} acres explored\n`;
        output += `  ${formatNumber(exploreSoldiers)} soldiers sent at a cost of ${formatNumber(exploreCost)} gold coins\n`;
    }

    // Military Training (omitted when no training, release, draft, or wage data detected)
    const anyTraining = Object.keys(trainingCounts).length > 0;
    const anyRelease = Object.keys(releaseCounts).length > 0;
    if (anyTraining || anyRelease || draftPercent !== null || draftRate !== null || militaryWagesPercent !== null) {
        output += "\nMilitary Training:\n";
        Object.entries(trainingCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([unit, count]) => { output += `  ${formatNumber(count)} ${unit}\n`; });
        Object.entries(releaseCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([unit, count]) => { output += `  ${formatNumber(count)} ${unit} released\n`; });
        if (draftPercent !== null) output += `  Draft: ${draftPercent}% of population\n`;
        if (draftRate !== null) output += `  Draft rate: ${draftRate}\n`;
        if (militaryWagesPercent !== null) output += `  Military wages: ${militaryWagesPercent}%\n`;
    }

    return output.trim();
}

/**
 * Sends an unrecognized parser line to the logging endpoint (browser only).
 * Fire-and-forget: never blocks parsing, never surfaces errors to the user.
 * Silently skips when running in Node.js (tests) or when logEndpoint is unset.
 * @param {string} line - The unrecognized line (will be truncated to 500 chars)
 * @param {string} context - Parser context: 'kingdom-news', 'province-logs', or 'province-news'
 */
function logUnrecognizedLine(line, context) {
    if (typeof window === 'undefined') return; // Node.js / test environment
    const endpoint = window.APP_CONFIG?.logEndpoint;
    if (!endpoint) return;
    fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: line.substring(0, 500), context }),
        keepalive: true
    }).catch(() => {}); // silently swallow all errors — never surface to user
}

/**
 * Parses full Kingdom News logs and summarizes attack data
 * @param {string} inputText - Raw Kingdom News log text
 * @returns {string} - Formatted Kingdom News summary
 */
function parseKingdomNewsLog(inputText, options) {
    if (!inputText || inputText.trim() === '') {
        throw new ParseError(ERROR_MESSAGES.EMPTY_INPUT, 'EMPTY_INPUT');
    }

    // Clean the input text
    let cleanedText = parseText(inputText);
    const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line);
    
    // Find the first line that starts with a date in the format "Month Day of YR#"
    const dateRegex = /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2} of YR\d+/;
    const startIndex = lines.findIndex(line => dateRegex.test(line));
    
    if (startIndex === -1) {
        throw new ParseError('Could not find date line in Kingdom News log', 'NO_DATE_FOUND');
    }
    
    const relevantLines = lines.slice(startIndex);

    // Determine own kingdom from the text before main parse
    const detectedOwnKingdom = detectOwnKingdom(relevantLines);

    // Pre-scan for war periods (used by War Only filter)
    const warOnly = !!(options && options.warOnly);
    const warPeriods = detectWarPeriods(relevantLines, detectedOwnKingdom);

    // Parse data structure
    const data = {
        startDate: null,
        endDate: null,
        kingdoms: {},
        ownKingdomId: detectedOwnKingdom,
        warPeriods,
        warOnly,
        ceasefireProposals: [],
        ceasefireWithdrawals: [],
        ceasefireEntered: 0,
        warDeclarations: [],
        ritualCoverage: [],
        highlights: {
            mostLandGainedTrad: { province: '', acres: 0 },
            mostLandLostTrad: { province: '', acres: 0 },
            mostLandGainedAmbush: { province: '', acres: 0 },
            mostLandLostAmbush: { province: '', acres: 0 },
            mostBouncesMade: { province: '', count: 0 },
            mostBouncesReceived: { provinces: [], count: 0 }
        }
    };

    // Process each line
    let lastAttackDate = null;
    let currentDate = null;

    for (const line of relevantLines) {
        const dateMatch = line.match(dateRegex);
        if (dateMatch) {
            currentDate = dateMatch[0];
            if (!data.startDate) {
                data.startDate = currentDate;
            }
            // Continue processing this line as an attack line too
        }

        // Parse attack lines (skip lines that are only dates)
        if (line.trim().length > dateMatch[0].length) {
            const attackLine = line.replace(/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2} of YR\d+\s*/, '');

            // Check if this is actually an attack line
            const isAttack = /captured \d+ acres of land|ambushed armies.*and took \d+ acres of land|recaptured \d+ acres of land|killed \d+ people|razed \d+ acres|attacked and pillaged|invaded and pillaged|invaded and looted|attacked and looted|attempted to invade|attempted an invasion/.test(attackLine);

            // War Only filter: skip events that don't involve the war opponent in the war window
            if (warOnly && warPeriods.length > 0) {
                const dateVal = dateToNumber(currentDate);
                if (!linePassesWarFilter(dateVal, line, warPeriods)) {
                    continue;
                }
            }

            if (isAttack) {
                if (dateMatch) {
                    lastAttackDate = currentDate;
                }
                parseAttackLine(line, data, lastAttackDate);
            }

            // Always parse special lines (dragons, rituals, etc.)
            const handledBySpecial = parseSpecialLine(line, data);

            // Log lines that are neither attacks nor any recognised special pattern.
            // Known informational sentinels (war notices) are excluded — they're not
            // parsing gaps, just events we intentionally don't count.
            if (!isAttack && !handledBySpecial) {
                const isWarDeclaration = line.includes('declared WAR');
                const isKnownSentinel = isWarDeclaration ||
                                        line.includes('withdrawn from war') ||
                                        line.includes('post-war period');
                if (isWarDeclaration && currentDate) {
                    const isWeDeclared = /We have declared WAR/i.test(line);
                    const m = line.match(/\((\d+):(\d+)\)/);
                    data.warDeclarations.push({
                        who: isWeDeclared ? 'us' : 'them',
                        kingdom: m ? m[1] + ':' + m[2] : null,
                        date: currentDate
                    });
                }
                if (!isKnownSentinel) {
                    logUnrecognizedLine(attackLine.trim(), 'kingdom-news');
                }
            }

            // In normal mode, stop at war end events (preserves existing behaviour)
            if (!warOnly && (line.includes('withdrawn from war') || line.includes('post-war period'))) {
                break;
            }
        }
    }
    
    // Update end date to the last attack date, or keep the current end date if no attacks found
    if (lastAttackDate) {
        data.endDate = lastAttackDate;
    }
    
    // Generate formatted output
    const windowDays = (options && options.uniqueWindow != null) ? parseInt(options.uniqueWindow, 10) : UNIQUE_WINDOW_DAYS;
    return formatKingdomNewsOutput(data, windowDays);
}

/**
 * Parses individual attack lines and updates data structure
 * @param {string} line - Raw attack line
 * @param {Object} data - Parsed data accumulator
 * @param {string} [dateStr] - Current in-game date string e.g. "February 1 of YR0"
 */
function parseAttackLine(line, data, dateStr) {
    // Remove the date part from the beginning of the line
    const dateRegex = /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2} of YR\d+\s*/;
    const attackLine = line.replace(dateRegex, '');
    
    // Province identifier pattern: number - name (kingdom:id)
    const provincePattern = /(\d+) - ([^()]+?) \((\d+):(\d+)\)/g;
    
    // Attack patterns
    const tradMarchPattern = /captured (\d+) acres of land/;
    const tradMarchInvadedPattern = /invaded.*captured (\d+) acres of land/;  // Suffered trad march with "invaded"
    const ambushMadePattern = /recaptured (\d+) acres of land/;  // Made by our kingdom
    const ambushReceivedPattern = /ambushed armies.*and took (\d+) acres of land/;  // Made into our kingdom
    const massacrePattern = /killed (\d+) people within/;
    const razePattern = /razed (\d+) acres/;
    const razeInvadedPattern = /invaded.*razed (\d+) acres/;  // Suffered raze with "invaded"
    const plunderPattern = /attacked and pillaged|invaded and pillaged/;
    const learnPattern = /invaded and looted|attacked and looted/;
    
    // Check for unknown province attacks
    const unknownPattern = /An unknown province from ([^(]+) \((\d+):(\d+)\)/;
    
    let match;
    let attackerProvince, attackerKingdom, defenderProvince, defenderKingdom;
    const provinceMatches = [...attackLine.matchAll(provincePattern)];
    
    if (provinceMatches.length >= 2) {
        // First match is attacker, second match is defender
        const attackerMatch = provinceMatches[0];
        const defenderMatch = provinceMatches[1];
        
        attackerProvince = { 
            number: parseInt(attackerMatch[1]), 
            name: attackerMatch[2].trim(), 
            kingdom: attackerMatch[3] + ':' + attackerMatch[4] 
        };
        attackerKingdom = attackerProvince.kingdom;
        
        defenderProvince = { 
            number: parseInt(defenderMatch[1]), 
            name: defenderMatch[2].trim(), 
            kingdom: defenderMatch[3] + ':' + defenderMatch[4] 
        };
        defenderKingdom = defenderProvince.kingdom;
    } else if (provinceMatches.length === 1) {
        // Only one province found, might be an unknown province attack
        const match = provinceMatches[0];
        defenderProvince = { 
            number: parseInt(match[1]), 
            name: match[2].trim(), 
            kingdom: match[3] + ':' + match[4] 
        };
        defenderKingdom = defenderProvince.kingdom;
        
        // Check for unknown province
        const unknownPattern = /An unknown province from ([^(]+) \((\d+):(\d+)\)/;
        const unknownMatch = attackLine.match(unknownPattern);
        if (unknownMatch) {
            attackerKingdom = unknownMatch[2] + ':' + unknownMatch[3];
            attackerProvince = { number: 0, name: 'An unknown province', kingdom: attackerKingdom };
        }
    }
    
    if (!attackerProvince || !defenderProvince) {
        return;
    }
    
    // Initialize kingdom data if needed
    if (!data.kingdoms[attackerKingdom]) {
        data.kingdoms[attackerKingdom] = {
            attacksMade: 0,
            attacksSuffered: 0,
            acresGained: 0,
            acresLost: 0,
            provinces: {},
            attacksMadeLog: [],
            attacksSufferedLog: [],
            tradMarch: { count: 0, acres: 0 },
            ambush: { count: 0, acres: 0 },
            conquest: { count: 0, acres: 0 },
            raze: { count: 0, acres: 0 },
            learn: { count: 0, acres: 0 },
            massacre: { count: 0, people: 0 },
            plunder: { count: 0, acres: 0 },
            bouncesMade: 0,
            bouncesSuffered: 0,
            dragonsStarted: [],
            dragonsCompleted: [],
            dragonsKilled: [],
            dragonsCancelled: 0,
            ritualsStarted: [],
            ritualsCompleted: 0,
            ritualsFailed: 0
        };
    }

    if (!data.kingdoms[defenderKingdom]) {
        data.kingdoms[defenderKingdom] = {
            attacksMade: 0,
            attacksSuffered: 0,
            acresGained: 0,
            acresLost: 0,
            provinces: {},
            attacksMadeLog: [],
            attacksSufferedLog: [],
            tradMarch: { count: 0, acres: 0 },
            ambush: { count: 0, acres: 0 },
            conquest: { count: 0, acres: 0 },
            raze: { count: 0, acres: 0 },
            learn: { count: 0, acres: 0 },
            massacre: { count: 0, people: 0 },
            plunder: { count: 0, acres: 0 },
            bouncesMade: 0,
            bouncesSuffered: 0,
            dragonsStarted: [],
            dragonsCompleted: [],
            dragonsKilled: [],
            dragonsCancelled: 0,
            ritualsStarted: [],
            ritualsCompleted: 0,
            ritualsFailed: 0
        };
    }

    // Initialize province data
    // Unknown provinces (number === 0) use just the name as the key (no "0 - " prefix)
    const attackerKey = attackerProvince.number > 0
        ? attackerProvince.number + ' - ' + attackerProvince.name
        : attackerProvince.name;
    const defenderKey = defenderProvince.number > 0
        ? defenderProvince.number + ' - ' + defenderProvince.name
        : defenderProvince.name;
    
    if (!data.kingdoms[attackerKingdom].provinces[attackerKey]) {
        data.kingdoms[attackerKingdom].provinces[attackerKey] = {
            attacksMade: 0,
            attacksSuffered: 0,
            acresGained: 0,
            acresLost: 0,
            bouncesMade: 0,
            bouncesReceived: 0
        };
    }

    if (!data.kingdoms[defenderKingdom].provinces[defenderKey]) {
        data.kingdoms[defenderKingdom].provinces[defenderKey] = {
            attacksMade: 0,
            attacksSuffered: 0,
            acresGained: 0,
            acresLost: 0,
            bouncesMade: 0,
            bouncesReceived: 0
        };
    }
    
    // Parse attack type and update statistics
    let attackType = null;
    let acres = 0;
    let people = 0;
    let isActualAttack = false;
    
    // Check for conquest first (has comma after province name)
    if (line.includes(',') && (tradMarchPattern.test(line) || razePattern.test(line) || tradMarchInvadedPattern.test(line) || razeInvadedPattern.test(line))) {
        attackType = 'conquest';
        isActualAttack = true;
        if (tradMarchPattern.test(line)) {
            acres = parseInt(line.match(tradMarchPattern)[1]);
        } else if (tradMarchInvadedPattern.test(line)) {
            acres = parseInt(line.match(tradMarchInvadedPattern)[1]);
        } else if (razePattern.test(line)) {
            const razeAcres = parseInt(line.match(razePattern)[1]);
            acres = 0; // Conquest raze attacks don't capture land either
            // Store raze acres separately for raze summary (only once per attack)
            data.kingdoms[attackerKingdom].raze.acres += razeAcres;
        } else if (razeInvadedPattern.test(line)) {
            const razeAcres = parseInt(line.match(razeInvadedPattern)[1]);
            acres = 0; // Conquest raze attacks don't capture land either
            // Store raze acres separately for raze summary (only once per attack)
            data.kingdoms[attackerKingdom].raze.acres += razeAcres;
        }
    } else if (ambushMadePattern.test(line)) {
        attackType = 'ambush';
        acres = parseInt(line.match(ambushMadePattern)[1]);
        isActualAttack = true;
    } else if (ambushReceivedPattern.test(line)) {
        attackType = 'ambush';
        acres = parseInt(line.match(ambushReceivedPattern)[1]);
        isActualAttack = true;
    } else if (tradMarchInvadedPattern.test(line)) {
        attackType = 'tradMarch';
        acres = parseInt(line.match(tradMarchInvadedPattern)[1]);
        isActualAttack = true;
    } else if (tradMarchPattern.test(line)) {
        attackType = 'tradMarch';
        acres = parseInt(line.match(tradMarchPattern)[1]);
        isActualAttack = true;
    } else if (massacrePattern.test(line)) {
        attackType = 'massacre';
        people = parseInt(line.match(massacrePattern)[1]);
        isActualAttack = false; // Don't count massacres as attacks for war summary
    } else if (razeInvadedPattern.test(line)) {
        attackType = 'raze';
        const razeAcres = parseInt(line.match(razeInvadedPattern)[1]);
        isActualAttack = true;
        acres = 0; // Raze attacks don't capture land for total acres
        // Store raze acres separately for raze summary (only once per attack)
        data.kingdoms[attackerKingdom].raze.acres += razeAcres;
        // Also track raze acres by direction for proper reporting
        if (!data.kingdoms[attackerKingdom].razeAcresMade) {
            data.kingdoms[attackerKingdom].razeAcresMade = 0;
        }
        if (!data.kingdoms[defenderKingdom].razeAcresSuffered) {
            data.kingdoms[defenderKingdom].razeAcresSuffered = 0;
        }
        if (attackerKingdom === data.ownKingdomId) {
            data.kingdoms[attackerKingdom].razeAcresMade += razeAcres;
        }
        if (defenderKingdom === data.ownKingdomId) {
            data.kingdoms[defenderKingdom].razeAcresSuffered += razeAcres;
        }
    } else if (razePattern.test(line)) {
        attackType = 'raze';
        const razeAcres = parseInt(line.match(razePattern)[1]);
        isActualAttack = true;
        acres = 0; // Raze attacks don't capture land for total acres
        // Store raze acres separately for raze summary (only once per attack)
        data.kingdoms[attackerKingdom].raze.acres += razeAcres;
        // Regular raze pattern (without "invaded") means this is a raze attack suffered by our kingdom
        if (!data.kingdoms[defenderKingdom].razeAcresSuffered) {
            data.kingdoms[defenderKingdom].razeAcresSuffered = 0;
        }
        if (defenderKingdom === data.ownKingdomId) {
            data.kingdoms[defenderKingdom].razeAcresSuffered += razeAcres;
        }
    } else if (plunderPattern.test(line)) {
        attackType = 'plunder';
        isActualAttack = false; // Don't count plunder as attacks for war summary
    } else if (learnPattern.test(line)) {
        attackType = 'learn';
        const booksMatch = line.match(/([\d,]+)\s+books/);
        if (booksMatch) {
            acres = parseInt(booksMatch[1].replace(/,/g, ''));
        }
        isActualAttack = false; // Learn attacks steal books, not land
    } else if (line.includes('attempted to invade') || line.includes('attempted an invasion')) {
        attackType = 'bounce';
        isActualAttack = false; // Don't count bounces as successful attacks for land totals
    }
    
    // Process all attacks for attack statistics (both successful and unsuccessful)
    if (attackType) {
        // Track attack for uniques calculation (all attacks including bounces)
        if (dateStr && data.ownKingdomId) {
            const dateVal = dateToNumber(dateStr);
            if (attackerKingdom === data.ownKingdomId) {
                data.kingdoms[attackerKingdom].attacksMadeLog.push({ dateVal, attackerKey });
            }
            if (defenderKingdom === data.ownKingdomId && attackerProvince.number !== 0) {
                // Skip unknown provinces (number === 0) from uniques — can't attribute to a specific province
                data.kingdoms[defenderKingdom].attacksSufferedLog.push({ dateVal, attackerKey });
            }
        }

        // Track attack counts for all kingdoms (needed for province breakdown of enemy kingdoms)
        data.kingdoms[attackerKingdom].attacksMade++;
        data.kingdoms[attackerKingdom].provinces[attackerKey].attacksMade++;
        data.kingdoms[defenderKingdom].attacksSuffered++;
        data.kingdoms[defenderKingdom].provinces[defenderKey].attacksSuffered++;

        // Only process successful attacks for land and acres statistics
        if (isActualAttack) {
            // Update acres for both kingdoms (always, so enemy kingdom breakdowns are correct)
            if (acres > 0) {
                data.kingdoms[attackerKingdom].acresGained += acres;
                data.kingdoms[attackerKingdom].provinces[attackerKey].acresGained += acres;
                data.kingdoms[defenderKingdom].acresLost += acres;
                data.kingdoms[defenderKingdom].provinces[defenderKey].acresLost += acres;
            }
        }
        
        // Update attack type specific stats for both kingdoms
        if (attackType === 'bounce') {
            if (attackerKingdom === data.ownKingdomId) {
                data.kingdoms[attackerKingdom].bouncesMade++;
                data.kingdoms[attackerKingdom].provinces[attackerKey].bouncesMade++;
            }
            if (defenderKingdom === data.ownKingdomId) {
                data.kingdoms[defenderKingdom].bouncesSuffered++;
                data.kingdoms[defenderKingdom].provinces[defenderKey].bouncesReceived++;
            }
        } else {
            // Update attacker kingdom stats
            if (attackerKingdom === data.ownKingdomId) {
                data.kingdoms[attackerKingdom][attackType].count++;
                // For raze attacks, use raze acres for the raze summary, not acres (which is 0)
                if (attackType === 'raze') {
                    const razeAcres = parseInt(line.match(/razed (\d+) acres/)[1]);
                    data.kingdoms[attackerKingdom][attackType].acres += razeAcres;
                } else if (attackType === 'massacre' && people > 0) {
                    data.kingdoms[attackerKingdom].massacre.people += people;
                } else if (acres > 0) {
                    data.kingdoms[attackerKingdom][attackType].acres += acres;
                }
            }
            
            // Update defender kingdom stats
            if (defenderKingdom === data.ownKingdomId) {
                data.kingdoms[defenderKingdom][attackType + 'Suffered'] = (data.kingdoms[defenderKingdom][attackType + 'Suffered'] || 0) + 1;
                if (attackType === 'raze') {
                    data.kingdoms[defenderKingdom].razeSufferedCount = (data.kingdoms[defenderKingdom].razeSufferedCount || 0) + 1;
                } else if (attackType === 'massacre' && people > 0) {
                    data.kingdoms[defenderKingdom].massacreSufferedPeople = (data.kingdoms[defenderKingdom].massacreSufferedPeople || 0) + people;
                } else if (acres > 0) {
                    // Track per-type suffered acres (for learn, acres = books looted)
                    data.kingdoms[defenderKingdom][attackType + 'SufferedAcres'] = (data.kingdoms[defenderKingdom][attackType + 'SufferedAcres'] || 0) + acres;
                }
            }
        }
        
        // Update highlights — only for attacks involving own kingdom
        updateHighlights(data, attackType, attackerProvince, defenderProvince, acres, people,
                         attackerKingdom === data.ownKingdomId, defenderKingdom === data.ownKingdomId);
    } else {
        // Still process special attacks like massacres for statistics, but don't count as main attacks
        if (attackType === 'massacre') {
            data.kingdoms[attackerKingdom].massacre.count++;
            data.kingdoms[attackerKingdom].massacre.people += people;
            data.kingdoms[defenderKingdom].massacreSuffered = (data.kingdoms[defenderKingdom].massacreSuffered || 0) + 1;
        } else if (attackType === 'plunder') {
            data.kingdoms[attackerKingdom].plunder.count++;
            data.kingdoms[defenderKingdom].plunderSuffered = (data.kingdoms[defenderKingdom].plunderSuffered || 0) + 1;
        } else if (attackType === 'bounce') {
            data.kingdoms[attackerKingdom].bouncesMade++;
            data.kingdoms[defenderKingdom].bouncesSuffered++;
        }
    }
}

/**
 * Parses special lines (dragons, rituals, etc.)
 */
function parseSpecialLine(line, data) {
    const own = data.ownKingdomId;

    // ── Own-kingdom dragon actions ────────────────────────────────────────
    // "Our kingdom has begun the [Type] Dragon project, [Name], targeted at Unnamed kingdom (X:Y)."
    if (line.includes('Our kingdom') && line.includes('has begun the') && line.includes('Dragon project')) {
        if (own && data.kingdoms[own]) {
            const tm = line.match(/has begun the (\w+) Dragon project/);
            data.kingdoms[own].dragonsStarted.push(tm ? tm[1] : null);
        }
        return true;
    }

    // "[Province] has completed our dragon, [Name], and it sets flight to ravage Unnamed kingdom (X:Y)!"
    // The (X:Y) in this line is the TARGET, not the source kingdom — always own kingdom's dragon.
    // Dragon type is not present in this line; push null so the count is tracked.
    if (line.includes('has completed our dragon')) {
        if (own && data.kingdoms[own]) {
            data.kingdoms[own].dragonsCompleted.push(null);
        }
        return true;
    }

    // "[Province] has slain the dragon, [Name], ravaging our lands!" — own province killed enemy dragon
    // Dragon type is not present in this line; push null so the count is tracked.
    if (line.includes('has slain the dragon') && line.includes('ravaging our lands')) {
        if (own && data.kingdoms[own]) {
            data.kingdoms[own].dragonsKilled.push(null);
        }
        return true;
    }

    // "Our kingdom has cancelled the dragon project to Unnamed kingdom (X:Y)."
    if (line.includes('Our kingdom has cancelled the dragon project')) {
        if (own && data.kingdoms[own]) {
            data.kingdoms[own].dragonsCancelled = (data.kingdoms[own].dragonsCancelled || 0) + 1;
        }
        return true;
    }

    // ── Enemy dragon actions (tracked on enemy kingdom for the "Suffered" section) ──
    // "Unnamed kingdom (X:Y) has begun the [Type] Dragon project, [Name], against us!"
    if (line.includes('has begun the') && line.includes('Dragon project') && line.includes('against us')) {
        const m = line.match(/\((\d+):(\d+)\)/);
        if (m) {
            const kId = m[1] + ':' + m[2];
            if (!data.kingdoms[kId]) {
                data.kingdoms[kId] = {
                    attacksMade: 0, attacksSuffered: 0, acresGained: 0, acresLost: 0,
                    provinces: {}, attacksMadeLog: [], attacksSufferedLog: [],
                    tradMarch: { count: 0, acres: 0 }, ambush: { count: 0, acres: 0 },
                    conquest: { count: 0, acres: 0 }, raze: { count: 0, acres: 0 },
                    learn: { count: 0, acres: 0 }, massacre: { count: 0, people: 0 },
                    plunder: { count: 0, acres: 0 }, bouncesMade: 0, bouncesSuffered: 0,
                    dragonsStarted: [], dragonsCompleted: [], dragonsKilled: [],
                    dragonsCancelled: 0, ritualsStarted: [], ritualsCompleted: 0, ritualsFailed: 0
                };
            }
            const tm = line.match(/has begun the (\w+) Dragon project/);
            data.kingdoms[kId].dragonsStarted.push(tm ? tm[1] : null);
        }
        return true;
    }

    // "A [Type] Dragon, [Name], from Unnamed kingdom (X:Y) has begun ravaging our lands!"
    // Enemy dragon completed development and is now attacking — counts as dragonsCompleted for enemy.
    if (line.includes('Dragon') && line.includes('from Unnamed kingdom') && line.includes('has begun ravaging our lands')) {
        const m = line.match(/from Unnamed kingdom \((\d+):(\d+)\)/);
        if (m) {
            const kId = m[1] + ':' + m[2];
            if (!data.kingdoms[kId]) {
                data.kingdoms[kId] = {
                    attacksMade: 0, attacksSuffered: 0, acresGained: 0, acresLost: 0,
                    provinces: {}, attacksMadeLog: [], attacksSufferedLog: [],
                    tradMarch: { count: 0, acres: 0 }, ambush: { count: 0, acres: 0 },
                    conquest: { count: 0, acres: 0 }, raze: { count: 0, acres: 0 },
                    learn: { count: 0, acres: 0 }, massacre: { count: 0, people: 0 },
                    plunder: { count: 0, acres: 0 }, bouncesMade: 0, bouncesSuffered: 0,
                    dragonsStarted: [], dragonsCompleted: [], dragonsKilled: [],
                    dragonsCancelled: 0, ritualsStarted: [], ritualsCompleted: 0, ritualsFailed: 0
                };
            }
            const tm = line.match(/\bA (\w+) Dragon,/);
            data.kingdoms[kId].dragonsCompleted.push(tm ? tm[1] : null);
        }
        return true;
    }

    // ── Ritual patterns ───────────────────────────────────────────────────
    // "We have started developing a ritual! (Barrier)!"
    if (line.includes('started developing a ritual')) {
        if (own && data.kingdoms[own]) {
            const rm = line.match(/\(([^)]+)\)/);
            data.kingdoms[own].ritualsStarted.push(rm ? rm[1] : null);
        }
        return true;
    }

    // "Sadly, we have failed summoning the ritual to cover our lands!"
    // The summoning failed — not a start and not a completion.
    if (line.includes('failed summoning the ritual')) {
        if (own && data.kingdoms[own]) {
            data.kingdoms[own].ritualsFailed = (data.kingdoms[own].ritualsFailed || 0) + 1;
        }
        return true;
    }

    // "Our ritual [name] has been completed!" — successful ritual cast
    if (line.includes('Our ritual') && line.includes('completed')) {
        if (own && data.kingdoms[own]) {
            data.kingdoms[own].ritualsCompleted++;
        }
        return true;
    }

    // "A ritual is covering our lands! (Haste)" — active ritual coverage
    if (line.includes('A ritual is covering our lands')) {
        const m = line.match(/\((\w+)\)/);
        data.ritualCoverage.push(m ? m[1] : 'Unknown');
        return true;
    }

    // "Unnamed kingdom (5:3) has cancelled their dragon project targeted at us."
    if (line.includes('has cancelled their dragon project')) {
        const m = line.match(/\((\d+):(\d+)\)/);
        if (m) {
            const kId = m[1] + ':' + m[2];
            if (!data.kingdoms[kId]) {
                data.kingdoms[kId] = {
                    attacksMade: 0, attacksSuffered: 0, acresGained: 0, acresLost: 0,
                    provinces: {}, attacksMadeLog: [], attacksSufferedLog: [],
                    tradMarch: { count: 0, acres: 0 }, ambush: { count: 0, acres: 0 },
                    conquest: { count: 0, acres: 0 }, raze: { count: 0, acres: 0 },
                    learn: { count: 0, acres: 0 }, massacre: { count: 0, people: 0 },
                    plunder: { count: 0, acres: 0 }, bouncesMade: 0, bouncesSuffered: 0,
                    dragonsStarted: [], dragonsCompleted: [], dragonsKilled: [],
                    dragonsCancelled: 0, ritualsStarted: [], ritualsCompleted: 0, ritualsFailed: 0
                };
            }
            data.kingdoms[kId].dragonsCancelled++;
        }
        return true;
    }

    // "We have withdrawn our ceasefire proposal to Unnamed kingdom (5:3)."
    if (line.includes('have withdrawn our ceasefire proposal')) {
        const m = line.match(/to Unnamed kingdom \((\d+):(\d+)\)/);
        if (m) data.ceasefireWithdrawals.push(m[1] + ':' + m[2]);
        return true;
    }

    // "Unnamed kingdom (5:3) has proposed a formal ceasefire with our kingdom."
    if (line.includes('has proposed a formal ceasefire')) {
        const m = line.match(/\((\d+):(\d+)\)/);
        if (m) data.ceasefireProposals.push(m[1] + ':' + m[2]);
        return true;
    }

    // "We have entered into a formal ceasefire with Phoenix STFO (2:2). It will be unbreakable until..."
    if (line.includes('entered into a formal ceasefire')) {
        data.ceasefireEntered++;
        return true;
    }

    return false;
}

/**
 * Updates highlights based on attack data
 */
function updateHighlights(data, attackType, attacker, defender, acres, people, isAttackerOwn, isDefenderOwn) {
    if (attackType === 'tradMarch' && acres > 0) {
        if (isAttackerOwn && acres > data.highlights.mostLandGainedTrad.acres) {
            data.highlights.mostLandGainedTrad = {
                province: attacker.number + ' - ' + attacker.name,
                acres: acres
            };
        }
        if (isDefenderOwn && acres > data.highlights.mostLandLostTrad.acres) {
            data.highlights.mostLandLostTrad = {
                province: defender.number + ' - ' + defender.name,
                acres: acres
            };
        }
    }

    if (attackType === 'ambush' && acres > 0) {
        if (isAttackerOwn && acres > data.highlights.mostLandGainedAmbush.acres) {
            data.highlights.mostLandGainedAmbush = {
                province: attacker.number + ' - ' + attacker.name,
                acres: acres
            };
        }
        if (isDefenderOwn && acres > data.highlights.mostLandLostAmbush.acres) {
            data.highlights.mostLandLostAmbush = {
                province: defender.number + ' - ' + defender.name,
                acres: acres
            };
        }
    }
}

/**
 * Formats the final Kingdom News output
 */
function formatKingdomNewsOutput(data, windowDays) {
    if (windowDays == null) windowDays = UNIQUE_WINDOW_DAYS;
    const output = [];

    // Returns " (Type, Type, ...)" for known dragon types, or "" if none are known
    function dragonTypeSuffix(types) {
        const known = types.filter(t => t !== null);
        return known.length > 0 ? ' (' + known.join(', ') + ')' : '';
    }

    // Helper: format a date string as "Month Day, YRN"
    function fmtDate(dateStr) {
        if (!dateStr) return null;
        const m = dateStr.match(/^(\w+) (\d+) of (YR\d+)/);
        return m ? `${m[1]} ${m[2]}, ${m[3]}` : dateStr;
    }

    // Header
    output.push('Kingdom News Report from UtopiaFormatter.com');

    // War Only header line(s) — inserted immediately after the title
    if (data.warOnly && data.warPeriods && data.warPeriods.length > 0) {
        for (const period of data.warPeriods) {
            const ownStr   = data.ownKingdomId ? `(${data.ownKingdomId})` : '(unknown)';
            const oppStr   = period.opponentId  ? `(${period.opponentId})` : '(unknown)';
            const startStr = period.startDate ? fmtDate(period.startDate) : 'start of log';
            const endStr   = period.endDate   ? fmtDate(period.endDate)   : 'end of log';
            output.push(`Showing only attacks between Kingdoms ${ownStr} and ${oppStr} \u2014 ${startStr} to ${endStr}`);
            if (!period.opponentId) {
                output.push(`Warning: war opponent could not be identified \u2014 no filtering applied`);
            }
        }
    }

    // Date range (use dateToNumber for reliable day count)
    if (data.startDate && data.endDate) {
        const startParts = data.startDate.match(/^(\w+) (\d+) of (YR\d+)/);
        const endParts   = data.endDate.match(/^(\w+) (\d+) of (YR\d+)/);
        if (startParts && endParts) {
            const totalDays = dateToNumber(data.endDate) - dateToNumber(data.startDate) + 1;
            output.push(`${startParts[1]} ${startParts[2]}, ${startParts[3]} - ${endParts[1]} ${endParts[2]}, ${endParts[3]} (${totalDays} days)`);
        }
    }

    output.push('');

    const ownKingdomId = data.ownKingdomId;
    const ownKingdom = ownKingdomId ? data.kingdoms[ownKingdomId] : null;

    // Pre-compute uniques (needed in both summary and kingdom sections)
    const madeUniques    = ownKingdom ? calculateUniques(ownKingdom.attacksMadeLog,    windowDays) : { total: 0, perAttacker: {} };
    const sufferedUniques = ownKingdom ? calculateUniques(ownKingdom.attacksSufferedLog, windowDays) : { total: 0, perAttacker: {} };

    if (ownKingdom) {
        // ── Own Kingdom Summary ──────────────────────────────────────────
        output.push(`** Own Kingdom ${ownKingdomId} Summary **`);
        output.push(`Total Attacks Made: ${ownKingdom.attacksMade} (${ownKingdom.acresGained} acres)`);
        output.push(`-- Uniques: ${madeUniques.total}`);
        if (ownKingdom.tradMarch.count > 0)
            output.push(`-- Trad March: ${ownKingdom.tradMarch.count} (${ownKingdom.tradMarch.acres} acres)`);
        if (ownKingdom.ambush.count > 0)
            output.push(`-- Ambush: ${ownKingdom.ambush.count} (${ownKingdom.ambush.acres} acres)`);
        if (ownKingdom.conquest.count > 0)
            output.push(`-- Conquest: ${ownKingdom.conquest.count} (${ownKingdom.conquest.acres} acres)`);
        if (ownKingdom.raze.count > 0)
            output.push(`-- Raze: ${ownKingdom.raze.count} (${ownKingdom.razeAcresMade || 0} acres)`);
        if (ownKingdom.learn.count > 0)
            output.push(`-- Learn: ${ownKingdom.learn.count} (${formatNumber(ownKingdom.learn.acres)} books)`);
        if (ownKingdom.massacre.count > 0)
            output.push(`-- Massacre: ${ownKingdom.massacre.count} (${ownKingdom.massacre.people} people)`);
        if (ownKingdom.bouncesMade > 0) {
            const pct = ownKingdom.attacksMade > 0 ? Math.round(ownKingdom.bouncesMade / ownKingdom.attacksMade * 100) : 0;
            output.push(`-- Bounces: ${ownKingdom.bouncesMade} (${pct}%)`);
        }
        if (ownKingdom.dragonsStarted.length > 0)
            output.push(`-- Dragons Started: ${ownKingdom.dragonsStarted.length}${dragonTypeSuffix(ownKingdom.dragonsStarted)}`);
        if (ownKingdom.dragonsCompleted.length > 0)
            output.push(`-- Dragons Completed: ${ownKingdom.dragonsCompleted.length}${dragonTypeSuffix(ownKingdom.dragonsCompleted)}`);
        if (ownKingdom.dragonsKilled.length > 0)
            output.push(`-- Enemy Dragons Killed: ${ownKingdom.dragonsKilled.length}${dragonTypeSuffix(ownKingdom.dragonsKilled)}`);
        if ((ownKingdom.dragonsCancelled || 0) > 0)
            output.push(`-- Dragons Cancelled: ${ownKingdom.dragonsCancelled}`);
        if (ownKingdom.ritualsStarted.length > 0)
            output.push(`-- Rituals Started: ${ownKingdom.ritualsStarted.length}${dragonTypeSuffix(ownKingdom.ritualsStarted)}`);
        if (ownKingdom.ritualsCompleted > 0)  output.push(`-- Rituals Completed: ${ownKingdom.ritualsCompleted}`);
        if ((ownKingdom.ritualsFailed || 0) > 0) output.push(`-- Rituals Failed: ${ownKingdom.ritualsFailed}`);

        output.push(`Total Attacks Suffered: ${ownKingdom.attacksSuffered} (${ownKingdom.acresLost} acres)`);
        output.push(`-- Uniques: ${sufferedUniques.total}`);
        if ((ownKingdom.tradMarchSuffered || 0) > 0)
            output.push(`-- Trad March: ${ownKingdom.tradMarchSuffered} (${ownKingdom.tradMarchSufferedAcres || 0} acres)`);
        if ((ownKingdom.ambushSuffered || 0) > 0)
            output.push(`-- Ambush: ${ownKingdom.ambushSuffered} (${ownKingdom.ambushSufferedAcres || 0} acres)`);
        if ((ownKingdom.conquestSuffered || 0) > 0)
            output.push(`-- Conquest: ${ownKingdom.conquestSuffered} (${ownKingdom.conquestSufferedAcres || 0} acres)`);
        if ((ownKingdom.razeSufferedCount || 0) > 0)
            output.push(`-- Raze: ${ownKingdom.razeSufferedCount} (${ownKingdom.razeAcresSuffered || 0} acres)`);
        if ((ownKingdom.learnSuffered || 0) > 0)
            output.push(`-- Learn: ${ownKingdom.learnSuffered} (${formatNumber(ownKingdom.learnSufferedAcres || 0)} books)`);
        if ((ownKingdom.massacreSuffered || 0) > 0)
            output.push(`-- Massacre: ${ownKingdom.massacreSuffered} (${ownKingdom.massacreSufferedPeople || 0} people)`);
        if ((ownKingdom.plunderSuffered || 0) > 0)
            output.push(`-- Plunder: ${ownKingdom.plunderSuffered}`);
        if (ownKingdom.bouncesSuffered > 0) {
            const pct = ownKingdom.attacksSuffered > 0 ? Math.round(ownKingdom.bouncesSuffered / ownKingdom.attacksSuffered * 100) : 0;
            output.push(`-- Bounces: ${ownKingdom.bouncesSuffered} (${pct}%)`);
        }
        // Enemy dragons (tracked on each enemy kingdom)
        const enemyDragonsStartedTypes = [];
        const enemyDragonsCompletedTypes = [];
        for (const [kId, kData] of Object.entries(data.kingdoms)) {
            if (kId !== ownKingdomId) {
                enemyDragonsStartedTypes.push(...(kData.dragonsStarted  || []));
                enemyDragonsCompletedTypes.push(...(kData.dragonsCompleted || []));
            }
        }
        if (enemyDragonsStartedTypes.length > 0)
            output.push(`-- Enemy Dragons Started: ${enemyDragonsStartedTypes.length}${dragonTypeSuffix(enemyDragonsStartedTypes)}`);
        if (enemyDragonsCompletedTypes.length > 0)
            output.push(`-- Enemy Dragons Completed: ${enemyDragonsCompletedTypes.length}${dragonTypeSuffix(enemyDragonsCompletedTypes)}`);
        const enemyDragonsCancelled = Object.entries(data.kingdoms)
            .filter(([kId]) => kId !== ownKingdomId)
            .reduce((sum, [, kData]) => sum + (kData.dragonsCancelled || 0), 0);
        if (enemyDragonsCancelled > 0)
            output.push(`-- Enemy Dragons Cancelled: ${enemyDragonsCancelled}`);
        if (data.ritualCoverage.length > 0) {
            const rtCounts = {};
            for (const t of data.ritualCoverage) rtCounts[t] = (rtCounts[t] || 0) + 1;
            const typeStr = Object.entries(rtCounts).map(([t, n]) => n > 1 ? `${t} x${n}` : t).join(', ');
            output.push(`-- Ritual Coverage: ${data.ritualCoverage.length} (${typeStr})`);
        }
        output.push('');

        // ── Own Kingdom Province Breakdown ───────────────────────────────
        output.push(`** Own Kingdom ${ownKingdomId} **`);
        const ownNet = ownKingdom.acresGained - ownKingdom.acresLost;
        const ownNetStr = (ownNet >= 0 ? '+' : '') + ownNet;
        output.push(`Total land exchanged: ${ownNetStr} (${ownKingdom.attacksMade}/${ownKingdom.attacksSuffered})`);

        const ownProvinceList = [];
        for (const [pName, pData] of Object.entries(ownKingdom.provinces)) {
            ownProvinceList.push({
                name: pName,
                netAcres: pData.acresGained - pData.acresLost,
                attacksMade: pData.attacksMade,
                attacksSuffered: pData.attacksSuffered
            });
        }
        ownProvinceList.sort((a, b) => b.netAcres - a.netAcres);
        for (const p of ownProvinceList) {
            output.push(`${p.netAcres.toString().padStart(6)} | ${p.name} (${p.attacksMade}/${p.attacksSuffered})`);
        }

        output.push('');

        // ── Uniques for own kingdom ──────────────────────────────────────
        output.push(`** Uniques for ${ownKingdomId} **`);
        const ownUniquesList = Object.entries(madeUniques.perAttacker)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
        for (const u of ownUniquesList) {
            output.push(`${u.name} ${u.count}`);
        }
        output.push('');
    }

    // ── Enemy Kingdoms ───────────────────────────────────────────────────
    for (const [kingdomId, kingdomData] of Object.entries(data.kingdoms)) {
        if (kingdomId === ownKingdomId) continue;

        output.push(`** The Kingdom of ${kingdomId} **`);
        const kNet = kingdomData.acresGained - kingdomData.acresLost;
        output.push(`Total land exchanged: ${kNet} (${kingdomData.attacksMade}/${kingdomData.attacksSuffered})`);

        const kProvinceList = [];
        for (const [pName, pData] of Object.entries(kingdomData.provinces)) {
            kProvinceList.push({
                name: pName,
                netAcres: pData.acresGained - pData.acresLost,
                attacksMade: pData.attacksMade,
                attacksSuffered: pData.attacksSuffered
            });
        }
        kProvinceList.sort((a, b) => b.netAcres - a.netAcres);
        for (const p of kProvinceList) {
            output.push(`${p.netAcres.toString().padStart(6)} | ${p.name} (${p.attacksMade}/${p.attacksSuffered})`);
        }

        output.push('');

        // Uniques for this kingdom — attacks they made into our kingdom
        output.push(`** Uniques for ${kingdomId} **`);
        const enemyUniquesList = Object.entries(sufferedUniques.perAttacker)
            .filter(([name]) => kingdomData.provinces[name] !== undefined)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
        for (const u of enemyUniquesList) {
            output.push(`${u.name} ${u.count}`);
        }
        output.push('');
    }

    // ── Highlights ───────────────────────────────────────────────────────
    const highlightLines = [];
    const h = data.highlights;

    if (h.mostLandGainedTrad.acres > 0)
        highlightLines.push(`Most land gained in a single trad march - ${h.mostLandGainedTrad.province}: ${h.mostLandGainedTrad.acres}`);
    if (h.mostLandLostTrad.acres > 0)
        highlightLines.push(`Most land lost in a single trad march - ${h.mostLandLostTrad.province}: ${h.mostLandLostTrad.acres}`);
    if (h.mostLandGainedAmbush.acres > 0)
        highlightLines.push(`Most land gained in a single ambush - ${h.mostLandGainedAmbush.province}: ${h.mostLandGainedAmbush.acres}`);
    if (h.mostLandLostAmbush.acres > 0)
        highlightLines.push(`Most land lost in a single ambush - ${h.mostLandLostAmbush.province}: ${h.mostLandLostAmbush.acres}`);

    // Bounce highlights — computed from per-province data
    if (ownKingdom) {
        let maxMade = 0;
        const topMade = [];
        let maxReceived = 0;
        const topReceived = [];

        for (const [pName, pData] of Object.entries(ownKingdom.provinces)) {
            if (pData.bouncesMade > maxMade) {
                maxMade = pData.bouncesMade;
                topMade.length = 0;
                topMade.push(pName);
            } else if (pData.bouncesMade === maxMade && maxMade > 0) {
                topMade.push(pName);
            }
            if (pData.bouncesReceived > maxReceived) {
                maxReceived = pData.bouncesReceived;
                topReceived.length = 0;
                topReceived.push(pName);
            } else if (pData.bouncesReceived === maxReceived && maxReceived > 0) {
                topReceived.push(pName);
            }
        }

        if (maxMade > 0) {
            highlightLines.push(`Most bounces made - ${topMade.join(', ')}: ${maxMade}`);
        } else if (highlightLines.length > 0) {
            // Show zero line only when other highlights exist
            highlightLines.push(`Most bounces made - : 0`);
        }

        if (maxReceived > 0) {
            highlightLines.push(`Most bounces received - ${topReceived.join(', ')}: ${maxReceived}`);
        }
    }

    if (highlightLines.length > 0) {
        output.push('** Highlights **');
        for (const line of highlightLines) {
            output.push(line);
        }
    }

    // ── Kingdom Relations ─────────────────────────────────────────────────────
    const krLines = [];
    if (data.ceasefireProposals.length > 0)
        krLines.push(`-- Ceasefire Proposals Received: ${data.ceasefireProposals.length}`);
    if (data.ceasefireWithdrawals.length > 0)
        krLines.push(`-- Ceasefire Withdrawals Made: ${data.ceasefireWithdrawals.length}`);
    if (data.ceasefireEntered > 0)
        krLines.push(`-- Formal Ceasefires Entered: ${data.ceasefireEntered}`);
    const theyDeclaredWar = data.warDeclarations.filter(w => w.who === 'them').length;
    const weDeclaredWar   = data.warDeclarations.filter(w => w.who === 'us').length;
    if (theyDeclaredWar > 0)
        krLines.push(`-- War Declarations Against Us: ${theyDeclaredWar}`);
    if (weDeclaredWar > 0)
        krLines.push(`-- War Declarations Made: ${weDeclaredWar}`);
    if (krLines.length > 0) {
        output.push('');
        output.push('** Kingdom Relations **');
        output.push(...krLines);
    }

    return output.join('\n');
}

// =============================================================================
// PROVINCE NEWS PARSING
// =============================================================================

/**
 * Converts a Province News date string to "Month YR#" label.
 * @param {string} dateStr - e.g. "February 1 of YR1"
 * @returns {string} - e.g. "February YR1"
 */
function pnMonthYear(dateStr) {
    const m = dateStr.match(/^(\w+) \d+ of (YR\d+)$/);
    return m ? `${m[1]} ${m[2]}` : dateStr;
}

/**
 * Parses a single Province News event line (date prefix already stripped).
 * Mutates the data object in-place.
 * @param {string} ev - Event text (date prefix removed)
 * @param {string} dateStr - Original date string e.g. "February 1 of YR1"
 * @param {Object} data - Accumulator object
 */
function parseProvinceNewsLine(ev, dateStr, data) {
    // Strip Faery leyline prefix that can prepend spell attempt lines
    const faeryPrefix = "Your spell is disrupted by the natural leyline energies surrounding the target's Faery province, causing it to fail completely. ";
    if (ev.startsWith(faeryPrefix)) ev = ev.slice(faeryPrefix.length);

    let m;

    // Monthly Land
    m = ev.match(/Our people decided to explore new territories and have settled (\d+) acres of new land\./);
    if (m) {
        data.monthlyLand.push({ month: pnMonthYear(dateStr), acres: parseInt(m[1]) });
        return;
    }

    // Monthly Income
    m = ev.match(/generate ([\d,]+) gold coins\. Additionally, your scholars .+ contributing ([\d,]+) books/);
    if (m) {
        data.monthlyIncome.push({
            month: pnMonthYear(dateStr),
            gold: parseInt(m[1].replace(/,/g, '')),
            books: parseInt(m[2].replace(/,/g, ''))
        });
        return;
    }

    // New Scientist
    m = ev.match(/A new scientist, Recruit (.+?) \((.+?)\), has emerged/);
    if (m) {
        data.scientists.push({ name: m[1], field: m[2] });
        return;
    }

    // Aid Received — Runes
    m = ev.match(/We have received a shipment of ([\d,]+) runes from (.+?) \((.+?)\)\./);
    if (m) {
        const amount = parseInt(m[1].replace(/,/g, ''));
        const sender = `${m[2]} (${m[3]})`;
        data.aidByResource.runes.total += amount;
        data.aidByResource.runes.shipments++;
        data.aidByResource.runes.senders[sender] = (data.aidByResource.runes.senders[sender] || 0) + amount;
        return;
    }

    // Aid Received — Gold coins
    m = ev.match(/We have received a shipment of ([\d,]+) gold coins from (.+?) \((.+?)\)\./);
    if (m) {
        const amount = parseInt(m[1].replace(/,/g, ''));
        const sender = `${m[2]} (${m[3]})`;
        data.aidByResource.gold.total += amount;
        data.aidByResource.gold.shipments++;
        data.aidByResource.gold.senders[sender] = (data.aidByResource.gold.senders[sender] || 0) + amount;
        return;
    }

    // Aid Received — Bushels
    m = ev.match(/We have received a shipment of ([\d,]+) bushels from (.+?) \((.+?)\)\./);
    if (m) {
        const amount = parseInt(m[1].replace(/,/g, ''));
        const sender = `${m[2]} (${m[3]})`;
        data.aidByResource.bushels.total += amount;
        data.aidByResource.bushels.shipments++;
        data.aidByResource.bushels.senders[sender] = (data.aidByResource.bushels.senders[sender] || 0) + amount;
        return;
    }

    // Aid Received — Explore pool acres
    m = ev.match(/We have received a shipment of ([\d,]+) explore pool acres \((\d+) acres lost!\) from (.+?) \((.+?)\)\./);
    if (m) {
        const gross = parseInt(m[1].replace(/,/g, ''));
        const lost = parseInt(m[2]);
        const sender = `${m[3]} (${m[4]})`;
        data.aidByResource.exploreAcres.total += gross;
        data.aidByResource.exploreAcres.lost += lost;
        data.aidByResource.exploreAcres.shipments++;
        data.aidByResource.exploreAcres.senders[sender] = (data.aidByResource.exploreAcres.senders[sender] || 0) + gross;
        return;
    }

    // Aid Received — Soldiers
    m = ev.match(/We have received a shipment of ([\d,]+) soldiers from (.+?) \((.+?)\)\./);
    if (m) {
        const amount = parseInt(m[1].replace(/,/g, ''));
        const sender = `${m[2]} (${m[3]})`;
        data.aidByResource.soldiers.total += amount;
        data.aidByResource.soldiers.shipments++;
        data.aidByResource.soldiers.senders[sender] = (data.aidByResource.soldiers.senders[sender] || 0) + amount;
        return;
    }

    // Resources Stolen — Runes
    m = ev.match(/([\d,]+) runes of our runes were stolen!/);
    if (m) {
        data.stolen.runes += parseInt(m[1].replace(/,/g, ''));
        return;
    }

    // Resources Stolen — Gold coins
    m = ev.match(/([\d,]+) gold coins were stolen from our coffers!/);
    if (m) {
        data.stolen.gold += parseInt(m[1].replace(/,/g, ''));
        return;
    }

    // Resources Stolen — Bushels (Uto-9row — pattern inferred; confirm from real log data)
    m = ev.match(/([\d,]+) bushels.*stolen/i);
    if (m) {
        data.stolen.bushels += parseInt(m[1].replace(/,/g, ''));
        return;
    }

    // Resources Stolen — War Horses (Uto-9row — TODO: log text unknown, confirm from real data)
    // m = ev.match(/TODO war horses stolen pattern/);
    // if (m) { data.stolen.warHorses += ...; return; }

    // Shadowlight — Attacker identified (check before thievery interception)
    m = ev.match(/Shadowlight has revealed that (.+?) \((.+?)\) was responsible for this attack\./);
    if (m) {
        data.shadowlightAttackers.push(`${m[1]} (${m[2]})`);
        return;
    }

    // Thievery — Shadowlight intercepted (prevented)
    m = ev.match(/Shadowlight has revealed thieves from (.+?) \((.+?)\) causing trouble and prevented/);
    if (m) {
        data.thieveryIntercepted++;
        const source = `${m[1]} (${m[2]})`;
        data.interceptedBySource[source] = (data.interceptedBySource[source] || 0) + 1;
        return;
    }

    // Thievery — Known source
    m = ev.match(/We have found thieves from (.+?) \((.+?)\) causing trouble within our lands!/);
    if (m) {
        const source = `${m[1]} (${m[2]})`;
        data.thieveryDetected++;
        data.thieveryBySource[source] = (data.thieveryBySource[source] || 0) + 1;
        return;
    }

    // Thievery — Unknown source
    if (ev.indexOf('We have found thieves causing trouble within our lands. Unfortunately, we know not where they came from.') !== -1) {
        data.thieveryDetected++;
        data.thieveryUnknown++;
        return;
    }

    // Spell Attempts
    m = ev.match(/Our mages noticed a possible spell attempt by (.+?) \((.+?)\) causing trouble on our lands!/);
    if (m) {
        const source = `${m[1]} (${m[2]})`;
        data.spellAttempts++;
        data.spellsBySource[source] = (data.spellsBySource[source] || 0) + 1;
        return;
    }

    // Attacks Suffered
    m = ev.match(/Forces from (.+) \((\d+:\d+)\) came through and ravaged our lands! They (captured ([\d,]+) acres|looted ([\d,]+) books)/);
    if (m) {
        data.attacks.push({
            attacker: m[1].trim(),
            kingdom: m[2],
            acresCaptured: m[4] ? parseInt(m[4].replace(/,/g, '')) : 0,
            booksLooted: m[5] ? parseInt(m[5].replace(/,/g, '')) : 0
        });
        return;
    }

    // Meteor shower — damage ticks (count days of damage and casualties)
    m = ev.match(/Meteors rain across the lands and kill (.+)!/);
    if (m) {
        const cs = m[1];
        const peas = cs.match(/(\d+) peasants?/);
        const sol  = cs.match(/(\d+) soldiers?/);
        const mags = cs.match(/(\d+) Magicians?/);
        const bsts = cs.match(/(\d+) Beastmasters?/);
        if (peas) data.meteorCasualties.peasants    += parseInt(peas[1]);
        if (sol)  data.meteorCasualties.soldiers    += parseInt(sol[1]);
        if (mags) data.meteorCasualties.Magicians   += parseInt(mags[1]);
        if (bsts) data.meteorCasualties.Beastmasters += parseInt(bsts[1]);
        data.meteorDays++;
        return;
    }

    // Meteor shower — start announcement (no data to extract beyond noting it)
    if (ev.indexOf('Meteors rain across our lands') !== -1) return;

    // Rioting
    m = ev.match(/Rioting has started amongst our people\. Our tax collection efforts will be hampered for (\d+) days!/);
    if (m) {
        data.rioting.count++;
        data.rioting.totalDays += parseInt(m[1]);
        return;
    }

    // Pitfalls
    m = ev.match(/Pitfalls are haunting our lands for (\d+) days/);
    if (m) {
        data.pitfalls.count++;
        data.pitfalls.totalDays += parseInt(m[1]);
        return;
    }

    // Mana disruption — lasting effect
    m = ev.match(/Our Wizards' ability to regain their mana has been disrupted! Our mana recovery will be affected for (\d+) days?!/);
    if (m) {
        data.manaDis.count++;
        data.manaDis.totalDays += parseInt(m[1]);
        return;
    }

    // Mana disruption — instant recovery (0 days)
    if (ev.indexOf("Our Wizards' ability to regain their mana has been disrupted! Fortunately") !== -1) {
        data.manaDis.count++;
        return;
    }

    // Greed (Soldier upkeep demands)
    m = ev.match(/Enemies have convinced our soldiers to demand more money for upkeep for (\d+) days\./);
    if (m) {
        data.greed.count++;
        data.greed.totalDays += parseInt(m[1]);
        return;
    }

    // Non-instant offensive spells — Province News exact message text not yet confirmed;
    // patterns are derived from Province Logs cast messages and will match the likely
    // victim-perspective wording. Update the regex once real Province News data is seen.

    // Blizzard ("Blizzards will beset the works of [province] for N days!" → victim view)
    m = ev.match(/[Bb]lizzard.{0,80}?(\d+) days?/);
    if (m) { data.blizzard.count++; data.blizzard.totalDays += parseInt(m[1]); return; }

    // Chastity ("womenfolk have taken a vow of chastity for N days!")
    m = ev.match(/vow of chastity for (\d+) days?/);
    if (m) { data.chastity.count++; data.chastity.totalDays += parseInt(m[1]); return; }

    // Droughts ("A drought will reign over our lands for N days!")
    m = ev.match(/[Dd]rought.{0,80}?(\d+) days?/);
    if (m) { data.droughts.count++; data.droughts.totalDays += parseInt(m[1]); return; }

    // Explosions ("Explosions will rock our aid shipments for N days!")
    m = ev.match(/[Ee]xplosion.{0,80}?(\d+) days?/);
    if (m) { data.explosions.count++; data.explosions.totalDays += parseInt(m[1]); return; }

    // Expose Thieves ("Enemies have exposed our thieves for N days!" or similar)
    m = ev.match(/[Ee]xpos(?:e|ed).{0,80}?(?:thieves?|stealth).{0,80}?(\d+) days?/);
    if (m) { data.exposeThieves.count++; data.exposeThieves.totalDays += parseInt(m[1]); return; }

    // Gluttony ("The gluttony of our people has increased for N days!")
    m = ev.match(/[Gg]luttony.{0,80}?(\d+) days?/);
    if (m) { data.gluttony.count++; data.gluttony.totalDays += parseInt(m[1]); return; }

    // Magic Ward ("A Magic Ward has been placed on our lands for N days!" or similar)
    m = ev.match(/[Mm]agic [Ww]ard.{0,80}?(\d+) days?/);
    if (m) { data.magicWard.count++; data.magicWard.totalDays += parseInt(m[1]); return; }

    // Nightfall (wiki: "8 ticks"; Province News may say days or ticks)
    m = ev.match(/[Nn]ightfall.{0,80}?(\d+) (?:days?|ticks?)/);
    if (m) { data.nightfall.count++; data.nightfall.totalDays += parseInt(m[1]); return; }

    // Sloth ("Slothful behavior has gripped our province for N days!" or similar)
    m = ev.match(/[Ss]loth.{0,80}?(\d+) days?/);
    if (m) { data.sloth.count++; data.sloth.totalDays += parseInt(m[1]); return; }

    // Storms ("Storms will ravage our lands for N days!")
    m = ev.match(/[Ss]torms?.{0,80}?(\d+) days?/);
    if (m) { data.storms.count++; data.storms.totalDays += parseInt(m[1]); return; }

    // Troop desertions — wizards
    m = ev.match(/(\d+) wizards of our wizards abandoned us hoping for a better life!/);
    if (m) {
        const count = parseInt(m[1]);
        data.desertions.total += count;
        data.desertions.byType['wizards'] = (data.desertions.byType['wizards'] || 0) + count;
        return;
    }

    // Troop desertions — specialist troops
    m = ev.match(/(\d+) of our specialist troops abandoned us hoping for a better life!/);
    if (m) {
        const count = parseInt(m[1]);
        data.desertions.total += count;
        data.desertions.byType['specialist troops'] = (data.desertions.byType['specialist troops'] || 0) + count;
        return;
    }

    // Troop desertions — named type (e.g. "10 Beastmasters abandoned us...")
    m = ev.match(/^(\d+) (\w+) abandoned us hoping for a better life!/);
    if (m) {
        const count = parseInt(m[1]);
        const type = m[2];
        data.desertions.total += count;
        data.desertions.byType[type] = (data.desertions.byType[type] || 0) + count;
        return;
    }

    // Turncoat general discovered
    if (ev.indexOf('We have discovered a turncoat general leading our military. He has been executed for treason!') !== -1) {
        data.turncoatGenerals++;
        return;
    }

    // Failed propaganda
    if (ev.indexOf('Enemies attempted to spread propaganda among our soldiers, but failed to convert any of them.') !== -1) {
        data.failedPropaganda++;
        return;
    }

    // War outcome — land penalty
    m = ev.match(/as a result of our failed war .+ We have given up (\d+) acres .+ (\d+) acres has gone to our enemies .+ and (\d+) acres for our Kingdom/);
    if (m) {
        data.warLandPenalty = {
            total: parseInt(m[1]),
            toEnemies: parseInt(m[2]),
            redistributed: parseInt(m[3])
        };
        return;
    }

    // War outcome — resource bonus
    m = ev.match(/as a result of our war .+ We have received ([\d,]+) free building credits .+ We have received ([\d,]+) free specialist credits .+ We have received ([\d,]+) science books/);
    if (m) {
        data.warResourceBonus = {
            buildingCredits: parseInt(m[1].replace(/,/g, '')),
            specialistCredits: parseInt(m[2].replace(/,/g, '')),
            scienceBooks: parseInt(m[3].replace(/,/g, ''))
        };
        return;
    }

    // Daily login bonus (Uto-akkk)
    if (ev.startsWith('Your people appreciate')) {
        if (ev.includes('extreme')) {
            data.loginBonus.extreme++;
        } else if (ev.includes('impressive')) {
            data.loginBonus.impressive++;
        } else {
            data.loginBonus.unknown++;
            logUnrecognizedLine(ev, 'province-news'); // capture 1-hr tier text when seen
        }
        const acresM = ev.match(/([\d,]+)\s+acres/i);
        if (acresM) data.loginBonus.acres += parseInt(acresM[1].replace(/,/g, ''));
        const goldM = ev.match(/([\d,]+)\s+gold coins/i);
        if (goldM) data.loginBonus.gold += parseInt(goldM[1].replace(/,/g, ''));
        const booksM = ev.match(/([\d,]+)\s+(?:science )?books/i);
        if (booksM) data.loginBonus.books += parseInt(booksM[1].replace(/,/g, ''));
        return;
    }

    // Starvation — "Our people are starving! We have lost N peasants, N Magicians, N Beastmasters and N thieves."
    if (ev.startsWith('Our people are starving!')) {
        data.starvation.count++;
        const types = [
            { re: /(\d+) peasants?/,      key: 'peasants' },
            { re: /(\d+) soldiers?/,      key: 'soldiers' },
            { re: /(\d+) Magicians?/,     key: 'Magicians' },
            { re: /(\d+) Beastmasters?/,  key: 'Beastmasters' },
            { re: /(\d+) thieves?/,       key: 'thieves' },
            { re: /(\d+) Elf Lords?/,     key: 'Elf Lords' },
        ];
        for (const { re, key } of types) {
            const tm = ev.match(re);
            if (tm) {
                const n = parseInt(tm[1]);
                data.starvation.total += n;
                data.starvation.byType[key] = (data.starvation.byType[key] || 0) + n;
            }
        }
        return;
    }

    // No pattern matched — log for analysis
    logUnrecognizedLine(ev, 'province-news');
}

/**
 * Formats the Province News accumulated data into the output string.
 * @param {Object} data - Accumulated province news data
 * @returns {string} - Formatted output
 */
function formatProvinceNewsOutput(data) {
    const out = [];

    out.push('Province News Report from UtopiaFormatter.com');
    if (data.firstDate && data.lastDate) {
        const span = dateToNumber(data.lastDate) - dateToNumber(data.firstDate) + 1;
        out.push(`${data.firstDate} - ${data.lastDate} (${span} days)`);
    }

    // Daily Login Bonus — monthly grants + "Your people appreciate" events (Uto-akkk, Uto-l42y)
    const totalLoginAcres = data.monthlyLand.reduce((s, e) => s + e.acres, 0) + data.loginBonus.acres;
    const totalLoginGold  = data.monthlyIncome.reduce((s, e) => s + e.gold, 0) + data.loginBonus.gold;
    const totalLoginBooks = data.monthlyIncome.reduce((s, e) => s + e.books, 0) + data.loginBonus.books;
    const totalLoginBonuses = data.loginBonus.extreme + data.loginBonus.impressive + data.loginBonus.unknown;
    if (data.monthlyLand.length > 0 || data.monthlyIncome.length > 0 || totalLoginBonuses > 0) {
        out.push('');
        out.push('Daily Login Bonus:');
        if (totalLoginBonuses > 0) {
            const parts = [];
            if (data.loginBonus.extreme > 0)    parts.push(`${data.loginBonus.extreme} extreme`);
            if (data.loginBonus.impressive > 0) parts.push(`${data.loginBonus.impressive} impressive`);
            if (data.loginBonus.unknown > 0)    parts.push(`${data.loginBonus.unknown} unknown`);
            out.push(`  ${totalLoginBonuses} total (${parts.join(', ')})`);
        }
        if (totalLoginAcres > 0) out.push(`  ${formatNumber(totalLoginAcres)} acres`);
        if (totalLoginGold  > 0) out.push(`  ${formatNumber(totalLoginGold)} gold coins`);
        if (totalLoginBooks > 0) out.push(`  ${formatNumber(totalLoginBooks)} science books`);
    }

    // Scientists Gained (Uto-l42y)
    if (data.scientists.length > 0) {
        const byField = {};
        for (const s of data.scientists) {
            byField[s.field] = (byField[s.field] || 0) + 1;
        }
        out.push('');
        out.push('Scientists Gained:');
        for (const [field, count] of Object.entries(byField)) {
            out.push(`  ${field}: ${count}`);
        }
    }

    // Aid Received
    const ar = data.aidByResource;
    const hasAid = ar.gold.total > 0 || ar.bushels.total > 0 || ar.runes.total > 0 ||
                   ar.soldiers.total > 0 || ar.exploreAcres.total > 0;
    if (hasAid) {
        out.push('');
        out.push('Aid Received:');
        if (ar.gold.total > 0)         out.push(`  ${formatNumber(ar.gold.total)} gold coins`);
        if (ar.bushels.total > 0)      out.push(`  ${formatNumber(ar.bushels.total)} bushels`);
        if (ar.runes.total > 0)        out.push(`  ${formatNumber(ar.runes.total)} runes`);
        if (ar.soldiers.total > 0)     out.push(`  ${formatNumber(ar.soldiers.total)} soldiers`);
        if (ar.exploreAcres.total > 0) out.push(`  ${formatNumber(ar.exploreAcres.total)} explore pool acres (${formatNumber(ar.exploreAcres.lost)} lost in transit)`);
    }

    // Thievery Impacts — includes stolen resources (Uto-hb3m), source tracking, and op impacts
    const hasThieveryImpacts = data.thieveryDetected > 0 || data.thieveryIntercepted > 0 ||
        data.stolen.gold > 0 || data.stolen.bushels > 0 || data.stolen.runes > 0 || data.stolen.warHorses > 0 ||
        data.rioting.count > 0 || data.manaDis.count > 0 || data.desertions.total > 0 ||
        data.turncoatGenerals > 0 || data.failedPropaganda > 0;
    if (hasThieveryImpacts) {
        out.push('');
        out.push('Thievery Impacts:');
        if (data.thieveryDetected > 0) {
            out.push(`  ${data.thieveryDetected} operations detected (${data.thieveryUnknown} from unknown sources)`);
            const knownSources = Object.entries(data.thieveryBySource).sort((a, b) => b[1] - a[1]);
            for (const [src, cnt] of knownSources) out.push(`    ${src}: ${cnt}`);
        }
        if (data.thieveryIntercepted > 0) {
            out.push(`  ${data.thieveryIntercepted} operations intercepted by Shadowlight`);
            const interceptedSources = Object.entries(data.interceptedBySource).sort((a, b) => b[1] - a[1]);
            for (const [src, cnt] of interceptedSources) out.push(`    ${src}: ${cnt}`);
        }
        if (data.stolen.gold > 0)      out.push(`  ${formatNumber(data.stolen.gold)} gold coins stolen`);
        if (data.stolen.bushels > 0)   out.push(`  ${formatNumber(data.stolen.bushels)} bushels stolen`);
        if (data.stolen.runes > 0)     out.push(`  ${formatNumber(data.stolen.runes)} runes stolen`);
        if (data.stolen.warHorses > 0) out.push(`  ${formatNumber(data.stolen.warHorses)} war horses stolen`);
        if (data.rioting.count > 0)
            out.push(`  Incite Riots: ${pluralize(data.rioting.count, 'occurrence')}, ${data.rioting.totalDays} days`);
        if (data.manaDis.count > 0)
            out.push(`  Sabotage Wizards: ${pluralize(data.manaDis.count, 'occurrence')}, ${data.manaDis.totalDays} days`);
        if (data.desertions.total > 0) {
            const types = Object.keys(data.desertions.byType);
            const breakdown = types.map(t => `${t}: ${data.desertions.byType[t]}`).join(', ');
            out.push(`  Propaganda: ${formatNumber(data.desertions.total)} troops deserted (${breakdown})`);
        }
        if (data.failedPropaganda > 0)  out.push(`  Failed propaganda: ${data.failedPropaganda}`);
        if (data.turncoatGenerals > 0)  out.push(`  Bribe General: ${data.turncoatGenerals}`);
    }

    // Spell Impacts — spell attempts + magical hazards merged (Uto-l42y, Uto-ccjb, Uto-ig81, Uto-v63f)
    const durationSpells = [
        data.pitfalls, data.greed,
        data.blizzard, data.chastity, data.droughts, data.explosions,
        data.exposeThieves, data.gluttony, data.magicWard,
        data.nightfall, data.sloth, data.storms
    ];
    const hasSpellImpacts = data.spellAttempts > 0 || data.meteorDays > 0 ||
        durationSpells.some(s => s.count > 0);
    if (hasSpellImpacts) {
        out.push('');
        out.push('Spell Impacts:');
        if (data.spellAttempts > 0) {
            out.push(`  ${pluralize(data.spellAttempts, 'attempt')}`);
            const sources = Object.entries(data.spellsBySource).sort((a, b) => b[1] - a[1]);
            for (const [src, cnt] of sources) out.push(`    ${src}: ${cnt}`);
        }
        if (data.meteorDays > 0) {
            const totalMeteorCas = data.meteorCasualties.peasants + data.meteorCasualties.soldiers +
                                   data.meteorCasualties.Magicians + data.meteorCasualties.Beastmasters;
            const casParts = [];
            if (data.meteorCasualties.peasants > 0)     casParts.push(`peasants: ${formatNumber(data.meteorCasualties.peasants)}`);
            if (data.meteorCasualties.soldiers > 0)     casParts.push(`soldiers: ${formatNumber(data.meteorCasualties.soldiers)}`);
            if (data.meteorCasualties.Magicians > 0)    casParts.push(`Magicians: ${formatNumber(data.meteorCasualties.Magicians)}`);
            if (data.meteorCasualties.Beastmasters > 0) casParts.push(`Beastmasters: ${formatNumber(data.meteorCasualties.Beastmasters)}`);
            out.push(`  Meteor shower: ${data.meteorDays} days, ${formatNumber(totalMeteorCas)} total casualties (${casParts.join(', ')})`);
        }
        if (data.pitfalls.count > 0)      out.push(`  Pitfalls: ${pluralize(data.pitfalls.count, 'occurrence')}, ${data.pitfalls.totalDays} days`);
        if (data.greed.count > 0)         out.push(`  Greed: ${pluralize(data.greed.count, 'occurrence')}, ${data.greed.totalDays} days`);
        if (data.blizzard.count > 0)      out.push(`  Blizzard: ${pluralize(data.blizzard.count, 'occurrence')}, ${data.blizzard.totalDays} days`);
        if (data.chastity.count > 0)      out.push(`  Chastity: ${pluralize(data.chastity.count, 'occurrence')}, ${data.chastity.totalDays} days`);
        if (data.droughts.count > 0)      out.push(`  Droughts: ${pluralize(data.droughts.count, 'occurrence')}, ${data.droughts.totalDays} days`);
        if (data.explosions.count > 0)    out.push(`  Explosions: ${pluralize(data.explosions.count, 'occurrence')}, ${data.explosions.totalDays} days`);
        if (data.exposeThieves.count > 0) out.push(`  Expose Thieves: ${pluralize(data.exposeThieves.count, 'occurrence')}, ${data.exposeThieves.totalDays} days`);
        if (data.gluttony.count > 0)      out.push(`  Gluttony: ${pluralize(data.gluttony.count, 'occurrence')}, ${data.gluttony.totalDays} days`);
        if (data.magicWard.count > 0)     out.push(`  Magic Ward: ${pluralize(data.magicWard.count, 'occurrence')}, ${data.magicWard.totalDays} days`);
        if (data.nightfall.count > 0)     out.push(`  Nightfall: ${pluralize(data.nightfall.count, 'occurrence')}, ${data.nightfall.totalDays} days`);
        if (data.sloth.count > 0)         out.push(`  Sloth: ${pluralize(data.sloth.count, 'occurrence')}, ${data.sloth.totalDays} days`);
        if (data.storms.count > 0)        out.push(`  Storms: ${pluralize(data.storms.count, 'occurrence')}, ${data.storms.totalDays} days`);
    }

    // Shadowlight Thief IDs (Uto-hb3m: renamed from Shadowlight Attacker IDs)
    if (data.shadowlightAttackers.length > 0) {
        out.push('');
        out.push('Shadowlight Thief IDs:');
        for (const a of data.shadowlightAttackers) out.push(`  ${a}`);
    }

    // Attacks Suffered
    if (data.attacks.length > 0) {
        const totalAcres = data.attacks.reduce((s, a) => s + a.acresCaptured, 0);
        const totalBooks = data.attacks.reduce((s, a) => s + a.booksLooted, 0);
        const headerParts = [];
        if (totalAcres > 0) headerParts.push(`${formatNumber(totalAcres)} acres lost`);
        if (totalBooks > 0) headerParts.push(`${formatNumber(totalBooks)} books looted`);
        out.push('');
        out.push(`Attacks Suffered: ${data.attacks.length} (${headerParts.join(', ')})`);
        for (const atk of data.attacks) {
            if (atk.acresCaptured > 0) {
                out.push(`  ${atk.attacker} (${atk.kingdom}): ${atk.acresCaptured} acres`);
            } else if (atk.booksLooted > 0) {
                out.push(`  ${atk.attacker} (${atk.kingdom}): ${formatNumber(atk.booksLooted)} books (learn)`);
            }
        }
    }

    // Starvation
    if (data.starvation.count > 0) {
        out.push('');
        out.push(`Starvation: ${pluralize(data.starvation.count, 'event')}, ${formatNumber(data.starvation.total)} total losses`);
        for (const [type, n] of Object.entries(data.starvation.byType)) {
            out.push(`  ${formatNumber(n)} ${type}`);
        }
    }

    // War Outcomes
    if (data.warLandPenalty || data.warResourceBonus) {
        out.push('');
        out.push('War Outcomes:');
        if (data.warLandPenalty) {
            const p = data.warLandPenalty;
            out.push(`  Land given up: ${p.total} acres (${p.toEnemies} to enemies, ${p.redistributed} redistributed)`);
        }
        if (data.warResourceBonus) {
            const b = data.warResourceBonus;
            out.push(`  Resources received: ${formatNumber(b.buildingCredits)} building credits, ${formatNumber(b.specialistCredits)} specialist credits, ${formatNumber(b.scienceBooks)} science books`);
        }
    }

    return out.join('\n');
}

/**
 * Parses Province News text into a formatted summary.
 * Province News uses "Month Day of YR##[tab]Event" format.
 * @param {string} text - Raw Province News input
 * @param {Object} options - (reserved for future use)
 * @returns {string} - Formatted output
 */
function parseProvinceNews(text, options = {}) {
    // Apply HTML cleaning but NOT normalizeWhitespace (would destroy tab delimiters)
    let cleaned = removeHtmlTags(text);
    cleaned = removeHtmlEntities(cleaned);
    cleaned = normalizeLineBreaks(cleaned);
    cleaned = removeProblematicCharacters(cleaned);

    const data = {
        firstDate: null,
        lastDate: null,
        monthlyLand: [],
        monthlyIncome: [],
        loginBonus:           { extreme: 0, impressive: 0, unknown: 0, acres: 0, gold: 0, books: 0 },
        scientists: [],
        aidByResource: {
            runes:        { total: 0, shipments: 0, senders: {} },
            gold:         { total: 0, shipments: 0, senders: {} },
            bushels:      { total: 0, shipments: 0, senders: {} },
            soldiers:     { total: 0, shipments: 0, senders: {} },
            exploreAcres: { total: 0, lost: 0, shipments: 0, senders: {} }
        },
        stolen:               { runes: 0, gold: 0, bushels: 0, warHorses: 0 },
        thieveryDetected:     0,
        thieveryUnknown:      0,
        thieveryIntercepted:  0,
        thieveryBySource:     {},
        interceptedBySource:  {},
        spellAttempts:        0,
        spellsBySource:       {},
        shadowlightAttackers: [],
        attacks:              [],
        meteorDays:           0,
        meteorCasualties:     { peasants: 0, soldiers: 0, Magicians: 0, Beastmasters: 0 },
        rioting:              { count: 0, totalDays: 0 },
        pitfalls:             { count: 0, totalDays: 0 },
        manaDis:              { count: 0, totalDays: 0 },
        greed:                { count: 0, totalDays: 0 },
        // Non-instant offensive spells — patterns are approximate (Province News exact
        // message text not yet seen in the wild; update regexes when confirmed).
        blizzard:             { count: 0, totalDays: 0 },
        chastity:             { count: 0, totalDays: 0 },
        droughts:             { count: 0, totalDays: 0 },
        explosions:           { count: 0, totalDays: 0 },
        exposeThieves:        { count: 0, totalDays: 0 },
        gluttony:             { count: 0, totalDays: 0 },
        magicWard:            { count: 0, totalDays: 0 },
        nightfall:            { count: 0, totalDays: 0 },
        sloth:                { count: 0, totalDays: 0 },
        storms:               { count: 0, totalDays: 0 },
        desertions:           { total: 0, byType: {} },
        turncoatGenerals:     0,
        failedPropaganda:     0,
        warLandPenalty:       null,
        warResourceBonus:     null,
        starvation:           { count: 0, total: 0, byType: {} }
    };

    const dateLineRe = /^(\w+ \d+ of YR\d+)\t(.+)$/;

    for (const line of cleaned.split('\n')) {
        const match = line.match(dateLineRe);
        if (!match) continue;

        const dateStr = match[1];
        const ev = match[2].trim();

        if (!data.firstDate) data.firstDate = dateStr;
        data.lastDate = dateStr;

        parseProvinceNewsLine(ev, dateStr, data);
    }

    return formatProvinceNewsOutput(data);
}

// =============================================================================
// INPUT TYPE DETECTION
// =============================================================================

/**
 * Detects whether pasted text is Kingdom News, Province Logs, or Province News.
 * @param {string} text - Raw input text
 * @returns {'kingdom-news-log'|'province-logs'|'province-news'|null} - Detected type, or null if unknown
 */
function detectInputType(text) {
    const kingdomNewsPatterns = [
        /captured [\d,]+ acres of land/i,
        /and captured [\d,]+ acres of land/i,
        /recaptured [\d,]+ acres of land/i,
        /ambushed armies from/i,
        /and razed [\d,]+ acres/i,
        /razed [\d,]+ acres of/i,
        /invaded and looted/i,
        /attacked and looted/i,
        /killed [\d,]+ people/i,
        /invaded and pillaged/i,
        /attacked and pillaged/i,
        /attempted an invasion of/i,
        /but was repelled/i,
    ];

    const provinceLogsPatterns = [
        /early indications show that our operation/i,
        /your wizards gather/i,
        /you have ordered/i,
        /you have given orders to commence work/i,
        /begin casting/i,
        /we have sent/i,
        /our thieves have returned with/i,
        /our thieves were able to steal/i,
    ];

    const isKingdom = kingdomNewsPatterns.some(p => p.test(text));
    const isProvince = provinceLogsPatterns.some(p => p.test(text));

    if (isProvince && !isKingdom) return 'province-logs';
    if (isKingdom) return 'kingdom-news-log'; // kingdom takes priority if both match

    // Province News: "Month Day of YR##<tab>" format — checked last because province logs
    // also use this date format; only reached when no operation/spell markers were found.
    if (/\bof YR\d+\t/.test(text)) return 'province-news';
    return null;
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

module.exports = {
    // Main parsing functions
    parseKingdomNewsLog,
    parseProvinceNews,
    parseText,
    formatProvinceLogs,
    
    // Text cleaning utilities
    removeHtmlTags,
    removeHtmlEntities,
    normalizeWhitespace,
    removeProblematicCharacters,
    normalizeLineBreaks,
    
    // Helper utilities
    escapeRegExp,
    formatNumber,
    dateToNumber,
    calculateUniques,

    // Detection
    detectInputType,
    detectOwnKingdom,
    hasWarEvents,
    detectWarPeriods,

    // Logging
    logUnrecognizedLine,

    // Constants (for testing)
    ERROR_MESSAGES,
    PROVINCE_LOGS_CONFIG,
    UNIQUE_WINDOW_DAYS
};
