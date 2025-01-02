describe('List spec', () => {
  beforeEach(() => {
    cy.initIntercepts();
  });

  // No sessions in database
  describe('no sessions', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/session', []);
      cy.login('yoga@studio.com', 'test!1234');
    });

    it('should display title and create button only', () => {
      cy.url().should('include', '/sessions');
      cy.contains('Rentals available').should('be.visible');
      cy.contains('button', 'Create').should('be.visible');
      cy.get('.item').should('have.length', 0);
    });
  });

  // User is an admin
  describe('user admin', () => {
    beforeEach(() => {
      cy.login('yoga@studio.com', 'test!1234');
      cy.wait('@sessions');
    });

    it('should display title, create, edit, and detail buttons', () => {
      cy.url().should('include', '/sessions');

      // General elements
      cy.contains('Rentals available').should('be.visible');
      cy.contains('button', 'Create').should('be.visible');

      // Session items
      cy.get('.item').should('have.length', 2);

      // Session name
      cy.contains('.item', 'Yoga Doux Matinal').should('exist');
      cy.contains('.item', 'Yoga Dynamique').should('exist');

      // Session description
      cy.contains(
        '.item',
        'Une session relaxante pour bien commencer la journée.'
      ).should('exist');
      cy.contains(
        '.item',
        'Une session énergisante pour booster votre énergie.'
      ).should('exist');

      // Session date
      cy.contains('.item', 'Session on January 10, 2024').should('exist');
      cy.contains('.item', 'Session on January 11, 2024').should('exist');

      // Session detail and edit buttons
      cy.get('.item button')
        .filter((index, button) => {
          return button.textContent.trim().includes('Detail');
        })
        .should('have.length', 2);

      cy.get('.item button')
        .filter((index, button) => {
          return button.textContent.trim().includes('Edit');
        })
        .should('have.length', 2);
    });
  });

  // User is NOT an admin
  describe('user non-admin', () => {
    beforeEach(() => {
      cy.login('jean.dupont@yoga.com', 'notAdminPassword123!');
      cy.wait('@sessions');
    });

    it('should display title and detail buttons only', () => {
      cy.url().should('include', '/sessions');

      // General elements
      cy.contains('Rentals available').should('be.visible');
      cy.contains('button', 'Create').should('not.exist');

      // Items
      cy.get('.item').should('have.length', 2);

      // Session name
      cy.contains('.item', 'Yoga Doux Matinal').should('exist');
      cy.contains('.item', 'Yoga Dynamique').should('exist');

      // Session description
      cy.contains(
        '.item',
        'Une session relaxante pour bien commencer la journée.'
      ).should('exist');
      cy.contains(
        '.item',
        'Une session énergisante pour booster votre énergie.'
      ).should('exist');

      // Session date
      cy.contains('.item', 'Session on January 10, 2024').should('exist');
      cy.contains('.item', 'Session on January 11, 2024').should('exist');

      // Session detail and edit buttons
      cy.get('.item button')
        .filter((index, button) => {
          return button.textContent.trim().includes('Detail');
        })
        .should('have.length', 2);

      cy.get('.item button')
        .filter((index, button) => {
          return button.textContent.trim().includes('Edit');
        })
        .should('have.length', 0);
    });
  });
});
