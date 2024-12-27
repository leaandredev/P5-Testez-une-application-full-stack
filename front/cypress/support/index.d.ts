/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login
     * @example cy.login('email@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>;
  }
}
