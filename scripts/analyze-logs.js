#!/usr/bin/env node
'use strict';

/**
 * analyze-logs.js
 *
 * 1. GitHub Issues phase  — fetch open issues, prompt to create tk tickets
 * 2. S3 log sync          — sync unrecognized-line logs from S3
 * 3. Log analysis phase   — group patterns, prompt to create tk tickets
 *
 * Usage:
 *   node scripts/analyze-logs.js                     # full run (issues → sync → logs)
 *   node scripts/analyze-logs.js --no-sync           # skip S3 sync
 *   node scripts/analyze-logs.js --no-issues         # skip GitHub Issues phase
 *   node scripts/analyze-logs.js --close-issues      # also prompt to comment/close resolved issues
 *   node scripts/analyze-logs.js --reprocess-archive # review logs from the archive folder
 *
 * After a completed review, processed log files are moved to logs/archive/ rather than
 * deleted. Archive files are automatically removed after 7 days. Use --reprocess-archive
 * to re-examine archived logs (e.g. to re-evaluate patterns you previously skipped).
 *
 * Requires LOG_BUCKET in the environment or a .env file at the project root.
 * Requires `gh` CLI to be installed and authenticated for the GitHub Issues phase.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync, spawnSync } = require('child_process');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOGS_DIR = path.join(PROJECT_ROOT, 'logs');
const ARCHIVE_DIR = path.join(LOGS_DIR, 'archive');
const ARCHIVE_RETENTION_DAYS = 7;
const PATTERNS_FILE = path.join(__dirname, '.analyzed-patterns.json');
const ISSUE_MAP_FILE = path.join(__dirname, '.github-issue-map.json');
const NO_SYNC = process.argv.includes('--no-sync');
const NO_ISSUES = process.argv.includes('--no-issues');
const CLOSE_ISSUES = process.argv.includes('--close-issues');
const REPROCESS_ARCHIVE = process.argv.includes('--reprocess-archive');

// ---------------------------------------------------------------------------
// GitHub Issues — persistence
// ---------------------------------------------------------------------------
function loadIssueMap() {
    if (fs.existsSync(ISSUE_MAP_FILE)) {
        try { return JSON.parse(fs.readFileSync(ISSUE_MAP_FILE, 'utf8')); }
        catch { return {}; }
    }
    return {};
}

function saveIssueMap(map) {
    fs.writeFileSync(ISSUE_MAP_FILE, JSON.stringify(map, null, 2) + '\n');
}

// ---------------------------------------------------------------------------
// GitHub Issues — gh CLI helpers
// ---------------------------------------------------------------------------
function checkGhAuth() {
    return spawnSync('gh', ['auth', 'status'], { encoding: 'utf8' }).status === 0;
}

function getRepoUrl() {
    const r = spawnSync('gh', ['repo', 'view', '--json', 'url'], { encoding: 'utf8' });
    try { return JSON.parse(r.stdout).url; } catch { return null; }
}

function fetchOpenIssues() {
    const r = spawnSync(
        'gh', ['issue', 'list', '--state', 'open', '--json', 'number,title,body,createdAt', '--limit', '100'],
        { encoding: 'utf8' }
    );
    if (r.status !== 0) return null;
    try { return JSON.parse(r.stdout); } catch { return null; }
}

function isGitHubIssueOpen(number) {
    const r = spawnSync('gh', ['issue', 'view', String(number), '--json', 'state'], { encoding: 'utf8' });
    try { return JSON.parse(r.stdout).state === 'OPEN'; } catch { return false; }
}

function isTicketClosed(ticketId) {
    const r = spawnSync('tk', ['show', ticketId], { encoding: 'utf8' });
    return r.stdout.toLowerCase().includes('closed');
}

function getLatestCommit() {
    const r = spawnSync('git', ['log', '-1', '--format=%H %s'], { encoding: 'utf8' });
    const line = r.stdout.trim();
    if (!line) return null;
    const space = line.indexOf(' ');
    return { sha: line.substring(0, space).substring(0, 8), message: line.substring(space + 1) };
}

function commentAndClose(number, ticketId) {
    const commit = getLatestCommit();
    const commitRef = commit ? `commit ${commit.sha}: ${commit.message}` : 'a recent commit';
    const body = `Fixed in ${commitRef}\n\nTicket: ${ticketId}\nFix will be live after the next deployment.`;
    spawnSync('gh', ['issue', 'comment', String(number), '--body', body], { encoding: 'utf8', stdio: 'inherit' });
    spawnSync('gh', ['issue', 'close', String(number)], { encoding: 'utf8', stdio: 'inherit' });
}

function createTicketFromIssue(issue, repoUrl) {
    const title = `GH#${issue.number}: ${issue.title}`;
    const issueUrl = repoUrl
        ? `${repoUrl}/issues/${issue.number}`
        : `https://github.com/wallscode/UtopiaFormatter/issues/${issue.number}`;
    const desc = [
        `GitHub Issue: ${issueUrl}`,
        '',
        issue.body ? issue.body.trim() : '(no description)',
    ].join('\n');

    const r = spawnSync(
        'tk', ['create', title, '--type', 'bug', '--priority', '2', '--tags', 'github-issue', '--description', desc],
        { encoding: 'utf8' }
    );
    if (r.status !== 0) return { error: (r.stderr || '').trim() || 'tk create failed' };
    return { ticketId: r.stdout.trim() };
}

// ---------------------------------------------------------------------------
// GitHub Issues — interactive phase
// ---------------------------------------------------------------------------
async function githubIssuesPhase(rl) {
    const question = (q) => new Promise(resolve => rl.question(q, resolve));

    if (!checkGhAuth()) {
        console.log('⚠  gh CLI is not authenticated. Run `gh auth login` to enable GitHub Issues integration.');
        console.log('   Skipping GitHub Issues phase.\n');
        return;
    }

    const repoUrl = getRepoUrl();
    const issues = fetchOpenIssues();
    if (!issues) {
        console.log('⚠  Could not fetch GitHub Issues. Skipping.\n');
        return;
    }

    const issueMap = loadIssueMap();

    // Filter: skip already-mapped issues (unless the ticket is now closed, which close-issues handles)
    const newIssues = issues.filter(i => !issueMap[String(i.number)]);

    if (newIssues.length === 0) {
        console.log('✓  No new GitHub Issues to process.\n');
        return;
    }

    console.log(`\n=== GitHub Issues (${newIssues.length} new) ===\n`);

    for (const issue of newIssues) {
        const bodyPreview = (issue.body || '(no description)')
            .split('\n').slice(0, 8).join('\n  ');

        console.log(`[GitHub Issue #${issue.number}] "${issue.title}"`);
        console.log(`  Body: ${bodyPreview}`);

        const answer = (await question('\n  (c) create ticket  (s) skip  (a) acknowledge  (q) quit issues  > ')).trim().toLowerCase();
        console.log('');

        if (answer === 'q') {
            console.log('Stopping GitHub Issues phase.\n');
            break;
        } else if (answer === 'c') {
            const result = createTicketFromIssue(issue, repoUrl);
            if (result.error) {
                console.log(`  Error: ${result.error}`);
            } else {
                const issueUrl = repoUrl
                    ? `${repoUrl}/issues/${issue.number}`
                    : `https://github.com/wallscode/UtopiaFormatter/issues/${issue.number}`;
                console.log(`  Created: ${result.ticketId}`);
                issueMap[String(issue.number)] = result.ticketId;
                saveIssueMap(issueMap);
                // Comment on the issue to confirm tracking
                spawnSync(
                    'gh', ['issue', 'comment', String(issue.number),
                        '--body', `Tracked as ticket ${result.ticketId} — working on it.`],
                    { encoding: 'utf8' }
                );
            }
        } else if (answer === 'a') {
            issueMap[String(issue.number)] = '__acknowledged__';
            saveIssueMap(issueMap);
            console.log('  Acknowledged (no ticket).');
        } else {
            console.log('  Skipped.');
        }
    }
}

// ---------------------------------------------------------------------------
// GitHub Issues — close resolved issues phase
// ---------------------------------------------------------------------------
async function closeResolvedIssuesPhase(rl) {
    const question = (q) => new Promise(resolve => rl.question(q, resolve));

    if (!checkGhAuth()) {
        console.log('⚠  gh CLI not authenticated — skipping close-issues phase.\n');
        return;
    }

    const issueMap = loadIssueMap();
    const entries = Object.entries(issueMap).filter(([, v]) => v !== '__acknowledged__');

    if (entries.length === 0) {
        console.log('No tracked issue→ticket mappings found.\n');
        return;
    }

    console.log('\n=== Checking resolved issues ===\n');
    let found = 0;

    for (const [issueNum, ticketId] of entries) {
        if (!isTicketClosed(ticketId)) continue;
        if (!isGitHubIssueOpen(parseInt(issueNum))) continue;

        found++;
        console.log(`Issue #${issueNum} — ticket ${ticketId} is closed and the GitHub issue is still open.`);
        const answer = (await question('  (y) comment & close issue  (s) skip  > ')).trim().toLowerCase();
        console.log('');

        if (answer === 'y') {
            commentAndClose(parseInt(issueNum), ticketId);
            issueMap[issueNum] = '__resolved__';
            saveIssueMap(issueMap);
            console.log(`  Commented and closed #${issueNum}.`);
        } else {
            console.log('  Skipped.');
        }
    }

    if (found === 0) console.log('No resolved issues to close.\n');
}

// ---------------------------------------------------------------------------
// LOG_BUCKET resolution
// ---------------------------------------------------------------------------
function getLogBucket() {
    if (process.env.LOG_BUCKET) return process.env.LOG_BUCKET.trim();

    const envFile = path.join(PROJECT_ROOT, '.env');
    if (fs.existsSync(envFile)) {
        for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
            const m = line.match(/^LOG_BUCKET=(.+)$/);
            if (m) return m[1].trim();
        }
    }
    return null;
}

// ---------------------------------------------------------------------------
// Game date format — lines starting with this pattern are header lines that
// should never have been logged; skip them silently.
// ---------------------------------------------------------------------------
const GAME_DATE_REGEX = /^(January|February|March|April|May|June|July) \d{1,2} of YR\d+/;

// ---------------------------------------------------------------------------
// Known-ignorable patterns — lines reviewed and confirmed as non-content.
// These are silently skipped without prompting or persisting to acknowledged.
// Add entries here when a pattern is conclusively determined to need no ticket.
// ---------------------------------------------------------------------------
const IGNORABLE_PATTERNS = [
    /^Edition\w+\s+YR\d+/, // Edition header lines (e.g. "EditionJanuary YR8")
];

// ---------------------------------------------------------------------------
// Line normalisation — collapse numeric variation so structurally identical
// lines group together regardless of amounts, kingdoms, etc.
// ---------------------------------------------------------------------------
function normalise(line) {
    return line
        .replace(/\(\d+:\d+\)/g, '(K:K)')               // kingdom IDs like (4:1) → (K:K)
        .replace(/\([^()\n]*?\s*\(K:K\)/g,               // "(Province Name (K:K)" → "(PROVINCE (K:K)"
                 '(PROVINCE (K:K)')
        .replace(/(\d+\s*-\s*)[^()\n]*?\s*\(K:K\)/g,     // "N - Province Name (K:K)" → "N - PROVINCE (K:K)"
                 '$1PROVINCE (K:K)')
        .replace(/\d+/g, 'N')                             // all remaining digit sequences → N
        .replace(/\s+/g, ' ')                             // collapse whitespace
        .trim();
}

// ---------------------------------------------------------------------------
// Recursively find all *.jsonl files under a directory.
// Skips the archive/ subdirectory so normal runs don't pick up archived logs.
// ---------------------------------------------------------------------------
function findJsonl(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (full === ARCHIVE_DIR) continue; // never recurse into archive during normal runs
            findJsonl(full, results);
        } else if (entry.name.endsWith('.jsonl')) {
            results.push(full);
        }
    }
    return results;
}

// ---------------------------------------------------------------------------
// Archive helpers
// ---------------------------------------------------------------------------

/**
 * Moves a log file into the archive directory.
 * Appends a timestamp to the filename if a file with the same name already exists.
 */
