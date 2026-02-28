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
const PATTERNS_FILE = path.join(__dirname, '.analyzed-patterns.json');
const ISSUE_MAP_FILE = path.join(__dirname, '.github-issue-map.json');
const NO_SYNC = process.argv.includes('--no-sync');
const NO_ISSUES = process.argv.includes('--no-issues');
const CLOSE_ISSUES = process.argv.includes('--close-issues');

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
// Line normalisation — collapse numeric variation so structurally identical
// lines group together regardless of amounts, kingdoms, etc.
// ---------------------------------------------------------------------------
function normalise(line) {
    return line
        .replace(/\(\d+:\d+\)/g, '(K:K)')  // kingdom IDs like (4:1)
        .replace(/\d+/g, 'N')               // all remaining digit sequences
        .replace(/\s+/g, ' ')               // collapse whitespace
        .trim();
}

// ---------------------------------------------------------------------------
// Recursively find all *.jsonl files under a directory
// ---------------------------------------------------------------------------
function findJsonl(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            findJsonl(full, results);
        } else if (entry.name.endsWith('.jsonl')) {
            results.push(full);
        }
    }
    return results;
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
                    events.push({
                        line: obj.line,
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
// ---------------------------------------------------------------------------
async function interactive(groups, acknowledged, rl) {
    const question = (q) => new Promise(resolve => rl.question(q, resolve));

    let quit = false;
    for (let i = 0; i < groups.length && !quit; i++) {
        const g = groups[i];
        console.log(`[${i + 1}/${groups.length}] ${g.count} occurrence(s) — ${g.contexts}`);
        console.log(`  Example: "${g.example}"`);
        console.log(`  Pattern: "${g.pattern}"`);

        const answer = (await question('\n  (c) create ticket  (s) skip  (q) quit  > ')).trim().toLowerCase();
        console.log('');

        if (answer === 'q') {
            console.log('Quitting.');
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
        } else {
            console.log('  Skipped.');
            // Not added to acknowledged — will reappear on next run
        }
    }

    if (!quit) console.log('Done.');
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
    if (!NO_SYNC) {
        const bucket = getLogBucket();
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
    const files = findJsonl(LOGS_DIR);
    if (files.length > 0) {
        const events = parseAllLogs(files);
        if (events.length > 0) {
            const acknowledged = loadAcknowledged();
            const allGroups    = groupEvents(events);
            const newGroups    = allGroups.filter(g => !acknowledged.has(g.pattern));

            if (newGroups.length > 0) {
                printSummary(newGroups, events.length, files.length);
                await interactive(newGroups, acknowledged, rl);
            } else {
                console.log(`All ${allGroups.length} pattern(s) already acknowledged. Nothing to do.`);
            }
        } else {
            console.log('No log events found in ./logs/.');
        }
    } else {
        console.log('No .jsonl files found under ./logs/.' +
            (NO_SYNC ? ' Run without --no-sync to fetch from S3.' : ''));
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
