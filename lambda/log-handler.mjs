import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});
const BUCKET = process.env.LOG_BUCKET;
const MAX_PAYLOAD_BYTES = 1024;   // 1KB — unrecognized lines are short
const MAX_LINE_LENGTH = 500;
const ALLOWED_CONTEXTS = new Set(['kingdom-news', 'province-logs', 'province-news']);

// Always return 200 — never leak whether logging succeeded or failed.
// This prevents an attacker from probing for information via error responses.
const OK = { statusCode: 200, body: '' };

export const handler = async (event) => {
    try {
        const rawBody = event.body ?? '';

        // Reject oversized payloads before parsing
        if (Buffer.byteLength(rawBody, 'utf8') > MAX_PAYLOAD_BYTES) {
            return OK;
        }

        let parsed;
        try {
            parsed = JSON.parse(rawBody);
        } catch {
            return OK;
        }

        // Validate and sanitize — only known fields, all strings, bounded lengths
        const line = typeof parsed.line === 'string'
            ? parsed.line.trim().substring(0, MAX_LINE_LENGTH)
            : null;
        const context = typeof parsed.context === 'string' && ALLOWED_CONTEXTS.has(parsed.context)
            ? parsed.context
            : 'unknown';

        // Skip empty or whitespace-only lines
        if (!line) return OK;

        const ts = new Date().toISOString();
        const date = ts.substring(0, 10); // YYYY-MM-DD

        const entry = JSON.stringify({ ts, context, line }) + '\n';

        // One small object per event — no read-modify-write, no race conditions
        const rand = Math.random().toString(36).substring(2, 8);
        const key = `logs/${date}/${Date.now()}-${rand}.jsonl`;

        await s3.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: entry,
            ContentType: 'application/x-ndjson',
            ServerSideEncryption: 'AES256',
        }));

    } catch {
        // Do NOT log the error details — they might echo back user input.
    }

    return OK;
};
