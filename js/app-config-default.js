// Default APP_CONFIG — overridden by js/config.js (gitignored, injected at deploy time).
// This file exists so index.html has no inline scripts, enabling a strict
// Content-Security-Policy with script-src 'self' and no 'unsafe-inline'.
window.APP_CONFIG = window.APP_CONFIG || { logEndpoint: null };
