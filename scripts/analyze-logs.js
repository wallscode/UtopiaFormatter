#!/usr/bin/env node
'use strict';

/**
 * analyze-logs.js
 *
 * Pulls unrecognized-line logs from S3, groups them by normalised pattern,
 * and interactively creates tk tickets for each group.
 *
 * Usage:
 *   node scripts/analyze-logs.js           # sync from S3 then analyse
 *   node scripts/analyze-logs.js --no-sync # analyse local ./logs/ cache only
 *
 * Requires LOG_BUCKET in the environment or a .env file at the project root.
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
const NO_SYNC = process.argv.includes('--no-sync');

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
async function interactive(groups, acknowledged) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
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

    rl.close();
    if (!quit) console.log('Done.');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    // S3 sync
    if (!NO_SYNC) {
        const bucket = getLogBucket();
        if (!bucket) {
            console.error('Error: LOG_BUCKET is not set.\n' +
                'Add LOG_BUCKET=<bucket-name> to your environment or a .env file.');
            process.exit(1);
        }
        console.log(`Syncing s3://${bucket}/logs/ → ./logs/ ...`);
        try {
            execSync(`aws s3 sync "s3://${bucket}/logs/" "${LOGS_DIR}/"`, { stdio: 'inherit' });
        } catch {
            console.error('aws s3 sync failed. Check your credentials and bucket name.');
            process.exit(1);
        }
    }

    // Discover and parse logs
    const files = findJsonl(LOGS_DIR);
    if (files.length === 0) {
        console.log('No .jsonl files found under ./logs/.' +
            (NO_SYNC ? ' Run without --no-sync to fetch from S3.' : ''));
        process.exit(0);
    }

    const events = parseAllLogs(files);
    if (events.length === 0) {
        console.log('No log events found in ./logs/.');
        process.exit(0);
    }

    // Filter out already-acknowledged patterns
    const acknowledged = loadAcknowledged();
    const allGroups    = groupEvents(events);
    const newGroups    = allGroups.filter(g => !acknowledged.has(g.pattern));

    if (newGroups.length === 0) {
        console.log(`All ${allGroups.length} pattern(s) already acknowledged. Nothing to do.`);
        process.exit(0);
    }

    printSummary(newGroups, events.length, files.length);
    await interactive(newGroups, acknowledged);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
