---
id: Uto-9wce
status: closed
deps: [Uto-2c3d]
links: []
created: 2026-02-27T01:59:24Z
type: task
priority: 3
tags: [logging, aws, infrastructure, security]
---
# Implement unrecognized-line logging: HTTP API Gateway + Lambda + S3

Implement the logging infrastructure recommended in Uto-2c3d. Browser JS sends unrecognized parser lines to an HTTP API Gateway endpoint backed by a Lambda function that writes JSONL entries to a private S3 bucket. Zero user impact (fire-and-forget fetch). Full security hardening required.

**Estimated monthly cost (no free tier):** ~$0.001 — effectively $0.00.

### Verified cost breakdown (450 events/month, ~225KB total)

| Component | Rate | Monthly cost |
|---|---|---|
| API Gateway HTTP API | $1.00 / million requests | $0.00045 |
| Lambda (128MB, 100ms, 1ms billing granularity) | $0.20/M invocations + $0.0000167/GB-sec | $0.000184 |
| S3 PUT requests | $0.005 / 1,000 | $0.0000023 |
| S3 storage | $0.023/GB/month | negligible |
| **Total** | | **~$0.001/month** |

**Note:** HTTP API Gateway ($1.00/M) was chosen over REST API ($3.50/M). CloudWatch Logs ingestion ($0.50/GB) was avoided by writing directly to S3 — at scale this matters.

### Cost at scale (no free tier)

| Traffic | Events/month | Monthly cost |
|---|---|---|
| Current (1–2 users/day) | ~450 | ~$0.001 |
| 10x (10–20 users/day) | ~4,500 | ~$0.01 |
| 100x (100–200 users/day) | ~45,000 | ~$0.10 |

The solution scales gracefully — even 100x traffic stays within the original <$0.10/month budget constraint.

## Architecture

```
Browser JS
  └── fetch(POST /log, keepalive:true)   ← fire-and-forget, errors silently swallowed
        └── API Gateway HTTP API          ← HTTPS only, CORS origin-locked, throttled
              └── Lambda (Node.js 128MB)  ← validates/sanitizes input, IAM least-privilege
                    └── S3 PUT            ← private bucket, one object per event
```

Each log event is written as a single-line JSON object (JSONL) with a timestamp-prefixed key:
`logs/YYYY-MM-DD/<timestamp>-<random>.jsonl`

## Infrastructure Components

### 1. S3 Bucket

- **Name:** use a non-guessable name (e.g. `utopia-parser-logs-<random-suffix>`) — never a predictable name
- **Region:** same region as Lambda (e.g. us-east-1)
- **Block All Public Access:** ALL four options enabled
- **Bucket policy:** only the Lambda execution role may `s3:PutObject` on `logs/*` — deny everything else (see IAM section)
- **Server-side encryption:** SSE-S3 (AES-256, free, automatic)
- **Versioning:** disabled
- **Static website hosting:** disabled
- **Event notifications:** disabled
- **Lifecycle rule:** expire all objects under `logs/` after 180 days (keeps costs near-zero, logs older than 6 months have no value)
- **Access logging:** disabled (no need to log the log bucket)

### 2. Lambda Function

- **Runtime:** Node.js 22.x
- **Memory:** 128 MB
- **Timeout:** 5 seconds
- **Environment variable:** `LOG_BUCKET` = bucket name
- **No layers, no VPC** (adds complexity with no benefit at this scale)
- **Reserved concurrency:** set to 10 (prevents runaway invocations from abuse)

#### Function code (`lambda/log-handler.mjs`):

```javascript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});
const BUCKET = process.env.LOG_BUCKET;
const MAX_PAYLOAD_BYTES = 1024;   // 1KB — unrecognized lines are short
const MAX_LINE_LENGTH = 500;
const MAX_CONTEXT_LENGTH = 50;
const ALLOWED_CONTEXTS = new Set(['kingdom-news', 'province-logs']);

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
    // A metric increment here would be appropriate if monitoring is added later.
  }

  return OK;
};
```

### 3. API Gateway (HTTP API)

