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
        { name: "Mystic Vortex", text: "A magic vortex overcomes", impact: "active spells" },
        { name: "Nightmares", text: "Some were forced into rehabilitation", impact: "of the men" },
        { name: "Nightfall", text: "Nightfall", impact: "days" },
        { name: "Pitfalls", text: "Pitfalls will haunt the lands", impact: "days" },
        { name: "Storms", text: "Storms will ravage", impact: "days" },
        { name: "Tornadoes", text: "Tornadoes scour the lands", impact: "acres of buildings" },
        { name: "Vermin", text: "Vermin", impact: "bushels" }
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
 * Calculates unique attack counts using a sliding day-window per attacker province.
 * A "unique" is defined as a 6-day window: all attacks by a province within 6 in-game
 * days of their first attack count as 1 unique; on the 7th day a new window opens.
 * @param {Array<{dateVal: number, attackerKey: string}>} log - Dated attack log
 * @param {number} windowDays - Window size in in-game days
 * @returns {{total: number, perAttacker: Object<string, number>}}
 */
function calculateUniques(log, windowDays) {
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
    
    // Resources stolen counters
    let goldCoinsStolen = 0;
    let bushelsStolen = 0;
    let runesStolen = 0;
    let warHorsesStolen = 0;

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
    PROVINCE_LOGS_CONFIG.AID_RESOURCES.forEach(r => { 
        aidTotals[r] = 0; 
    });

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
                        let foundMatch = false;
                        for (const troop of PROVINCE_LOGS_CONFIG.PROPAGANDA_TROOPS) {
                            const match = line.match(new RegExp(`([\\d,]+)\\s+of the enemy's\\s+${escapeRegExp(troop)}`, "i"));
                            if (match) {
                                propagandaCounts[troop] += parseInt(match[1].replace(/,/g, ""));
                                foundMatch = true;
                            }
                        }
                        if (!foundMatch) {
                            const match = line.match(/([\d,]+)\s+\w+/);
                            if (match) {
                                propagandaCounts["elites"] = (propagandaCounts["elites"] || 0) + parseInt(match[1].replace(/,/g, ""));
                            }
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
        
        // Parse stolen resources
        if (line.includes("Our thieves have returned with") || line.includes("Our thieves were able to steal")) {
            if (line.includes("gold coins")) {
                const match = line.match(/([\d,]+)\s+gold coins/i);
                if (match) goldCoinsStolen += parseInt(match[1].replace(/,/g, ""));
            } else if (line.includes("bushels")) {
                const match = line.match(/([\d,]+)\s+bushels/i);
                if (match) bushelsStolen += parseInt(match[1].replace(/,/g, ""));
            } else if (line.includes("runes")) {
                const match = line.match(/([\d,]+)\s+runes/i);
                if (match) runesStolen += parseInt(match[1].replace(/,/g, ""));
            } else if (line.includes("war horses")) {
                const match = line.match(/([\d,]+)\s+war horses/i);
                if (match) warHorsesStolen += parseInt(match[1].replace(/,/g, ""));
            }
        }
    }

    // Build output
    let output = "\nSummary of Province Log Events\n" + "-".repeat(40) + "\n";

    // Thievery Summary
    output += "\nThievery Summary:\n";
    const opTotals = [];
    for (const op of PROVINCE_LOGS_CONFIG.OPERATIONS) {
        let count = thieveryCounts[op.name];
        if (op.unique_impact) {
            if (op.name === "Propaganda") {
                count = Object.values(propagandaCounts).reduce((a, b) => a + b, 0);
            }
        }
        if (count > 0) {
            opTotals.push([count, op.name, op]);
        }
    }
    opTotals.sort((a, b) => b[0] - a[0]);

    for (const [count, name, op] of opTotals) {
        const impact = op.impact;
        const totalImpact = thieveryImpacts[name];
        
        if (op.unique_impact && name === "Propaganda") {
            output += "Propaganda:\n";
            Object.entries(propagandaCounts)
                .filter(([, c]) => c > 0)
                .sort((a, b) => b[1] - a[1])
                .forEach(([pName, pCount]) => {
                    output += ` ${pCount} ${pName}\n`;
                });
        } else if (op.unique_impact && (name === "Bribe Generals" || name === "Bribe Thieves")) {
            output += `${count} ${name} ops\n`;
        } else if (impact) {
            let impactStr = impact;
            if (impactStr === "day" && totalImpact > 1) {
                impactStr = "days";
            }
            if (impactStr === "of them") {
                impactStr = "peasants";
            }
            output += `${count} ${name} for a total of ${formatNumber(totalImpact)} ${impactStr}\n`;
        } else {
            output += `${count} ${name}\n`;
        }
    }

    // Resources Stolen Summary
    output += "\nResources Stolen:\n";
    if (goldCoinsStolen > 0) output += `${formatNumber(goldCoinsStolen)} gold coins stolen\n`;
    if (bushelsStolen > 0) output += `${formatNumber(bushelsStolen)} bushels stolen\n`;
    if (runesStolen > 0) output += `${formatNumber(runesStolen)} runes stolen\n`;
    if (warHorsesStolen > 0) output += `${formatNumber(warHorsesStolen)} war horses stolen\n`;

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
        if (impact) {
            output += `${count} ${spell.name} for a total of ${formatNumber(totalImpact)} ${impact}\n`;
        } else {
            output += `${count} ${spell.name}\n`;
        }
    }

    // Aid Summary
    output += "\nAid Summary:\n";
    Object.entries(aidTotals)
        .filter(([, total]) => total > 0)
        .sort((a, b) => b[1] - a[1])
        .forEach(([resource, total]) => {
            output += `${formatNumber(total)} ${resource}\n`;
        });

    // Dragon Summary
    output += "\nDragon Summary:\n";
    if (dragonGoldDonated > 0) output += `${formatNumber(dragonGoldDonated)} gold coins donated\n`;
    if (dragonBushelsDonated > 0) output += `${formatNumber(dragonBushelsDonated)} bushels donated\n`;
    if (dragonTroopsTotal > 0 || dragonPointsTotal > 0) {
        output += `${formatNumber(dragonTroopsTotal)} troops sent and weakened by ${formatNumber(dragonPointsTotal)} points\n`;
    }

    // Ritual Summary (omitted when no ritual casts detected)
    if (ritualCasts > 0) {
        output += "\nRitual Summary:\n";
        output += `${ritualCasts} successful ritual casts\n`;
    }

    return output.trim();
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

    // Parse data structure
    const data = {
        startDate: null,
        endDate: null,
        kingdoms: {},
        ownKingdomId: detectedOwnKingdom,
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
    
    for (const line of relevantLines) {
        const dateMatch = line.match(dateRegex);
        if (dateMatch) {
            if (!data.startDate) {
                data.startDate = dateMatch[0];
            }
            // Continue processing this line as an attack line too
        }
        
        // Parse attack lines (skip lines that are only dates)
        if (line.trim().length > dateMatch[0].length) {
            const attackLine = line.replace(/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2} of YR\d+\s*/, '');
            
            // Check if this is actually an attack line
            const isAttack = /captured \d+ acres of land|ambushed armies.*and took \d+ acres of land|recaptured \d+ acres of land|killed \d+ people|razed \d+ acres|attacked and pillaged|invaded and pillaged|invaded and looted|attacked and looted|attempted to invade|attempted an invasion/.test(attackLine);
            
            if (isAttack) {
                if (dateMatch) {
                    lastAttackDate = dateMatch[0];
                }
                parseAttackLine(line, data, lastAttackDate);
            }
            
            // Always parse special lines (dragons, rituals, etc.)
            parseSpecialLine(line, data);
            
            // Stop at clear end points
            if (line.includes('withdrawn from war') || line.includes('post-war period')) {
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
            ritualsStarted: 0,
            ritualsCompleted: 0
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
            ritualsStarted: 0,
            ritualsCompleted: 0
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
        return;
    }

    // "[Province] has completed our dragon, [Name], and it sets flight to ravage Unnamed kingdom (X:Y)!"
    // The (X:Y) in this line is the TARGET, not the source kingdom — always own kingdom's dragon.
    // Dragon type is not present in this line; push null so the count is tracked.
    if (line.includes('has completed our dragon')) {
        if (own && data.kingdoms[own]) {
            data.kingdoms[own].dragonsCompleted.push(null);
        }
        return;
    }

    // "[Province] has slain the dragon, [Name], ravaging our lands!" — own province killed enemy dragon
    // Dragon type is not present in this line; push null so the count is tracked.
    if (line.includes('has slain the dragon') && line.includes('ravaging our lands')) {
        if (own && data.kingdoms[own]) {
            data.kingdoms[own].dragonsKilled.push(null);
        }
        return;
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
                    ritualsStarted: 0, ritualsCompleted: 0
                };
            }
            const tm = line.match(/has begun the (\w+) Dragon project/);
            data.kingdoms[kId].dragonsStarted.push(tm ? tm[1] : null);
        }
        return;
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
                    ritualsStarted: 0, ritualsCompleted: 0
                };
            }
            const tm = line.match(/\bA (\w+) Dragon,/);
            data.kingdoms[kId].dragonsCompleted.push(tm ? tm[1] : null);
        }
        return;
    }

    // ── Ritual patterns ───────────────────────────────────────────────────
    // "We have started developing a ritual! (Barrier)!"
    if (line.includes('started developing a ritual')) {
        if (own && data.kingdoms[own]) {
            data.kingdoms[own].ritualsStarted++;
        }
        return;
    }

    // "Sadly, we have failed summoning the ritual to cover our lands!"
    // The ritual development completed (ritualsCompleted++) but the summoning failed,
    // so a new development cycle must begin (ritualsStarted++).
    if (line.includes('failed summoning the ritual')) {
        if (own && data.kingdoms[own]) {
            data.kingdoms[own].ritualsCompleted++;
            data.kingdoms[own].ritualsStarted++;
        }
        return;
    }

    // "Our ritual [name] has been completed!" — successful ritual cast
    if (line.includes('Our ritual') && line.includes('completed')) {
        if (own && data.kingdoms[own]) {
            data.kingdoms[own].ritualsCompleted++;
        }
        return;
    }
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

    // Header
    output.push('Kingdom News Report');

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
        if (ownKingdom.ritualsStarted > 0)    output.push(`-- Rituals Started: ${ownKingdom.ritualsStarted}`);
        if (ownKingdom.ritualsCompleted > 0)  output.push(`-- Rituals Completed: ${ownKingdom.ritualsCompleted}`);

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

    return output.join('\n');
}

// =============================================================================
// INPUT TYPE DETECTION
// =============================================================================

/**
 * Detects whether pasted text is Kingdom News or Province Logs.
 * @param {string} text - Raw input text
 * @returns {'kingdom-news-log'|'province-logs'|null} - Detected type, or null if unknown
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

    if (isKingdom && !isProvince) return 'kingdom-news-log';
    if (isProvince && !isKingdom) return 'province-logs';
    if (isKingdom) return 'kingdom-news-log'; // kingdom takes priority if both match
    return null;
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

module.exports = {
    // Main parsing functions
    parseKingdomNewsLog,
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

    // Constants (for testing)
    ERROR_MESSAGES,
    PROVINCE_LOGS_CONFIG,
    UNIQUE_WINDOW_DAYS
};
