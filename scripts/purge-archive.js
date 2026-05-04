#!/usr/bin/env node
'use strict';

/**
 * purge-archive.js
 *
 * Deletes all archived log files — both locally (logs/archive/) and in S3
 * (s3://<bucket>/logs/archive/). Prompts for confirmation before deleting.
 *
 * Usage:
 *   node scripts/purge-archive.js           # purge local + S3
 *   node scripts/purge-archive.js --local   # purge local only
 *   node scripts/purge-archive.js --s3      # purge S3 only
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ARCHIVE_DIR  = path.join(PROJECT_ROOT, 'logs', 'archive');
const LOCAL_ONLY   = process.argv.includes('--local');
const S3_ONLY      = process.argv.includes('--s3');

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

function countLocalFiles(dir) {
    if (!fs.existsSync(dir)) return 0;
    let count = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) count += countLocalFiles(full);
        else count++;
    }
    return count;
}

function deleteLocalArchive(dir) {
    if (!fs.existsSync(dir)) return 0;
    let deleted = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            deleted += deleteLocalArchive(full);
            try { fs.rmdirSync(full); } catch { /* not empty, leave it */ }
        } else {
            fs.unlinkSync(full);
            deleted++;
        }
    }
    return deleted;
}

async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = q => new Promise(resolve => rl.question(q, resolve));

    const doLocal = !S3_ONLY;
    const doS3    = !LOCAL_ONLY;

    const bucket = doS3 ? getLogBucket() : null;
    if (doS3 && !bucket) {
        console.error('LOG_BUCKET is not set — cannot purge S3. Use --local to skip S3.');
        rl.close();
        process.exit(1);
    }

    // Summary of what will be deleted
    if (doLocal) {
        const n = countLocalFiles(ARCHIVE_DIR);
        console.log(`Local:  ${ARCHIVE_DIR}  (${n} file${n !== 1 ? 's' : ''})`);
    }
    if (doS3) {
        console.log(`S3:     s3://${bucket}/logs/archive/  (all objects)`);
    }

    const answer = await ask('\nDelete all of the above? [y/N] ');
    if (answer.trim().toLowerCase() !== 'y') {
        console.log('Aborted.');
        rl.close();
        return;
    }

    if (doLocal) {
        const deleted = deleteLocalArchive(ARCHIVE_DIR);
        console.log(`Deleted ${deleted} local file(s) from ./logs/archive/`);
    }

    if (doS3) {
        console.log(`Removing s3://${bucket}/logs/archive/ ...`);
        try {
            execSync(`aws s3 rm "s3://${bucket}/logs/archive/" --recursive`, { stdio: 'inherit' });
            console.log('S3 archive purged.');
        } catch (err) {
            console.error(`S3 purge failed: ${err.message}`);
        }
    }

    rl.close();
}

main();
