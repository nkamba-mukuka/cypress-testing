# Cypress Testing (TransportHub Auth)

This repo contains end-to-end (E2E) tests written with Cypress.

## Requirements

- Node.js installed
- Dependencies installed:

```bash
npm install
```

## How to run the tests

Always run Cypress **from the project root** (`cypress-testing/`), not from inside `cypress/e2e`.

### Open Cypress UI (interactive)

```bash
cd "/Users/mukukahnkambagmail.com/cypress-testing"
npx cypress open
```

### Run tests headlessly (CI style)

Run all specs:

```bash
cd "/Users/mukukahnkambagmail.com/cypress-testing"
npx cypress run
```

Run only the auth spec:

```bash
cd "/Users/mukukahnkambagmail.com/cypress-testing"
npx cypress run --spec "cypress/e2e/auth.cy.js"
```

## What’s covered

The main scenarios are in `cypress/e2e/auth.cy.js`.

### Registration scenarios

- **Best case**: registers successfully with valid user data.
- **Worst cases**:
  - invalid email format (expects validation + no redirect)
  - password confirmation mismatch (expects validation + no redirect)
  - duplicate email registration (expects “email already exists/taken” style error)

### Login scenarios

- **Best case**: logs in successfully with valid credentials.
- **Worst cases**:
  - wrong password (expects “invalid credentials” style error)
  - missing fields (expects validation errors)

## How the files are linked

- `cypress/support/e2e.js` is automatically loaded by Cypress before every spec.
- `cypress/support/e2e.js` imports `cypress/support/commands.js`.
- `cypress/support/commands.js` defines reusable custom commands like:
  - `cy.register(...)`
  - `cy.login(...)`
  - `cy.logoutIfLoggedIn()`

Those commands are then used inside your spec file `cypress/e2e/auth.cy.js`.

## Notes / common issues

- **“Support file missing” error**: usually means Cypress is being run from the wrong directory. Use the commands above (from the repo root).
- **Chrome/Browser closed unexpectedly**: if you close the terminal while Cypress is still running, Cypress will abort the run. Close the Cypress window first, then stop the terminal process.

