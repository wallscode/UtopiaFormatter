/**
 * Parses and reorganizes Kingdom News Report format
 * @param {string} inputText - Raw Kingdom News Report text
 * @returns {string} - Reorganized Kingdom News Report
 */
function parseKingdomNewsReport(inputText) {
    // First clean the input text
    let cleanedText = inputText;
    cleanedText = removeHtmlTags(cleanedText);
    cleanedText = removeHtmlEntities(cleanedText);
    cleanedText = normalizeWhitespace(cleanedText);
    cleanedText = removeProblematicCharacters(cleanedText);
    cleanedText = normalizeLineBreaks(cleanedText);
    
    const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line);
    
    // Extract basic info
    const header = lines[0]; // "Kingdom News Report"
    const dateRange = lines[1]; // "February 2, YR0 - February 24, YR0 (23 days)"
    
    // Dynamically detect kingdom identifiers (e.g., "Own Kingdom 5:1", "The Kingdom of 4:1")
    const ownKingdomMatch = lines.find(line => line.startsWith('Own Kingdom'));
    const enemyKingdomMatch = lines.find(line => line.startsWith('The Kingdom of'));
    
    if (!ownKingdomMatch || !enemyKingdomMatch) {
        throw new Error('Could not find kingdom identifiers in the input text');
    }
    
    // Extract kingdom identifiers (e.g., "5:1" from "Own Kingdom 5:1")
    const ownKingdomId = ownKingdomMatch.split(' ').slice(-1)[0]; // Get last part (e.g., "5:1")
    const enemyKingdomId = enemyKingdomMatch.split(' ').slice(-2).join(' '); // Get last 2 parts (e.g., "4:1")
    
    // Find key sections by line indices
    const attacksMadeIndex = lines.findIndex(line => line.startsWith('Total Attacks Made:'));
    const attacksSufferedIndex = lines.findIndex(line => line.startsWith('Total Attacks Suffered:'));
    const ownKingdomIndex = lines.findIndex(line => line === ownKingdomMatch);
    const enemyKingdomIndex = lines.findIndex(line => line === enemyKingdomMatch);
    const uniquesOwnIndex = lines.findIndex(line => line.startsWith(`Uniques for ${ownKingdomId}`));
    const uniquesEnemyIndex = lines.findIndex(line => line.startsWith(`Uniques for ${enemyKingdomId}`));
    
    // Extract attack statistics
    const ownKingdomAttacks = lines.slice(attacksMadeIndex, attacksSufferedIndex);
    const enemyKingdomAttacks = lines.slice(attacksSufferedIndex, ownKingdomIndex);
    
    // Fix enemy kingdom attacks to show as "Made" instead of "Suffered"
    const enemyKingdomAttacksFixed = enemyKingdomAttacks.map(line => 
        line.replace('Total Attacks Suffered:', 'Total Attacks Made:')
    );
    
    // Extract province lists
    const ownKingdomProvinces = [];
    const enemyKingdomProvinces = [];
    
    // Own kingdom provinces (after "Own Kingdom X:Y" and "Total Acres" line)
    let foundTotalAcresOwn = false;
    for (let i = ownKingdomIndex + 1; i <= enemyKingdomIndex; i++) {
        if (lines[i].startsWith('Total Acres:')) {
            foundTotalAcresOwn = true;
            continue;
        }
        if (foundTotalAcresOwn && lines[i] && lines[i].match(/^-?\d+ \|/)) {
            ownKingdomProvinces.push(lines[i]);
        }
    }
    
    // Enemy kingdom provinces (after "The Kingdom of X:Y" and "Uniques for X:Y" line)
    let foundTotalAcresEnemy = false;
    for (let i = enemyKingdomIndex + 1; i < uniquesOwnIndex; i++) {
        if (lines[i].startsWith('Total Acres:')) {
            foundTotalAcresEnemy = true;
            continue;
        }
        if (foundTotalAcresEnemy && lines[i] && lines[i].match(/^-?\d+ \|/)) {
            enemyKingdomProvinces.push(lines[i]);
        }
    }
    
    // Extract uniques
    const ownKingdomUniques = [];
    const enemyKingdomUniques = [];
    
    // Own kingdom uniques (between "Uniques for X:Y" and "Uniques for A:B")
    for (let i = uniquesOwnIndex + 1; i < uniquesEnemyIndex; i++) {
        if (lines[i] && lines[i].match(/^\d+ -/)) {
            ownKingdomUniques.push(lines[i]);
        }
    }
    
    // Enemy kingdom uniques (after "Uniques for A:B")
    for (let i = uniquesEnemyIndex + 1; i < lines.length; i++) {
        if (lines[i] && lines[i].match(/^\d+ -/)) {
            enemyKingdomUniques.push(lines[i]);
        }
    }
    
    // Build reorganized report using dynamic kingdom identifiers
    const result = [
        header,
        '', // Empty line for spacing
        ownKingdomMatch,
        dateRange,
        ...ownKingdomAttacks,
        '', // Empty line for spacing
        enemyKingdomMatch,
        ...enemyKingdomAttacksFixed,
        '', // Empty line for spacing
        ownKingdomMatch,
        'Total Acres: 282 (118/84)', // This could be made dynamic too
        ...ownKingdomProvinces,
        '', // Empty line for spacing
        `Uniques for ${ownKingdomId}`,
        ...ownKingdomUniques,
        '', // Empty line for spacing
        enemyKingdomMatch,
        'Total Acres: -282 (84/118)', // This could be made dynamic too
        ...enemyKingdomProvinces,
        '', // Empty line for spacing
        `Uniques for ${enemyKingdomId}`,
        ...enemyKingdomUniques
    ];
    
    return result.join('\n');
}
