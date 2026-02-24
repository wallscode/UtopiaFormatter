/**
 * NewsParser - Text parsing utilities for Utopia Kingdom Forum
 * @version 2.0.0
 * @author NewsParser Team
 */

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

// Parsing patterns and identifiers
const PARSE_PATTERNS = {
    KINGDOM_NEWS_HEADER: 'Kingdom News Report',
    HIGHLIGHTS_HEADER: 'Highlights',
    OWN_KINGDOM_PREFIX: 'Own Kingdom',
    ENEMY_KINGDOM_PREFIX: 'The Kingdom of',
    UNIQUES_PREFIX: 'Uniques for',
    TOTAL_ATTACKS_MADE: 'Total Attacks Made:',
    TOTAL_ATTACKS_SUFFERED: 'Total Attacks Suffered:',
    TOTAL_ACRES: 'Total Acres:'
};

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

// Error messages
const ERROR_MESSAGES = {
    NO_KINGDOM_NEWS_HEADER: 'Could not find "Kingdom News Report" header in the input text',
    NO_KINGDOM_IDENTIFIERS: 'Could not find kingdom identifiers in the input text',
    EMPTY_INPUT: 'Input text cannot be empty'
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
// KINGDOM NEWS REPORT PARSING
// =============================================================================

/**
 * Extracts kingdom identifier from a kingdom line
 * @param {string} kingdomLine - Line containing kingdom information
 * @returns {string} - Kingdom identifier (e.g., "5:1")
 */
function extractKingdomId(kingdomLine) {
    return kingdomLine.split(' ').slice(-1)[0];
}

/**
 * Finds section indices in the relevant lines array
 * @param {string[]} relevantLines - Array of relevant lines from the report
 * @param {string} ownKingdomId - Own kingdom identifier
 * @param {string} enemyKingdomId - Enemy kingdom identifier
 * @returns {Object} - Object containing section indices
 */
function findSectionIndices(relevantLines, ownKingdomId, enemyKingdomId) {
    return {
        attacksMade: relevantLines.findIndex(line => line.startsWith(PARSE_PATTERNS.TOTAL_ATTACKS_MADE)),
        attacksSuffered: relevantLines.findIndex(line => line.startsWith(PARSE_PATTERNS.TOTAL_ATTACKS_SUFFERED)),
        ownKingdom: relevantLines.findIndex(line => line.startsWith(PARSE_PATTERNS.OWN_KINGDOM_PREFIX)),
        enemyKingdom: relevantLines.findIndex(line => line.startsWith(PARSE_PATTERNS.ENEMY_KINGDOM_PREFIX)),
        uniquesOwn: relevantLines.findIndex(line => line.startsWith(`${PARSE_PATTERNS.UNIQUES_PREFIX} ${ownKingdomId}`)),
        uniquesEnemy: relevantLines.findIndex(line => line.startsWith(`${PARSE_PATTERNS.UNIQUES_PREFIX} ${enemyKingdomId}`))
    };
}

/**
 * Extracts province list from lines between specified indices
 * @param {string[]} relevantLines - Array of relevant lines
 * @param {number} startIndex - Start index for extraction
 * @param {number} endIndex - End index for extraction
 * @returns {string[]} - Array of province lines
 */
function extractProvinceList(relevantLines, startIndex, endIndex) {
    const provinces = [];
    let foundTotalAcres = false;
    
    for (let i = startIndex; i <= endIndex; i++) {
        const line = relevantLines[i];
        if (line.startsWith(PARSE_PATTERNS.TOTAL_ACRES)) {
            foundTotalAcres = true;
            continue;
        }
        if (foundTotalAcres && line && line.match(/^-?\d+ \|/)) {
            provinces.push(line);
        }
    }
    
    return provinces;
}

/**
 * Extracts uniques list from lines between specified indices
 * @param {string[]} relevantLines - Array of relevant lines
 * @param {number} startIndex - Start index for extraction
 * @param {number} endIndex - End index for extraction
 * @returns {string[]} - Array of unique lines
 */
function extractUniquesList(relevantLines, startIndex, endIndex) {
    const uniques = [];
    
    for (let i = startIndex; i < endIndex; i++) {
        const line = relevantLines[i];
        if (line && line.match(/^\d+ -/)) {
            uniques.push(line);
        }
    }
    
    return uniques;
}

/**
 * Extracts highlights section from relevant lines
 * @param {string[]} relevantLines - Array of relevant lines
 * @returns {string[]} - Array of highlights lines (filtered)
 */
function extractHighlightsSection(relevantLines) {
    const highlightsIndex = relevantLines.findIndex(line => line === PARSE_PATTERNS.HIGHLIGHTS_HEADER);
    
    if (highlightsIndex === -1) {
        return [];
    }
    
    const highlights = relevantLines.slice(highlightsIndex);
    // Filter out unwanted lines like 'Enemy'
    return highlights.filter(line => line !== 'Enemy' && line.trim() !== '');
}

/**
 * Parses and reorganizes Kingdom News Report format
 * @param {string} inputText - Raw Kingdom News Report text
 * @returns {string} - Reorganized Kingdom News Report
 * @throws {ParseError} - When parsing fails due to missing required elements
 */
function parseKingdomNewsReport(inputText) {
    if (!inputText || inputText.trim() === '') {
        throw new ParseError(ERROR_MESSAGES.EMPTY_INPUT, 'EMPTY_INPUT');
    }

    // Clean the input text
    let cleanedText = removeHtmlTags(inputText);
    cleanedText = removeHtmlEntities(cleanedText);
    cleanedText = normalizeWhitespace(cleanedText);
    cleanedText = removeProblematicCharacters(cleanedText);
    cleanedText = normalizeLineBreaks(cleanedText);
    const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line);
    
    // Find the starting point
    const headerIndex = lines.findIndex(line => line === PARSE_PATTERNS.KINGDOM_NEWS_HEADER);
    if (headerIndex === -1) {
        throw new ParseError(ERROR_MESSAGES.NO_KINGDOM_NEWS_HEADER, 'NO_HEADER');
    }
    
    const relevantLines = lines.slice(headerIndex);
    
    // Extract basic information
    const header = relevantLines[0];
    const dateRange = relevantLines[1];
    
    // Find kingdom identifiers
    const ownKingdomMatch = relevantLines.find(line => line.startsWith(PARSE_PATTERNS.OWN_KINGDOM_PREFIX));
    const enemyKingdomMatch = relevantLines.find(line => line.startsWith(PARSE_PATTERNS.ENEMY_KINGDOM_PREFIX));
    
    if (!ownKingdomMatch || !enemyKingdomMatch) {
        throw new ParseError(ERROR_MESSAGES.NO_KINGDOM_IDENTIFIERS, 'NO_KINGDOMS');
    }
    
    const ownKingdomId = extractKingdomId(ownKingdomMatch);
    const enemyKingdomId = extractKingdomId(enemyKingdomMatch);
    
    // Find section indices
    const indices = findSectionIndices(relevantLines, ownKingdomId, enemyKingdomId);
    
    // Extract sections
    const ownKingdomAttacks = relevantLines.slice(indices.attacksMade, indices.attacksSuffered);
    const enemyKingdomAttacks = relevantLines.slice(indices.attacksSuffered, indices.ownKingdom);
    
    // Convert enemy attacks to show as "Made" instead of "Suffered"
    const enemyKingdomAttacksFixed = enemyKingdomAttacks.map(line => 
        line.replace('Total Attacks Suffered:', 'Total Attacks Made:')
    );
    
    // Extract province lists
    const ownKingdomProvinces = extractProvinceList(relevantLines, indices.ownKingdom + 1, indices.enemyKingdom);
    const enemyKingdomProvinces = extractProvinceList(relevantLines, indices.enemyKingdom + 1, indices.uniquesOwn);
    
    // Extract uniques
    const ownKingdomUniques = extractUniquesList(relevantLines, indices.uniquesOwn + 1, indices.uniquesEnemy);
    const enemyKingdomUniques = extractUniquesList(relevantLines, indices.uniquesEnemy + 1, relevantLines.length);
    
    // Extract highlights
    const highlights = extractHighlightsSection(relevantLines);
    
    // Extract Total Acres values dynamically
    const ownTotalAcres = relevantLines[indices.ownKingdom + 1];
    const enemyTotalAcres = relevantLines[indices.enemyKingdom + 1];
    
    // Build reorganized report
    const result = [
        header,
        dateRange,
        '',
        ownKingdomMatch,
        ...ownKingdomAttacks,
        '',
        enemyKingdomMatch,
        ...enemyKingdomAttacksFixed,
        '',
        ownKingdomMatch,
        ownTotalAcres,
        ...ownKingdomProvinces,
        '',
        `${PARSE_PATTERNS.UNIQUES_PREFIX} ${ownKingdomId}`,
        ...ownKingdomUniques,
        '',
        enemyKingdomMatch,
        enemyTotalAcres,
        ...enemyKingdomProvinces,
        '',
        `${PARSE_PATTERNS.UNIQUES_PREFIX} ${enemyKingdomId}`,
        ...enemyKingdomUniques
    ];
    
    // Add highlights section if it exists
    if (highlights.length > 0) {
        result.push('', ...highlights);
    }
    
    return result.join('\n');
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

    // Ritual Summary
    output += "\nRitual Summary:\n";
    output += `${ritualCasts} successful ritual casts\n`;

    return output.trim();
}

