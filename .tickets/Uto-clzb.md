---
id: Uto-clzb
status: closed
deps: []
links: []
created: 2026-02-27T19:13:06Z
type: task
priority: 1
tags: [infrastructure, dns, ssl, cloudfront]
---
# DNS: delegate domain from Network Solutions to Route 53 to fix SSL mismatch

## Problem

Network Solutions is performing a web redirect (HTTP 301/302) from the custom domain to the CloudFront distribution URL. Browsers follow this redirect and connect to the CloudFront domain, whose SSL certificate does not cover the custom domain — causing a cert mismatch error. The underlying issue is that Network Solutions nameservers are still authoritative for the domain, so their redirect fires before Route 53 has any effect.

## Solution

Delegate DNS authority to Route 53 by updating the nameserver (NS) records at Network Solutions to point to the Route 53 hosted zone. Once Route 53 is authoritative, its alias A/AAAA records resolve the custom domain directly to CloudFront — no redirect, no SSL mismatch.

## Prerequisites (verify before starting)

1. Route 53 hosted zone exists for the domain — confirmed
2. ACM certificate covers the custom domain (and www. variant) and is issued in us-east-1 — verify
3. CloudFront distribution lists the custom domain as an Alternate Domain Name (CNAME) — verify
4. CloudFront distribution has the ACM cert attached — verify
5. Route 53 has an A alias record for the apex domain pointing to the CloudFront distribution — verify
6. Route 53 has an A alias record for www pointing to the CloudFront distribution (or a CNAME to apex) — verify

## Steps

### Step 1 — Get Route 53 nameservers for the hosted zone
In the AWS Console → Route 53 → Hosted zones → select the domain → note the four NS record values.
They look like:
  ns-123.awsdns-45.com.
  ns-678.awsdns-90.net.
  ns-111.awsdns-22.org.
  ns-999.awsdns-00.co.uk.

### Step 2 — Remove the web redirect at Network Solutions
Log in to Network Solutions → My Account → Domain Names → select domain →
under 'Web Forwarding' or 'Redirect', remove or disable any active redirect rules.

### Step 3 — Update nameservers at Network Solutions
Still in Network Solutions domain management → Nameservers → change from Network Solutions
default nameservers to custom nameservers and enter the four Route 53 NS values from Step 1.
Save. DNS propagation takes up to 48 hours but is usually complete within 1–4 hours.

### Step 4 — Verify propagation
Once propagated:
- dig yourdomain.com NS   →  should return the four Route 53 nameservers
- curl -I https://yourdomain.com  →  should return 200 with no redirect, cert issued for yourdomain.com
- Test in a browser — no SSL warning, no redirect to CloudFront URL

## Acceptance Criteria

- [ ] ACM cert in us-east-1 covers apex domain and www subdomain
- [ ] CloudFront has the custom domain as an alternate domain name with the ACM cert attached
- [ ] Route 53 has A alias records for apex and www pointing to CloudFront
- [ ] Network Solutions web redirect is removed
- [ ] Network Solutions nameservers updated to Route 53 NS values
- [ ] dig confirms Route 53 NS records are authoritative
- [ ] https://yourdomain.com loads without SSL error or visible redirect
- [ ] https://www.yourdomain.com loads correctly

