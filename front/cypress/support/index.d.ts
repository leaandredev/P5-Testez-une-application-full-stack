/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login
     * @example cy.login('email@example.com', 'password123')
     */
    login(
      email: string,
      password: string,
      createInterceptSessionInformation?: boolean
    ): Chainable<void>;
    register(
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ): Chainable<void>;
    initIntercepts(): Chainable<void>;
    interceptWithFixture(
      method: string,
      url: string,
      fixturePath: string
    ): Chainable<void>;
  }
}