/**
 * Parses full Kingdom News logs and summarizes attack data
 * @param {string} inputText - Raw Kingdom News log text
 * @returns {string} - Formatted Kingdom News summary
 */
function parseKingdomNewsLog(inputText) {
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
    
    // Parse data structure
    const data = {
        startDate: null,
        endDate: null,
        kingdoms: {},
        ownKingdomId: null,
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
            const isAttack = /captured \d+ acres of land|ambushed armies.*and took \d+ acres of land|recaptured \d+ acres of land|killed \d+ people|razed \d+ acres|attacked and pillaged|learn|attempted to invade|attempted an invasion/.test(attackLine);
            
            if (isAttack) {
                if (dateMatch) {
                    lastAttackDate = dateMatch[0];
                }
                parseAttackLine(line, data);
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
    return formatKingdomNewsOutput(data);
}

/**
 * Parses individual attack lines and updates data structure
 */
function parseAttackLine(line, data) {
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
    const plunderPattern = /attacked and pillaged the lands/;
    const learnPattern = /learn/; // Basic pattern for learn attacks
    
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
            attackerKingdom = unknownMatch[1] + ' (' + unknownMatch[2] + ':' + unknownMatch[3] + ')';
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
            uniquesMade: {},
            uniquesSuffered: {},
            tradMarch: { count: 0, acres: 0 },
            ambush: { count: 0, acres: 0 },
            conquest: { count: 0, acres: 0 },
            raze: { count: 0, acres: 0 },
            learn: { count: 0, acres: 0 },
            massacre: { count: 0, people: 0 },
            plunder: { count: 0, acres: 0 },
            bouncesMade: 0,
            bouncesSuffered: 0,
            dragonsStarted: 0,
            dragonsCompleted: 0,
            dragonsKilled: 0,
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
            uniquesMade: {},
            uniquesSuffered: {},
            tradMarch: { count: 0, acres: 0 },
            ambush: { count: 0, acres: 0 },
            conquest: { count: 0, acres: 0 },
            raze: { count: 0, acres: 0 },
            learn: { count: 0, acres: 0 },
            massacre: { count: 0, people: 0 },
            plunder: { count: 0, acres: 0 },
            bouncesMade: 0,
            bouncesSuffered: 0,
            dragonsStarted: 0,
            dragonsCompleted: 0,
            dragonsKilled: 0,
            ritualsStarted: 0,
            ritualsCompleted: 0
        };
    }
    
    // Initialize province data
    const attackerKey = attackerProvince.number + ' - ' + attackerProvince.name;
    const defenderKey = defenderProvince.number + ' - ' + defenderProvince.name;
    
    if (!data.kingdoms[attackerKingdom].provinces[attackerKey]) {
        data.kingdoms[attackerKingdom].provinces[attackerKey] = {
            attacksMade: 0,
            attacksSuffered: 0,
            acresGained: 0,
            acresLost: 0,
            lastAttackDate: null
        };
    }
    
    if (!data.kingdoms[defenderKingdom].provinces[defenderKey]) {
        data.kingdoms[defenderKingdom].provinces[defenderKey] = {
            attacksMade: 0,
            attacksSuffered: 0,
            acresGained: 0,
            acresLost: 0,
            lastAttackDate: null
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
        isActualAttack = true;
    } else if (line.includes('attempted to invade') || line.includes('attempted an invasion')) {
        attackType = 'bounce';
        isActualAttack = false; // Don't count bounces as successful attacks for land totals
    }
    
    // Process all attacks for attack statistics (both successful and unsuccessful)
    if (attackType) {
        // Update attacker stats for attack totals
        if (attackerKingdom === data.ownKingdomId) {
            // This is an attack made BY our kingdom
            data.kingdoms[attackerKingdom].attacksMade++;
            data.kingdoms[attackerKingdom].provinces[attackerKey].attacksMade++;
        }
        
        // Update defender stats for attack totals
        if (defenderKingdom === data.ownKingdomId) {
            // This is an attack suffered INTO our kingdom
            data.kingdoms[defenderKingdom].attacksSuffered++;
            data.kingdoms[defenderKingdom].provinces[defenderKey].attacksSuffered++;
        }
        
        // Only process successful attacks for land and acres statistics
        if (isActualAttack) {
            // Only update acres if actual land was captured (not for raze)
            if (acres > 0) {
                data.kingdoms[attackerKingdom].acresGained += acres;
                data.kingdoms[attackerKingdom].provinces[attackerKey].acresGained += acres;
            }
            
            // Only update defender acres if actual land was captured (not for raze)
            if (defenderKingdom === data.ownKingdomId && acres > 0) {
                data.kingdoms[defenderKingdom].acresLost += acres;
                data.kingdoms[defenderKingdom].provinces[defenderKey].acresLost += acres;
            }
        }
        
        // Update attack type specific stats for both kingdoms
        if (attackType === 'bounce') {
            if (attackerKingdom === data.ownKingdomId) {
                data.kingdoms[attackerKingdom].bouncesMade++;
            }
            if (defenderKingdom === data.ownKingdomId) {
                data.kingdoms[defenderKingdom].bouncesSuffered++;
            }
        } else {
            // Update attacker kingdom stats
            if (attackerKingdom === data.ownKingdomId) {
                data.kingdoms[attackerKingdom][attackType].count++;
                // For raze attacks, use raze acres for the raze summary, not acres (which is 0)
                if (attackType === 'raze') {
                    const razeAcres = parseInt(line.match(/razed (\d+) acres/)[1]);
                    data.kingdoms[attackerKingdom][attackType].acres += razeAcres;
                } else if (acres > 0) {
                    data.kingdoms[attackerKingdom][attackType].acres += acres;
                }
            }
            
            // Update defender kingdom stats
            if (defenderKingdom === data.ownKingdomId) {
                data.kingdoms[defenderKingdom][attackType + 'Suffered'] = (data.kingdoms[defenderKingdom][attackType + 'Suffered'] || 0) + 1;
                // For raze attacks, also track the suffered count separately
                if (attackType === 'raze') {
                    data.kingdoms[defenderKingdom].razeSufferedCount = (data.kingdoms[defenderKingdom].razeSufferedCount || 0) + 1;
                }
            }
        }
        
        // Update highlights
        updateHighlights(data, attackType, attackerProvince, defenderProvince, acres, people);
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
    // Dragon patterns
    if (line.includes('has begun the') && line.includes('Dragon project')) {
        const kingdomMatch = line.match(/\((\d+):(\d+)\)/);
        if (kingdomMatch) {
            const kingdomId = kingdomMatch[1] + ':' + kingdomMatch[2];
            if (!data.kingdoms[kingdomId]) {
                data.kingdoms[kingdomId] = {
                    attacksMade: 0, attacksSuffered: 0, acresGained: 0, acresLost: 0,
                    provinces: {}, tradMarch: { count: 0, acres: 0 }, ambush: { count: 0, acres: 0 },
                    conquest: { count: 0, acres: 0 }, raze: { count: 0, acres: 0 },
                    learn: { count: 0, acres: 0 }, massacre: { count: 0, people: 0 },
                    plunder: { count: 0, acres: 0 }, bouncesMade: 0, bouncesSuffered: 0,
                    dragonsStarted: 0, dragonsCompleted: 0, dragonsKilled: 0,
                    ritualsStarted: 0, ritualsCompleted: 0
                };
            }
            data.kingdoms[kingdomId].dragonsStarted++;
        }
    }
    
    if (line.includes('has completed our dragon') || line.includes('has slain the dragon')) {
        const kingdomMatch = line.match(/\((\d+):(\d+)\)/);
        if (kingdomMatch) {
            const kingdomId = kingdomMatch[1] + ':' + kingdomMatch[2];
            if (!data.kingdoms[kingdomId]) {
                data.kingdoms[kingdomId] = {
                    attacksMade: 0, attacksSuffered: 0, acresGained: 0, acresLost: 0,
                    provinces: {}, tradMarch: { count: 0, acres: 0 }, ambush: { count: 0, acres: 0 },
                    conquest: { count: 0, acres: 0 }, raze: { count: 0, acres: 0 },
                    learn: { count: 0, acres: 0 }, massacre: { count: 0, people: 0 },
                    plunder: { count: 0, acres: 0 }, bouncesMade: 0, bouncesSuffered: 0,
                    dragonsStarted: 0, dragonsCompleted: 0, dragonsKilled: 0,
                    ritualsStarted: 0, ritualsCompleted: 0
                };
            }
            if (line.includes('completed')) {
                data.kingdoms[kingdomId].dragonsCompleted++;
            } else if (line.includes('slain')) {
                data.kingdoms[kingdomId].dragonsKilled++;
            }
        }
    }
    
    // Ritual patterns
    if (line.includes('started developing a ritual') || line.includes('We have started developing a ritual')) {
        data.ownKingdomId = '5:1'; // Assuming this is the own kingdom
        if (!data.kingdoms[data.ownKingdomId]) {
            data.kingdoms[data.ownKingdomId] = {
                attacksMade: 0, attacksSuffered: 0, acresGained: 0, acresLost: 0,
                provinces: {}, tradMarch: { count: 0, acres: 0 }, ambush: { count: 0, acres: 0 },
                conquest: { count: 0, acres: 0 }, raze: { count: 0, acres: 0 },
                learn: { count: 0, acres: 0 }, massacre: { count: 0, people: 0 },
                plunder: { count: 0, acres: 0 }, bouncesMade: 0, bouncesSuffered: 0,
                dragonsStarted: 0, dragonsCompleted: 0, dragonsKilled: 0,
                ritualsStarted: 0, ritualsCompleted: 0
            };
        }
        data.kingdoms[data.ownKingdomId].ritualsStarted++;
    }
    
    if (line.includes('has completed our dragon')) {
        const provinceMatch = line.match(/^(\w+)/);
        if (provinceMatch && data.ownKingdomId) {
            data.kingdoms[data.ownKingdomId].dragonsCompleted++;
        }
    }
}

/**
 * Updates highlights based on attack data
 */
function updateHighlights(data, attackType, attacker, defender, acres, people) {
    if (attackType === 'tradMarch' && acres > 0) {
        if (acres > data.highlights.mostLandGainedTrad.acres) {
            data.highlights.mostLandGainedTrad = { 
                province: attacker.number + ' - ' + attacker.name, 
                acres: acres 
            };
        }
        if (acres > data.highlights.mostLandLostTrad.acres) {
            data.highlights.mostLandLostTrad = { 
                province: defender.number + ' - ' + defender.name, 
                acres: acres 
            };
        }
    }
    
    if (attackType === 'ambush' && acres > 0) {
        if (acres > data.highlights.mostLandGainedAmbush.acres) {
            data.highlights.mostLandGainedAmbush = { 
                province: attacker.number + ' - ' + attacker.name, 
                acres: acres 
            };
        }
        if (acres > data.highlights.mostLandLostAmbush.acres) {
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
function formatKingdomNewsOutput(data) {
    const output = [];
    
    // Header
    output.push('Kingdom News Report');
    
    // Date range
    if (data.startDate && data.endDate) {
        const startMonth = data.startDate.split(' ')[0];
        const startDay = parseInt(data.startDate.split(' ')[1]);
        const startYear = data.startDate.split(' ')[3];
        const endMonth = data.endDate.split(' ')[0];
        const endDay = parseInt(data.endDate.split(' ')[1]);
        const endYear = data.endDate.split(' ')[3];
        
        // Calculate day count
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        const startMonthIndex = months.indexOf(startMonth);
        const endMonthIndex = months.indexOf(endMonth);
        
        let totalDays = 0;
        
        if (startYear === endYear) {
            // Same year
            if (startMonthIndex === endMonthIndex) {
                totalDays = endDay - startDay + 1;
            } else {
                // Days remaining in start month
                totalDays = 24 - startDay + 1;
                // Full months between
                for (let m = startMonthIndex + 1; m < endMonthIndex; m++) {
                    totalDays += 24;
                }
                // Days in end month
                totalDays += endDay;
            }
        } else {
            // Different years (year rollover)
            // Days remaining in start year
            totalDays = 24 - startDay + 1;
            for (let m = startMonthIndex + 1; months.length; m++) {
                totalDays += 24;
            }
            // Full months in new year
            for (let m = 0; m < endMonthIndex; m++) {
                totalDays += 24;
            }
            // Days in end month
            totalDays += endDay;
        }
        
        output.push(`${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear} (${totalDays} days)`);
    }
    
    output.push('');
    
    // Find own kingdom (assuming 5:1 based on the example)
    const ownKingdomId = data.ownKingdomId || '5:1';
    const ownKingdom = data.kingdoms[ownKingdomId];
    
    if (ownKingdom) {
        // Own kingdom summary
        output.push(`Own Kingdom ${ownKingdomId}`);
        output.push(`Total Attacks Made: ${ownKingdom.attacksMade} (${ownKingdom.acresGained} acres)`);
        output.push(`Uniques: ${Object.keys(ownKingdom.provinces).length}`);
        output.push(`Trad March: ${ownKingdom.tradMarch.count} (${ownKingdom.tradMarch.acres} acres)`);
        output.push(`Ambush: ${ownKingdom.ambush.count} (${ownKingdom.ambush.acres} acres)`);
        output.push(`Conquest: ${ownKingdom.conquest.count} (${ownKingdom.conquest.acres} acres)`);
        output.push(`Raze: ${ownKingdom.raze.count} (${ownKingdom.razeAcresMade} acres)`);
        output.push(`Learn: ${ownKingdom.learn.count}`);
        output.push(`Massacre: ${ownKingdom.massacre.count} (${ownKingdom.massacre.people} people)`);
        output.push(`Plunder: ${ownKingdom.plunder.count}`);
        output.push(`Bounces: ${ownKingdom.bouncesMade}`);
        output.push(`Dragons Started: ${ownKingdom.dragonsStarted}`);
        output.push(`Dragons Completed: ${ownKingdom.dragonsCompleted}`);
        output.push(`Enemy Dragons Killed: ${ownKingdom.dragonsKilled}`);
        output.push(`Rituals Started: ${ownKingdom.ritualsStarted}`);
        output.push(`Rituals Completed: ${ownKingdom.ritualsCompleted}`);
        output.push('');
        
        output.push(`Total Attacks Suffered: ${ownKingdom.attacksSuffered} (${ownKingdom.acresLost} acres)`);
        output.push(`Uniques: ${Object.keys(ownKingdom.provinces).length}`);
        output.push(`Trad March: ${ownKingdom.tradMarch.count} (${ownKingdom.tradMarch.acres} acres)`);
        output.push(`Ambush: ${ownKingdom.ambush.count} (${ownKingdom.ambush.acres} acres)`);
        output.push(`Conquest: ${ownKingdom.conquest.count} (${ownKingdom.conquest.acres} acres)`);
        output.push(`Raze: ${ownKingdom.razeSufferedCount} (${ownKingdom.razeAcresSuffered} acres)`);
        output.push(`Learn: ${ownKingdom.learn.count}`);
        output.push(`Massacre: ${ownKingdom.massacre.count} (${ownKingdom.massacre.people} people)`);
        output.push(`Plunder: ${ownKingdom.plunder.count}`);
        output.push(`Bounces: ${ownKingdom.bouncesSuffered}`);
        output.push(`Dragons Started: ${ownKingdom.dragonsStarted}`);
        output.push(`Dragons Completed: ${ownKingdom.dragonsCompleted}`);
        output.push('');
        
        // Province breakdown
        output.push(`Own Kingdom ${ownKingdomId}`);
        output.push(`Total Acres: ${ownKingdom.acresGained - ownKingdom.acresLost} (${ownKingdom.attacksMade}/${ownKingdom.attacksSuffered})`);
        
        const provinceList = [];
        for (const [provinceName, provinceData] of Object.entries(ownKingdom.provinces)) {
            const netAcres = provinceData.acresGained - provinceData.acresLost;
            provinceList.push({
                name: provinceName,
                netAcres: netAcres,
                attacksMade: provinceData.attacksMade,
                attacksSuffered: provinceData.attacksSuffered
            });
        }
        
        provinceList.sort((a, b) => b.netAcres - a.netAcres);
        
        for (const province of provinceList) {
            let netAcresStr;
            if (province.netAcres >= 100) {
                netAcresStr = province.netAcres.toString().padStart(4);
            } else if (province.netAcres >= 10) {
                netAcresStr = province.netAcres.toString().padStart(4);
            } else if (province.netAcres >= 0) {
                netAcresStr = province.netAcres.toString().padStart(4);
            } else if (province.netAcres <= -100) {
                netAcresStr = province.netAcres.toString().padStart(4);
            } else if (province.netAcres <= -10) {
                netAcresStr = province.netAcres.toString().padStart(4);
            } else {
                netAcresStr = province.netAcres.toString().padStart(4);
            }
            output.push(`${netAcresStr} | ${province.name} (${province.attacksMade}/${province.attacksSuffered})`);
        }
        
        output.push('');
        
        // Uniques for own kingdom
        output.push(`Uniques for ${ownKingdomId}`);
        const uniquesList = [];
        for (const [provinceName, provinceData] of Object.entries(ownKingdom.provinces)) {
            uniquesList.push({
                name: provinceName,
                attacks: provinceData.attacksMade
            });
        }
        
        uniquesList.sort((a, b) => b.attacks - a.attacks);
        
        for (const province of uniquesList) {
            output.push(`${province.name} ${province.attacks}`);
        }
        
        output.push('');
    }
    
    // Other kingdoms
    for (const [kingdomId, kingdomData] of Object.entries(data.kingdoms)) {
        if (kingdomId !== ownKingdomId) {
            output.push(`The Kingdom of ${kingdomId}`);
            output.push(`Total Acres: ${kingdomData.acresGained - kingdomData.acresLost} (${kingdomData.attacksMade}/${kingdomData.attacksSuffered})`);
            
            const provinceList = [];
            for (const [provinceName, provinceData] of Object.entries(kingdomData.provinces)) {
                const netAcres = provinceData.acresGained - provinceData.acresLost;
                provinceList.push({
                    name: provinceName,
                    netAcres: netAcres,
                    attacksMade: provinceData.attacksMade,
                    attacksSuffered: provinceData.attacksSuffered
                });
            }
            
            provinceList.sort((a, b) => b.netAcres - a.netAcres);
            
            for (const province of provinceList) {
                let netAcresStr;
                if (province.netAcres >= 100) {
                    netAcresStr = province.netAcres.toString().padStart(4);
                } else if (province.netAcres >= 10) {
                    netAcresStr = province.netAcres.toString().padStart(4);
                } else if (province.netAcres >= 0) {
                    netAcresStr = province.netAcres.toString().padStart(4);
                } else if (province.netAcres <= -100) {
                    netAcresStr = province.netAcres.toString().padStart(4);
                } else if (province.netAcres <= -10) {
                    netAcresStr = province.netAcres.toString().padStart(4);
                } else {
                    netAcresStr = province.netAcres.toString().padStart(4);
                }
                output.push(`${netAcresStr} | ${province.name} (${province.attacksMade}/${province.attacksSuffered})`);
            }
            
            output.push('');
            
            // Uniques for this kingdom
            output.push(`Uniques for ${kingdomId}`);
            const uniquesList = [];
            for (const [provinceName, provinceData] of Object.entries(kingdomData.provinces)) {
                uniquesList.push({
                    name: provinceName,
                    attacks: provinceData.attacksMade
                });
            }
            
            uniquesList.sort((a, b) => b.attacks - a.attacks);
            
            for (const province of uniquesList) {
                output.push(`${province.name} ${province.attacks}`);
            }
            
            output.push('');
        }
    }
    
    // Highlights
    output.push('Highlights');
    if (data.highlights.mostLandGainedTrad.acres > 0) {
        output.push(`Most land gained in a single trad march - ${data.highlights.mostLandGainedTrad.province}: ${data.highlights.mostLandGainedTrad.acres}`);
    }
    if (data.highlights.mostLandLostTrad.acres > 0) {
        output.push(`Most land lost in a single trad march - ${data.highlights.mostLandLostTrad.province}: ${data.highlights.mostLandLostTrad.acres}`);
    }
    if (data.highlights.mostLandGainedAmbush.acres > 0) {
        output.push(`Most land gained in a single ambush - ${data.highlights.mostLandGainedAmbush.province}: ${data.highlights.mostLandGainedAmbush.acres}`);
    }
    if (data.highlights.mostLandLostAmbush.acres > 0) {
        output.push(`Most land lost in a single ambush - ${data.highlights.mostLandLostAmbush.province}: ${data.highlights.mostLandLostAmbush.acres}`);
    }
    
    return output.join('\n');
}

// =============================================================================
// MODULE EXPORTS
// =============================================================================

module.exports = {
    // Main parsing functions
    parseKingdomNewsReport,
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
    
    // Error classes
    ParseError,
    
    // Constants (for testing)
    PARSE_PATTERNS,
    ERROR_MESSAGES,
    PROVINCE_LOGS_CONFIG
};
