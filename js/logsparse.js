// --- Data lists ---
// Spell names, the text to match in logs, and their impact identifier which comes after the count of the impact (if applicable)
const SPELLS_LIST = [
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
];

// Thievery operation names, the text to match in logs, their impact identifier which comes after the count of the impact (if applicable), and whether they have a unique impact (like Greater Arson or Propaganda that impact multiple types)
const OPS_LIST = [
    { name: "Arson", text: "burn", impact: "acres", unique_impact: true },
    { name: "Assassinate Wizards", text: "wizards of the enemy", impact: "wizards", unique_impact: false },
    { name: "Bribe Generals", text: "Our thieves have bribed an enemy general", impact: "", unique_impact: true },
    { name: "Bribe Thieves", text: "Our thieves have bribed members of our enemies", impact: "", unique_impact: true },
    { name: "Destabilize Guilds", text: "Our thieves have destablized", impact: "days", unique_impact: false },
    { name: "Free Prisoners", text: "Our thieves freed", impact: "prisoners", unique_impact: false },
    //{ name: "Greater Arson", text: "Our thieves burned down", impact: "", unique_impact: true },
    { name: "Incite Riots", text: "Our thieves have caused ri", impact: "day", unique_impact: false },
    { name: "Kidnapping", text: "Our thieves kidnapped many people", impact: "of them", unique_impact: false },
    { name: "Night Strike", text: "enemy troops.", impact: "enemy troops", unique_impact: false },
    { name: "Propaganda", text: "We have converted", impact: "", unique_impact: true },
    { name: "Sabotage Wizards", text: "ability to regain their mana", impact: "day", unique_impact: false }
];

// Building names for Greater Arson operations, used to track specific buildings burned down
const BUILDINGS_LIST = [
    { name: "Homes" }, { name: "Farms" }, { name: "Mills" }, { name: "Banks" },
    { name: "Training Grounds" }, { name: "Armouries" }, { name: "Military Barracks" },
    { name: "Forts" }, { name: "Castles" }, { name: "Hospitals" }, { name: "Guilds" },
    { name: "Towers" }, { name: "Thieves' Dens" }, { name: "Watch Towers" },
    { name: "Universities" }, { name: "Libraries" }, { name: "Stables" }, { name: "Dungeons" }
];

// Propaganda troop types, used to track how many of each type were converted
const PROPAGANDA_LIST = [
    { name: "thieves" }, { name: "soldiers" }, { name: "wizards" }, { name: "specialist troops" }
];

// --- Helpers ---
// Escapes special regex characters in a string for safe use in RegExp
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// Formats a number with commas for readability
function formatNumber(n) {
    return n.toLocaleString();
}

