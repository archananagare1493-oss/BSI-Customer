# BSI-Customer

This repository contains Playwright tests for the BSI Customer project.

Quick setup and test

1. Install dependencies and Playwright browsers (single command):

```bash
npm ci
```

The `postinstall` script runs `npx playwright install --with-deps` automatically, so browsers are installed after `npm ci`/`npm install`.

2. (Optional) If you prefer to run the browser install explicitly:

```bash
npm run setup
```

3. Run the test suite:

```bash
npm test
```

Useful scripts

- `npm ci` — install dependencies and browsers (via `postinstall`).
- `npm run setup` — explicitly install Playwright browsers.
- `npm test` — run full test suite.
- `npm run test:headed` — run tests with headed browsers.
- `npm run test:debug` — run tests in debug mode.
- `npm run test:specific` — run a specific spec file defined in `package.json`.

Notes

- Recommended Node.js version: 16+ (Node 18+ preferred).
- If you run into permission issues on Windows, re-run the commands as an elevated shell.
- Playwright reports and test artifacts such as `playwright-report/` and `test-results/` are generated locally during test runs and should not be committed.

Jira integration

Set these environment variables to enable automatic Jira issue creation when a test fails:

```env
JIRA_BASE_URL=https://your-company.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=ABC
JIRA_ASSIGNEE=your-jira-username
JIRA_LABELS=playwright,automated-test
```

If any of the required variables are missing, the integration is skipped and your tests continue normally.

See the Playwright configuration in `playwright.config.ts` for timeouts, projects, and reporters.
