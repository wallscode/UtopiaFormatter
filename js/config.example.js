// Copy this file to js/config.js and fill in your values.
// config.js is gitignored and must NEVER be committed — it contains
// account-specific infrastructure endpoints.
//
// In CI/CD, config.js is generated from GitHub Secrets before deployment.
window.APP_CONFIG = {
  // API Gateway endpoint for logging unrecognized parser lines.
  // Leave as null to disable logging (safe default for local development).
  logEndpoint: null
  // Production value looks like:
  // logEndpoint: 'https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/log'
};
