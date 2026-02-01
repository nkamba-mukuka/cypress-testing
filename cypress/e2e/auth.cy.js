describe('TransportHub - Registration', () => {
  // Use a valid password that should pass your app's rules.
  const password = 'Test@12345'

  beforeEach(() => {
    // Keep tests isolated (no shared sessions between test cases).
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('best case: registers successfully with valid data', () => {
    // Generate a unique email each run to avoid "email already taken" failures.
    const email = `test${Date.now()}@gmail.com`

    // Uses the custom command from `cypress/support/commands.js`.
    cy.register({
      name: 'Test User',
      email,
      password,
    })

    // Success criteria: you should leave the register page (redirect to dashboard/home).
    cy.url().should('not.include', '/register')
  })

  it('worst case: rejects invalid email format', () => {
    // Worst-case test = invalid input. We expect: no redirect + validation error shown.
    cy.visitRegister()

    // Fill the form with an invalid email.
    cy.get('#name').type('Test User')
    cy.get('#email').type('invalid-email')
    cy.get('#password').type(password)
    cy.get('#password_confirmation').type(password)
    cy.contains(/create account/i).click()

    // Still on register page => server/client rejected the input.
    cy.url().should('include', '/register')
    // Validate that an error message is shown (regex keeps it flexible across wording).
    cy.contains(/email|required|valid/i).should('be.visible')
  })

  it('worst case: rejects password confirmation mismatch', () => {
    // Another invalid input case: password confirmation does not match.
    cy.visitRegister()

    cy.get('#name').type('Test User')
    cy.get('#email').type(`test${Date.now()}@gmail.com`)
    cy.get('#password').type(password)
    cy.get('#password_confirmation').type('Mismatch@12345')
    cy.contains(/create account/i).click()

    cy.url().should('include', '/register')
    cy.contains(/confirm|match/i).should('be.visible')
  })

  it('worst case: rejects duplicate email registration', () => {
    // Worst-case scenario: user tries to register with an email that already exists.
    const email = `dup${Date.now()}@gmail.com`

    // First registration should succeed.
    cy.register({ name: 'Test User', email, password })
    cy.url().should('not.include', '/register')
    cy.logoutIfLoggedIn()

    // Second registration using the same email should fail.
    cy.register({ name: 'Test User', email, password })
    cy.url().should('include', '/register')
    cy.contains(/email|already|taken|exists/i).should('be.visible')
  })
})

describe('TransportHub - Login', () => {
  // Create a dedicated user for login tests.
  // We register once (in `before`) then reuse the same credentials in each test.
  const user = {
    name: 'Test User',
    email: `login${Date.now()}@gmail.com`,
    password: 'Test@12345',
  }

  before(() => {
    // One-time setup: create an account that the login tests can use.
    cy.register(user)
    cy.url().should('not.include', '/register')
    // Ensure we start login tests from a logged-out state.
    cy.logoutIfLoggedIn()
  })

  beforeEach(() => {
    // Isolation again: each test starts with a clean session.
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('best case: logs in successfully with valid credentials', () => {
    // Happy path: correct email + correct password.
    cy.login({ email: user.email, password: user.password })
    // Success criteria: you should leave the login page.
    cy.url().should('not.include', '/login')
  })

  it('worst case: fails login with incorrect password', () => {
    // Invalid credentials: correct email, wrong password.
    cy.login({ email: user.email, password: 'Wrong@12345' })

    // Expected: stay on login page and show an "invalid credentials" style message.
    cy.url().should('include', '/login')
    cy.contains(/invalid|incorrect|credentials/i).should('be.visible')
  })

  it('worst case: shows validation when email/password missing', () => {
    // Missing input fields: attempt submit without typing anything.
    cy.visitLogin()
    cy.contains('button', /log in/i).should('be.visible').click()

    cy.url().should('include', '/login')
    cy.contains(/required|email|password/i).should('be.visible')
  })
})