- **Type:** HTTP API (not REST API — half the price, simpler)
- **Route:** `POST /log`
- **Integration:** Lambda proxy
- **CORS configuration:**
  - `AllowOrigins`: `https://your-production-domain.com` only — never `*`
  - `AllowMethods`: `POST`
  - `AllowHeaders`: `Content-Type`
  - `MaxAge`: 300 (5-minute preflight cache)
- **Throttling (default route settings):**
  - Burst limit: 50 requests
  - Rate limit: 10 requests/second
  - These limits are far above legitimate usage (max ~2 requests/minute) and cap abuse cost to ~$0.01/hour even under sustained attack
- **Payload size limit:** API Gateway HTTP API default is 10MB; Lambda rejects anything over 1KB before processing
- **Stage:** single `$default` stage with auto-deploy
- **Access logging:** disabled (saves $0.50/GB CloudWatch ingestion cost; Lambda logs already disabled for content)
- **HTTPS only:** enforced by API Gateway (no HTTP option exists for HTTP APIs)

### 4. Lambda Execution Role (IAM)

This role must be the **minimum possible**. The only thing this Lambda needs to do is write one type of object to one bucket prefix.

#### Trust policy (Lambda service only):
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "lambda.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
```

#### Permission policy (inline, no managed policies):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "WriteLogsOnly",
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/logs/*"
    },
    {
      "Sid": "BasicLambdaExecution",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:log-group:/aws/lambda/utopia-log-handler:*"
    }
  ]
}
```

**Do NOT attach `AWSLambdaBasicExecutionRole` (managed policy)** — it grants `logs:*` on `*` which is broader than needed. Use only the inline policy above.

**Do NOT grant:**
- `s3:GetObject` — Lambda has no need to read back logs
- `s3:DeleteObject` — Lambda has no need to delete
- `s3:ListBucket` — Lambda has no need to enumerate the bucket
- Any other AWS service permissions

#### S3 Bucket Policy (defense-in-depth):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowLambdaPutOnly",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR-ACCOUNT-ID:role/utopia-log-lambda-role"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/logs/*"
    },
    {
      "Sid": "DenyEverythingElse",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ],
      "Condition": {
        "ArnNotEquals": {
          "aws:PrincipalArn": [
            "arn:aws:iam::YOUR-ACCOUNT-ID:role/utopia-log-lambda-role",
            "arn:aws:iam::YOUR-ACCOUNT-ID:root"
          ]
        }
      }
    }
  ]
}
```

The `DenyEverythingElse` statement means even if an IAM misconfiguration elsewhere granted access to this bucket, the bucket policy overrides it. The root account is excluded so you can always recover access.

## Security Analysis: Worst-Case Attack Scenarios

| Attack | What Happens | Why It's Acceptable |
|---|---|---|
| Spam endpoint with garbage | Lambda validates, writes garbage JSONL to S3 | API GW throttle caps at 10 req/sec; sustained 24hr attack costs <$5 in Lambda+S3 |
| Large payload | Lambda rejects anything >1KB before processing | No compute wasted, no S3 write |
| CORS bypass (curl/Postman) | CORS headers are advisory for browsers only; direct requests still reach the endpoint | Attacker can only write to `logs/*` in one S3 bucket — this is the intended worst case |
| Malicious content in log line | Lambda sanitizes (truncate, JSON-escape, no eval); content is stored as an inert string | No code execution path from log content |
| Enumerate log bucket | Attacker doesn't know the bucket name; Lambda role has no ListBucket; bucket has Block Public Access | Nothing to find even if bucket name leaked |
| Read other users' logs | Lambda role has no GetObject; bucket policy denies all reads | Logs are write-only for the Lambda |
| Privilege escalation via Lambda | Lambda role has no IAM permissions, no sts:*, no ec2:*, no other services | No path to escalate |
| Compromise Lambda environment | Lambda has only LOG_BUCKET env var; no credentials, no secrets | Env var only reveals bucket name — same as worst case above |
| Modify or delete logs | Lambda role has no DeleteObject or PutBucketPolicy | Bucket policy also explicitly denies these |

**What an attacker can accomplish at most:** write inert text strings to `logs/` in a private S3 bucket that only you can read. This is the intended capability — no AWS account compromise is possible.

## Browser JS Integration

The endpoint URL is read from `window.APP_CONFIG.logEndpoint`, which is set by the gitignored `js/config.js` (see the config file pattern already implemented in the repo — `js/config.example.js` documents the structure). When `config.js` is absent (local dev after a fresh clone) or `logEndpoint` is `null`, logging is silently skipped.

Add to `js/parser.js` (or wherever unrecognized lines are detected):

```javascript
function logUnrecognizedLine(line, context) {
  const endpoint = window.APP_CONFIG?.logEndpoint;
  if (!endpoint) return; // logging disabled — no config.js or logEndpoint is null

  // keepalive: true ensures the request completes even if the page navigates away
  // No await — completely fire-and-forget, never blocks parsing
  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      line: line.substring(0, 500),
      context: context  // 'kingdom-news' or 'province-logs'
    }),
    keepalive: true
  }).catch(() => {}); // silently swallow all errors — never surface to user
}
```

In CI/CD (GitHub Actions), `js/config.js` is generated from the `LOG_ENDPOINT` GitHub Secret before uploading to S3:
```yaml
- name: Write config
  run: echo "window.APP_CONFIG = { logEndpoint: '${{ secrets.LOG_ENDPOINT }}' };" > js/config.js
```

Call `logUnrecognizedLine(line, context)` at each fall-through / unrecognized-line point in the parsers. The exact integration points in `parser.js` are a sub-task of implementation.

**Security note on the endpoint URL in source:** the API Gateway URL being visible in the deployed JS is acceptable. All it grants an attacker is the ability to write to the log bucket — which is the intended worst case (see table above). Do not attempt to hide it via obfuscation; that provides no real security and adds complexity.

## Log Analysis Workflow

```bash
# Sync all logs from S3 (fast — files are tiny)
aws s3 sync s3://YOUR-BUCKET-NAME/logs/ ./logs/

# See all unrecognized lines, sorted by frequency
cat logs/**/*.jsonl | jq -r '.line' | sort | uniq -c | sort -rn