function archiveFile(filePath) {
    if (!fs.existsSync(ARCHIVE_DIR)) {
        fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    }
    const basename = path.basename(filePath);
    let dest = path.join(ARCHIVE_DIR, basename);
    if (fs.existsSync(dest)) {
        const ext = path.extname(basename);
        const base = path.basename(basename, ext);
        dest = path.join(ARCHIVE_DIR, `${base}_${Date.now()}${ext}`);
    }
    fs.renameSync(filePath, dest);
}

/**
 * Deletes archive files older than ARCHIVE_RETENTION_DAYS.
 * Returns the number of files removed.
 */
function cleanExpiredArchive() {
    if (!fs.existsSync(ARCHIVE_DIR)) return 0;
    const cutoff = Date.now() - ARCHIVE_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    let deleted = 0;
    for (const entry of fs.readdirSync(ARCHIVE_DIR, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.jsonl')) continue;
        const full = path.join(ARCHIVE_DIR, entry.name);
        if (fs.statSync(full).mtimeMs < cutoff) {
            fs.unlinkSync(full);
            deleted++;
        }
    }
    return deleted;
}

// ---------------------------------------------------------------------------
// Parse every JSONL file; each line is { ts, context, line }
// ---------------------------------------------------------------------------
function parseAllLogs(files) {
    const events = [];
    for (const file of files) {
        const raw = fs.readFileSync(file, 'utf8').split('\n');
        for (const raw_line of raw) {
            if (!raw_line.trim()) continue;
            try {
                const obj = JSON.parse(raw_line);
                if (obj && typeof obj.line === 'string') {
                    const line = obj.line;
                    // Skip date header lines — these are not unrecognized game content
                    if (GAME_DATE_REGEX.test(line)) continue;
                    // Skip lines confirmed as ignorable (reviewed, no ticket needed)
                    if (IGNORABLE_PATTERNS.some(p => p.test(line))) continue;
                    events.push({
                        line,
                        context: typeof obj.context === 'string' ? obj.context : 'unknown',
                    });
                }
            } catch {
                // skip malformed entries
            }
        }
    }
    return events;
}

// ---------------------------------------------------------------------------
// Group events by normalised pattern; sort by frequency descending
// ---------------------------------------------------------------------------
function groupEvents(events) {
    const groups = new Map();
    for (const { line, context } of events) {
        const norm = normalise(line);
        if (!groups.has(norm)) {
            groups.set(norm, { count: 0, contexts: new Set(), example: line });
        }
        const g = groups.get(norm);
        g.count++;
        g.contexts.add(context);
    }
    return [...groups.entries()]
        .sort((a, b) => b[1].count - a[1].count)
        .map(([pattern, data]) => ({
            pattern,
            count: data.count,
            contexts: [...data.contexts].sort().join(', '),
            example: data.example,
        }));
}

// ---------------------------------------------------------------------------
// Acknowledged-pattern persistence
// ---------------------------------------------------------------------------
function loadAcknowledged() {
    if (fs.existsSync(PATTERNS_FILE)) {
        try {
            return new Set(JSON.parse(fs.readFileSync(PATTERNS_FILE, 'utf8')));
        } catch {
            return new Set();
        }
    }
    return new Set();
}

function saveAcknowledged(set) {
    fs.writeFileSync(PATTERNS_FILE, JSON.stringify([...set], null, 2) + '\n');
}

// ---------------------------------------------------------------------------
// Cross-parser misclassification detection
//
// When the UI misdetects the input format (e.g. Province News paste treated as
// Kingdom News), lines get logged as unrecognized in the wrong context.
// These checks flag likely misclassifications so the analyst can skip them
// instead of filing a spurious ticket.
// ---------------------------------------------------------------------------

// Province News event text patterns (after the date\t prefix is stripped)
const PROVINCE_NEWS_INDICATORS = [
    /Forces from .+? \(\d+:\d+\) came through/i,
    /came through and (?:ravaged|razed|killed)/i,
    /A successful (?:Traditional March|Conquest|Ambush|Massacre|Raze|Learn|Plunder)/i,
    /invaded .+? and (?:captured|killed)/i,
    /Our realm received a gift of/i,
    /We gained .+ from our daily login/i,
    /A (?:ceasefire|war|peace) (?:has|was)/i,
    /our kingdom has (?:won|lost) the war/i,
    /troops that were sent to aid/i,
    /attempted (?:a|an) .+ on our (?:province|realm)/i,
    /cast .+ on our (?:province|realm)/i,
    /Our scientists (?:have|gained)/i,
];

// Province Logs event text patterns
const PROVINCE_LOGS_INDICATORS = [
    /^Our thieves (have|successfully|attempted)/i,
    /^(?:January|February|March|April|May|June|July) \d{1,2} of YR\d+\s+(?:Our|Enemy|We|A spell|Cast)/i,
    /^(?:Sent|Received) an aid shipment/i,
    /^Our troops (?:have returned|were released)/i,
    /^(?:A|Our) (?:dragon|ritual)/i,
    /^(?:Construction|Exploration) (?:complete|in progress)/i,
];

// Kingdom News attack / event patterns
const KINGDOM_NEWS_INDICATORS = [
    /\(\d+:\d+\) (?:captured|invaded|ambushed|razed|killed|attacked|looted)/i,
    /captured [\d,]+ acres of land from/i,
    /invaded .+? and (?:captured|killed)/i,
    /killed [\d,]+ people within/i,
    /has (?:begun|completed) a (?:dragon|ritual)/i,
    /has declared WAR/i,
    /Our kingdom is now in a post-war period/i,
    /has sent an aid shipment to/i,
];

/**
 * Checks whether a line logged in `loggedContexts` actually looks like it
 * belongs to a different parser, indicating a UI misclassification.
 *
 * @param {string} line       - Example line from the log
 * @param {string} loggedContexts - Context(s) it was logged under (e.g. "kingdom-news")
 * @returns {{ likelyContext: string, reason: string, alreadyHandled: boolean } | null}
 */
function checkMisclassification(line, loggedContexts) {
    // Raw Province News format always uses tabs: "Month D of YRN\tevent text"
    if (line.includes('\t')) {
        const isLoggedAsKnOrPl = loggedContexts.includes('kingdom-news') ||
                                  loggedContexts.includes('province-logs');
        if (isLoggedAsKnOrPl) {
            return {
                likelyContext: 'province-news',
                reason: 'Line contains a tab — Province News uses tab-delimited "date\\tevent" format',
                alreadyHandled: true,
            };
        }
    }

    const notKN = !loggedContexts.includes('kingdom-news');
    const notPN = !loggedContexts.includes('province-news');
    const notPL = !loggedContexts.includes('province-logs');

    // Check if a non-PN context logged a line that looks like Province News
    if (notPN) {
        for (const pat of PROVINCE_NEWS_INDICATORS) {
            if (pat.test(line)) {
                return {
                    likelyContext: 'province-news',
                    reason: `Matches Province News event pattern: ${pat}`,
                    alreadyHandled: null, // can't confirm without running the PN parser
                };
            }
        }
    }

    // Check if a non-PL context logged a line that looks like Province Logs
    if (notPL) {
        for (const pat of PROVINCE_LOGS_INDICATORS) {
            if (pat.test(line)) {
                return {
                    likelyContext: 'province-logs',
                    reason: `Matches Province Logs event pattern: ${pat}`,
                    alreadyHandled: null,
                };
            }
        }
    }

    // Check if a non-KN context logged a line that looks like Kingdom News
    if (notKN) {
        for (const pat of KINGDOM_NEWS_INDICATORS) {
            if (pat.test(line)) {
                return {
                    likelyContext: 'kingdom-news',
                    reason: `Matches Kingdom News event pattern: ${pat}`,
                    alreadyHandled: null,
                };
            }
        }
    }

    return null;
}

// ---------------------------------------------------------------------------
// Auto-generate a human-readable ticket title from a normalised pattern
// ---------------------------------------------------------------------------
function makeTitle(pattern, contexts) {
    const prefix =
        contexts.includes('kingdom-news')  ? 'Kingdom News parser' :
        contexts.includes('province-logs') ? 'Province Logs parser' :
        contexts.includes('province-news') ? 'Province News parser' :
                                             'Parser';
    const snippet = pattern.length > 55 ? pattern.substring(0, 52) + '...' : pattern;
    return `${prefix}: handle "${snippet}"`;
}

// ---------------------------------------------------------------------------
// Create a ticket via tk using spawnSync (no shell — avoids quoting issues)
// ---------------------------------------------------------------------------
function createTicket(group) {
    const title = makeTitle(group.pattern, group.contexts);

    const desc = [
        `Unrecognized line reported ${group.count} time(s) in context: ${group.contexts}.`,
        '',
        'Example line:',
        `  ${group.example}`,
        '',
        'Normalised pattern:',
        `  ${group.pattern}`,
        '',
        '`logUnrecognizedLine()` is already instrumented at the call site.',
        'This is a parsing gap to fill — add a handler for this line format.',
    ].join('\n');

    // Tags: "parser" plus each context name
    const tags = ['parser', ...group.contexts.split(', ').filter(Boolean)].join(',');

    const result = spawnSync(
        'tk',
        ['create', title, '--type', 'feature', '--priority', '2', '--tags', tags, '--description', desc],
        { encoding: 'utf8' }
    );

    if (result.status === 0) {
        return result.stdout.trim();
    }
    // Surface the error so the caller can report it
    return { error: (result.stderr || '').trim() || 'tk create failed' };
}

// ---------------------------------------------------------------------------
// Print the ranked summary table
// ---------------------------------------------------------------------------
function printSummary(groups, totalEvents, totalFiles) {
    console.log('\n=== Unrecognized Line Report ===');
    console.log(`Logs: ${totalEvents.toLocaleString()} events from ${totalFiles} file(s)`);
    console.log(`Unacknowledged patterns: ${groups.length}\n`);

    const COL_CTX = 20;
    const COL_EX  = 44;
    const header = ` #   Count  ${'Context(s)'.padEnd(COL_CTX)}  Pattern (example)`;
    console.log(header);
    console.log('-'.repeat(header.length + 4));

    groups.forEach((g, i) => {
        const num     = String(i + 1).padStart(2);
        const count   = String(g.count).padStart(5);
        const ctx     = g.contexts.padEnd(COL_CTX).substring(0, COL_CTX);
        const display = g.example.length > COL_EX
            ? g.example.substring(0, COL_EX - 3) + '...'
            : g.example;
        console.log(`${num}  ${count}  ${ctx}  ${display}`);
    });
    console.log('');
}

// ---------------------------------------------------------------------------
// Interactive loop
// Returns true if the user quit early (so the caller can skip log deletion)
// ---------------------------------------------------------------------------
async function interactive(groups, acknowledged, rl) {
    const question = (q) => new Promise(resolve => rl.question(q, resolve));

    // Print action legend once at the start
    console.log('  Actions:');
    console.log('    c  create ticket    — file a bug/feature ticket for this pattern');
    console.log('    s  skip             — do nothing now; pattern will reappear next run');
    console.log('    a  acknowledge      — mark as reviewed with no ticket needed; will NOT reappear again');
    console.log('    q  quit             — stop reviewing; log files will NOT be deleted');
    console.log('');

    let quit = false;
    for (let i = 0; i < groups.length && !quit; i++) {
        const g = groups[i];
        console.log(`[${i + 1}/${groups.length}] ${g.count} occurrence(s) — context: ${g.contexts}`);
        console.log(`  Example: "${g.example}"`);
        console.log(`  Pattern: "${g.pattern}"`);

        // Check for cross-parser misclassification before prompting
        const mis = checkMisclassification(g.example, g.contexts);
        let defaultAction = 'c';
        let suggestionLine = '  Suggestion: create ticket — unrecognized line in its expected parser';

        if (mis) {
            console.log('');
            console.log(`  ⚠  Possible misclassification detected`);
            console.log(`     This line was logged by the ${g.contexts} parser but looks like ${mis.likelyContext} content.`);
            console.log(`     Reason: ${mis.reason}`);
            if (mis.alreadyHandled === true) {
                console.log(`     The ${mis.likelyContext} parser already handles this format.`);
                console.log(`     This is likely a UI input-type detection error, not a missing parser handler.`);
                suggestionLine = `  Suggestion: skip or acknowledge — already handled by ${mis.likelyContext} parser`;
            } else {
                console.log(`     Verify whether the ${mis.likelyContext} parser handles this before filing a ticket.`);
                suggestionLine = `  Suggestion: skip — verify in ${mis.likelyContext} parser first`;
            }
            defaultAction = 's';
        }

        console.log('');
        console.log(suggestionLine);
        const raw = (await question(`  Choice — c / s / a / q  [default: ${defaultAction}] > `)).trim().toLowerCase();
        const answer = raw || defaultAction;
        console.log('');

        if (answer === 'q') {
            console.log('Quitting. Log files will NOT be deleted.');
            quit = true;
        } else if (answer === 'c') {
            const result = createTicket(g);
            if (typeof result === 'string') {
                console.log(`  Created: ${result}`);
            } else {
                console.log(`  Error: ${result.error}`);
            }
            // Mark acknowledged even on error so we don't loop forever
            acknowledged.add(g.pattern);
            saveAcknowledged(acknowledged);
        } else if (answer === 'a') {
            acknowledged.add(g.pattern);
            saveAcknowledged(acknowledged);
            console.log('  Acknowledged — marked as reviewed, no ticket. Will not appear again.');
        } else {
            console.log('  Skipped — will reappear on next run.');
            // Not added to acknowledged — will reappear on next run
        }
    }

    if (!quit) console.log('Done.');
    return quit;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    // Phase 1: GitHub Issues
    if (!NO_ISSUES) {
        await githubIssuesPhase(rl);
    }

    // Phase 2: S3 sync
    let bucket = null;
    if (!NO_SYNC) {
        bucket = getLogBucket();
        if (!bucket) {
            console.error('Error: LOG_BUCKET is not set.\n' +
                'Add LOG_BUCKET=<bucket-name> to your environment or a .env file.');
            rl.close();
            process.exit(1);
        }
        console.log(`Syncing s3://${bucket}/logs/ → ./logs/ ...`);
        try {
            execSync(`aws s3 sync "s3://${bucket}/logs/" "${LOGS_DIR}/"`, { stdio: 'inherit' });
        } catch {
            console.error('aws s3 sync failed. Check your credentials and bucket name.');
            rl.close();
            process.exit(1);
        }
    }

    // Phase 3: Unrecognized line analysis
    const sourceDir = REPROCESS_ARCHIVE ? ARCHIVE_DIR : LOGS_DIR;
    const sourceLabel = REPROCESS_ARCHIVE ? './logs/archive/' : './logs/';
    const files = REPROCESS_ARCHIVE ? findJsonl(ARCHIVE_DIR) : findJsonl(LOGS_DIR);

    if (files.length > 0) {
        const events = parseAllLogs(files);
        if (events.length > 0) {
            if (REPROCESS_ARCHIVE) {
                console.log(`Reprocessing ${files.length} archived file(s) from ${sourceLabel}\n`);
            }
            const acknowledged = loadAcknowledged();
            const allGroups    = groupEvents(events);
            const newGroups    = allGroups.filter(g => !acknowledged.has(g.pattern));

            let quitEarly = false;
            if (newGroups.length > 0) {
                printSummary(newGroups, events.length, files.length);
                quitEarly = await interactive(newGroups, acknowledged, rl);
            } else {
                console.log(`All ${allGroups.length} pattern(s) already acknowledged. Nothing to do.`);
            }

            if (quitEarly) {
                console.log(`Log files kept in ${sourceLabel} (quit early). Re-run to continue reviewing.`);
            } else if (REPROCESS_ARCHIVE) {
                // Archive files have already been reviewed — remove them now.
                let deleted = 0;
                for (const f of files) {
                    try { fs.unlinkSync(f); deleted++; }
                    catch (err) { console.warn(`  Warning: could not delete ${f}: ${err.message}`); }
                }
                console.log(`Removed ${deleted} reviewed file(s) from ${sourceLabel}`);
            } else {
                // Move active log files to archive instead of deleting them.
                let archived = 0;
                for (const f of files) {
                    try { archiveFile(f); archived++; }
                    catch (err) { console.warn(`  Warning: could not archive ${f}: ${err.message}`); }
                }
                console.log(`Archived ${archived} log file(s) to ./logs/archive/`);

                // Move processed logs to S3 archive so they are not re-downloaded on the next
                // run, but remain recoverable. The S3 lifecycle rule on logs/archive/ handles
                // expiry after 7 days automatically.
                if (!NO_SYNC && bucket) {
                    console.log(`Moving processed logs to s3://${bucket}/logs/archive/ ...`);
                    try {
                        execSync(`aws s3 mv "s3://${bucket}/logs/" "s3://${bucket}/logs/archive/" --recursive`, { stdio: 'inherit' });
                    } catch (err) {
                        console.warn(`  Warning: could not move logs to S3 archive: ${err.message}`);
                    }
                }
            }
        } else {
            console.log(`No log events found in ${sourceLabel}`);
        }
    } else {
        if (REPROCESS_ARCHIVE) {
            console.log('No archived .jsonl files found in ./logs/archive/');
        } else {
            console.log('No .jsonl files found under ./logs/.' +
                (NO_SYNC ? ' Run without --no-sync to fetch from S3.' : ''));
        }
    }

    // Clean up archive files older than the retention period (normal runs only).
    if (!REPROCESS_ARCHIVE) {
        const expired = cleanExpiredArchive();
        if (expired > 0) {
            console.log(`Removed ${expired} expired archive file(s) (older than ${ARCHIVE_RETENTION_DAYS} days).`);
        }
    }

    // Phase 4: Close resolved GitHub Issues (if requested)
    if (CLOSE_ISSUES) {
        await closeResolvedIssuesPhase(rl);
    }

    rl.close();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