// --- Main logic ---
// Parses the pasted log text and returns a formatted summary string
function formatProvinceLogs(text) {
    // Split input text into lines, trim whitespace, and remove empty lines
    let lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // Remove date prefix up to and including "YR" and the following number for each line
    lines = lines.map(line => line.replace(/^.*?YR\d+\s*/, '').trim())
                 // Skip lines that begin with a time stamp in 00:00 format (two-digit hour and two-digit minute)
                 .filter(line => !/^\d{2}:\d{2}\b/.test(line))
                 .filter(Boolean);

    // Initialize counters and accumulators for all tracked events
    const spell_counts = {};
    const spell_impacts = {};
    const aid_totals = {};
    let dragon_troops_total = 0;
    let dragon_points_total = 0;
    let dragon_gold_donated = 0;
    let dragon_bushels_donated = 0;
    const thievery_counts = {};
    const thievery_impacts = {};
    const greater_arson_building_counts = {};
    const propaganda_counts = {};
    let greater_arson_ops_count = 0;
    let ritual_casts = 0;

    // Resources Stolen
    let gold_coins_stolen = 0;
    let bushels_stolen = 0;
    let runes_stolen = 0;
    let war_horses_stolen = 0;

    // Initialize all counters to zero for each tracked type
    SPELLS_LIST.forEach(s => { spell_counts[s.name] = 0; spell_impacts[s.name] = 0; });
    OPS_LIST.forEach(o => { thievery_counts[o.name] = 0; thievery_impacts[o.name] = 0; });
    BUILDINGS_LIST.forEach(b => { greater_arson_building_counts[b.name] = 0; });
    PROPAGANDA_LIST.forEach(p => { propaganda_counts[p.name] = 0; });
    ["soldiers", "gold coins", "bushels", "runes", "explore pool acres"].forEach(r => { aid_totals[r] = 0; });

    // --- Main parsing loop ---
    for (const line of lines) {
        // --- Spells ---
        if (line.includes("begin casting")) {
            for (const spell of SPELLS_LIST) {
                if (line.includes(spell.text)) {
                    spell_counts[spell.name]++;
                    if (spell.impact) {
                        // Extract the impact value (e.g., number of days, runes, etc.)
                        const m = line.match(new RegExp(`([\\d,]+)\\s+${escapeRegExp(spell.impact)}`, "i"));
                        if (m) spell_impacts[spell.name] += parseInt(m[1].replace(/,/g, ""));
                    }
                }
            }
        }
        // --- Aid ---
        if (line.includes("We have sent")) {
            // Extract amount and resource type from aid lines
            const m = line.match(/We have sent\s+([\d,]+)\s+(soldiers|gold coins|bushels|runes|explore pool acres)/i);
            if (m) {
                aid_totals[m[2].toLowerCase()] += parseInt(m[1].replace(/,/g, ""));
            }
        }
        // --- Thievery ---
        if (line.includes("Early indications show that our operation was a success")) {
            for (const op of OPS_LIST) {
                // Handle Arson (special case: buildings)
                if (op.name === "Arson" && op.unique_impact) {
                    if (line.includes(op.text) && line.includes("buildings")) {
                        thievery_counts[op.name]++;
                        const m = line.match(/([\d,]+)\s+acres/i);
                        if (m) thievery_impacts[op.name] += parseInt(m[1].replace(/,/g, ""));
                    }
                }
                // Handle Greater Arson (special case: specific buildings)
                else if (op.name === "Greater Arson" && op.unique_impact) {
                    if (line.includes(op.text) && !line.includes("buildings")) {
                        greater_arson_ops_count++;
                        for (const b of BUILDINGS_LIST) {
                            const m = line.match(new RegExp(`([\\d,]+)\\s+acres of ${escapeRegExp(b.name)}`, "i"));
                            if (m) greater_arson_building_counts[b.name] += parseInt(m[1].replace(/,/g, ""));
                        }
                    }
                }
                // Handle Bribe Generals
                else if (op.name === "Bribe Generals" && op.unique_impact) {
                    if (line.includes(op.text)) {
                        thievery_counts[op.name]++;
                        thievery_impacts[op.name]++;
                    }
                }
                // Handle Bribe Thieves
                else if (op.name === "Bribe Thieves" && op.unique_impact) {
                    if (line.includes(op.text)) {
                        thievery_counts[op.name]++;
                        thievery_impacts[op.name]++;
                    }
                }
                // Handle Propaganda (special case: multiple troop types, with fallback to "elites")
                else if (op.name === "Propaganda" && op.unique_impact) {
                    if (line.includes(op.text)) {
                        let foundMatch = false;
                        for (const p of PROPAGANDA_LIST) {
                            // Try to match "number of the enemy's troop_type"
                            const m = line.match(new RegExp(`([\\d,]+)\\s+of the enemy's\\s+${escapeRegExp(p.name)}`, "i"));
                            if (m) {
                                propaganda_counts[p.name] += parseInt(m[1].replace(/,/g, ""));
                                foundMatch = true;
                            }
                        }
                        // If no troop type matched, default to "elites"
                        if (!foundMatch) {
                            const m = line.match(/([\d,]+)\s+\w+/);
                            if (m) propaganda_counts["elites"] = (propaganda_counts["elites"] || 0) + parseInt(m[1].replace(/,/g, ""));
                        }
                    }
                }
                // Handle standard ops
                else if (line.includes(op.text) && !op.unique_impact) {
                    thievery_counts[op.name]++;
                    if (op.impact) {
                        const m = line.match(new RegExp(`([\\d,]+)\\s+${escapeRegExp(op.impact)}`, "i"));
                        if (m) thievery_impacts[op.name] += parseInt(m[1].replace(/,/g, ""));
                    }
                }
            }
        }
        // --- Ritual ---
        if (line.includes("We are now closer to completing our ritual project")) {
            ritual_casts++;
        }
        // --- Dragon donations ---
        if (line.includes("to the quest of launching a dragon")) {
            // Extract gold and bushels donated to the dragon
            const mGold = line.match(/([\d,]+)\s+gold coins/i);
            if (mGold) dragon_gold_donated += parseInt(mGold[1].replace(/,/g, ""));
            const mBushels = line.match(/([\d,]+)\s+bushels/i);
            if (mBushels) dragon_bushels_donated += parseInt(mBushels[1].replace(/,/g, ""));
        }
        // --- Dragon troops/points ---
        if (line.includes("the dragon is weakened by") && line.includes("troops")) {
            // Extract troops and points sent to fight the dragon
            const mTroops = line.match(/([\d,]+)\s+troops/i);
            if (mTroops) dragon_troops_total += parseInt(mTroops[1].replace(/,/g, ""));
            const mPoints = line.match(/([\d,]+)\s+points/i);
            if (mPoints) dragon_points_total += parseInt(mPoints[1].replace(/,/g, ""));
        }
        // --- Resources Stolen ---
        if (
            line.includes("Our thieves have returned with") ||
            line.includes("Our thieves were able to steal")
        ) {
            // Extract stolen resources from thievery lines
            if (line.includes("gold coins")) {
                const m = line.match(/([\d,]+)\s+gold coins/i);
                if (m) gold_coins_stolen += parseInt(m[1].replace(/,/g, ""));
            } else if (line.includes("bushels")) {
                const m = line.match(/([\d,]+)\s+bushels/i);
                if (m) bushels_stolen += parseInt(m[1].replace(/,/g, ""));
            } else if (line.includes("runes")) {
                const m = line.match(/([\d,]+)\s+runes/i);
                if (m) runes_stolen += parseInt(m[1].replace(/,/g, ""));
            } else if (line.includes("war horses")) {
                const m = line.match(/([\d,]+)\s+war horses/i);
                if (m) war_horses_stolen += parseInt(m[1].replace(/,/g, ""));
            }
        }
    }

    // --- Output formatting ---
    let out = "\nSummary of Province Log Events\n" + "-".repeat(40) + "\n";

    // --- Thievery Summary ---
    out += "\nThievery Summary:\n";
    let op_totals = [];
    // Build a sorted list of ops by count
    for (const op of OPS_LIST) {
        let count = 0;
        if (op.unique_impact) {
            if (op.name === "Greater Arson") count = greater_arson_ops_count;
            else if (op.name === "Bribe Generals") count = thievery_counts[op.name];
            else if (op.name === "Bribe Thieves") count = thievery_counts[op.name];
            else if (op.name === "Propaganda") count = Object.values(propaganda_counts).reduce((a, b) => a + b, 0);
            else count = thievery_counts[op.name];
        } else {
            count = thievery_counts[op.name];
        }
        if (count > 0) op_totals.push([count, op.name, op]);
    }
    op_totals.sort((a, b) => b[0] - a[0]);

    // Output each op summary line
    for (const [count, name, op] of op_totals) {
        const impact = op.impact;
        const total_impact = thievery_impacts[name];
        if (op.unique_impact && name === "Greater Arson") {
            out += `${greater_arson_ops_count} Greater Arson:\n`;
            Object.entries(greater_arson_building_counts)
                .filter(([, c]) => c > 0)
                .sort((a, b) => b[1] - a[1])
                .forEach(([b_name, b_count]) => {
                    out += ` ${b_count} ${b_name}\n`;
                });
        } else if (op.unique_impact && name === "Propaganda") {
            out += "Propaganda:\n";
            Object.entries(propaganda_counts)
                .filter(([, c]) => c > 0)
                .sort((a, b) => b[1] - a[1])
                .forEach(([p_name, p_count]) => {
                    out += ` ${p_count} ${p_name}\n`;
                });
        } else if (op.unique_impact && name === "Bribe Generals") {
            out += `${count} Bribe Generals ops\n`;
        } else if (op.unique_impact && name === "Bribe Thieves") {
            out += `${count} Bribe Thieves ops\n`;
        } else if (impact) {
            // Pluralize "day" if needed and handle special cases for output
            let impactStr = impact;
            if (impactStr === "day" && total_impact > 1) {
                impactStr = "days";
            }
            // Change "of them" to "peasants"
            if (impactStr === "of them") {
                impactStr = "peasants";
            }
            out += `${count} ${name} for a total of ${formatNumber(total_impact)} ${impactStr}\n`;
        } else {
            out += `${count} ${name}\n`;
        }
    }

    // --- Resources Stolen summary ---
    out += "\nResources Stolen:\n";
    if (gold_coins_stolen > 0) out += `${formatNumber(gold_coins_stolen)} gold coins stolen\n`;
    if (bushels_stolen > 0) out += `${formatNumber(bushels_stolen)} bushels stolen\n`;
    if (runes_stolen > 0) out += `${formatNumber(runes_stolen)} runes stolen\n`;
    if (war_horses_stolen > 0) out += `${formatNumber(war_horses_stolen)} war horses stolen\n`;

    // --- Spell Summary ---
    out += "\nSpell Summary:\n";
    let spell_totals = [];
    for (const spell of SPELLS_LIST) {
        const count = spell_counts[spell.name];
        if (count > 0) spell_totals.push([count, spell.name, spell]);
    }
    spell_totals.sort((a, b) => b[0] - a[0]);
    for (const [count, , spell] of spell_totals) {
        let impact = spell.impact;
        const total_impact = spell_impacts[spell.name];
        // If impact is "of the men", change to "troops"
        if (impact === "of the men") {
            impact = "troops";
        }
        if (impact) {
            out += `${count} ${spell.name} for a total of ${formatNumber(total_impact)} ${impact}\n`;
        } else {
            out += `${count} ${spell.name}\n`;
        }
    }

    // --- Aid Summary ---
    out += "\nAid Summary:\n";
    Object.entries(aid_totals)
        .filter(([, total]) => total > 0)
        .sort((a, b) => b[1] - a[1])
        .forEach(([resource, total]) => {
            out += `${formatNumber(total)} ${resource}\n`;
        });

    // --- Dragon Summary ---
    out += "\nDragon Summary:\n";
    if (dragon_gold_donated > 0) out += `${formatNumber(dragon_gold_donated)} gold coins donated\n`;
    if (dragon_bushels_donated > 0) out += `${formatNumber(dragon_bushels_donated)} bushels donated\n`;
    if (dragon_troops_total > 0 || dragon_points_total > 0)
        out += `${formatNumber(dragon_troops_total)} troops sent and weakened by ${formatNumber(dragon_points_total)} points\n`;

    // --- Ritual Summary ---
    out += "\nRitual Summary:\n";
    out += `${ritual_casts} successful ritual casts\n`;

    // Return the formatted summary string (trimmed)
    return out.trim();
}

// --- Event binding ---
// Wait for the DOM to load, then set up the submit button event handler
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submitButton").addEventListener("click", function () {
        const input = document.getElementById("inputText").value;
        const output = formatProvinceLogs(input);
        // Add a newline at the end for better readability in the output box
        document.getElementById("results").textContent = output + "\n";
    });
});