# Filter by parser context
cat logs/**/*.jsonl | jq -r 'select(.context=="province-logs") | .line' | sort | uniq -c | sort -rn

# Last 7 days only
find ./logs -mtime -7 -name '*.jsonl' | xargs cat | jq -r '.line' | sort | uniq -c | sort -rn
```

## Deployment Steps

1. Create S3 bucket with settings above (Block All Public Access, SSE-S3, lifecycle rule)
2. Create IAM role `utopia-log-lambda-role` with the inline policy above (NOT the managed policy)
3. Apply S3 bucket policy (copy template above, substitute account ID and bucket name)
4. Deploy Lambda function with `LOG_BUCKET` env var, set reserved concurrency to 10
5. Create HTTP API Gateway, add `POST /log` route → Lambda integration
6. Configure CORS on API Gateway with production domain only
7. Set throttling: burst 50, rate 10/sec
8. Add `LOG_ENDPOINT` constant to `parser.js` with the deployed API URL
9. Add `logUnrecognizedLine()` calls at unrecognized-line fall-throughs in both parsers
10. Set up a CloudWatch billing alarm at $1/month for the account — early warning if throttling is ever bypassed

## Acceptance Criteria

- [ ] S3 bucket has Block All Public Access fully enabled; `aws s3api get-public-access-block` confirms all four flags are `true`
- [ ] `aws iam simulate-principal-policy` confirms Lambda role cannot `s3:GetObject`, `s3:DeleteObject`, `s3:ListBucket`, or any non-log-group CloudWatch action
- [ ] Bucket policy denies all S3 actions from any principal other than the Lambda role and root account
- [ ] API Gateway CORS rejects preflight requests from non-production origins
- [ ] API Gateway throttling is set (verify in console: Routes → $default stage settings)
- [ ] Lambda reserved concurrency is set to 10
- [ ] Log entries appear in S3 within 5 seconds of a parsing session that contains unrecognized lines
- [ ] Parsing sessions with no unrecognized lines produce no log calls (don't log recognized lines)
- [ ] A parsing session with unrecognized lines produces no visible errors, slowdowns, or UI changes for the user
- [ ] `aws s3 sync` + `jq` workflow successfully retrieves and groups unrecognized lines
- [ ] Lambda function code passes a manual review confirming: no eval, no dynamic key access on `parsed`, all string fields bounded, always returns 200
