// ***********************************************
// Custom commands live here.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

const REGISTER_URL = 'https://transporthub.kamstar.tech/register'
const LOGIN_URL = 'https://transporthub.kamstar.tech/login'

function fillRegistrationForm({ name, email, password, passwordConfirmation }) {
  cy.get('#name').clear().type(name)
  cy.get('#email').clear().type(email)
  cy.get('#password').clear().type(password)
  cy.get('#password_confirmation')
    .clear()
    .type(passwordConfirmation ?? password)
}

function fillLoginForm({ email, password }) {
  cy.get('#email').clear().type(email)
  cy.get('#password').clear().type(password)
}

Cypress.Commands.add('visitRegister', () => {
  cy.visit(REGISTER_URL)
})

Cypress.Commands.add('visitLogin', () => {
  cy.visit(LOGIN_URL)
})

Cypress.Commands.add('register', ({ name, email, password, passwordConfirmation }) => {
  cy.visitRegister()
  fillRegistrationForm({ name, email, password, passwordConfirmation })
  cy.contains(/create account/i).should('be.visible').click()
})

Cypress.Commands.add('login', ({ email, password }) => {
  cy.visitLogin()
  fillLoginForm({ email, password })
  cy.contains('button', /log in/i).should('be.visible').click()
})

// Safe logout that won't fail if not logged in
Cypress.Commands.add('logoutIfLoggedIn', () => {
  cy.get('body').then(($body) => {
    const trigger = $body.find('button[data-slot="dropdown-menu-trigger"]')
    if (!trigger.length) return

    cy.wrap(trigger).click()
    cy.contains('button[data-slot="dropdown-menu-item"]', /log out/i).click()
  })
})

