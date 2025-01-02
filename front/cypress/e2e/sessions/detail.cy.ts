describe('Detail spec', () => {
  beforeEach(() => {
    cy.initIntercepts();
  });

  describe('session not found', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/session/*', {
        statusCode: 404,
      });
      cy.login('yoga@studio.com', 'test!1234');
      cy.wait('@sessions');
      cy.contains('button', 'Detail').click();
    });

    it('should not display the mat-card with session infos', () => {
      cy.url().should('include', '/sessions/detail');
      cy.get('mat-card').should('not.exist');
    });
  });

  describe('teacher not found', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/teacher/*', {
        statusCode: 404,
      });
      cy.login('yoga@studio.com', 'test!1234');
      cy.wait('@sessions');
      cy.contains('button', 'Detail').click();
    });

    it('should display the mat-card wothout teacher infos', () => {
      cy.url().should('include', '/sessions/detail');
      cy.get('mat-card').should('be.visible');
      cy.contains('Margot DELAHAYE').should('not.exist');
    });
  });

  // User is an admin
  describe('user admin', () => {
    beforeEach(() => {
      cy.login('yoga@studio.com', 'test!1234');
      cy.wait('@sessions');
      cy.contains('button', 'Detail').click();
      cy.wait('@getSession');
      cy.wait('@getTeacher');
    });

    it('should go to detail page', () => {
      cy.url().should('include', '/sessions/detail');
    });

    it('should display session and teacher infos, and delete button only', () => {
      cy.get('mat-card').should('be.visible');
      cy.contains('Yoga Doux Matinal').should('be.visible');
      cy.contains('button', 'Delete').should('be.visible');

      cy.contains('button', 'Participate').should('not.exist');
      cy.contains('button', 'Do not participate').should('not.exist');

      cy.contains('Margot DELAHAYE').should('be.visible');
      cy.contains('1 attendees').should('be.visible');
      cy.contains('January 10, 2024').should('be.visible');
      cy.contains(
        'Une session relaxante pour bien commencer la journée.'
      ).should('be.visible');
      cy.get('div.created')
        .contains('Create at: January 5, 2024')
        .should('be.visible');
      cy.get('div.updated')
        .contains('Last update: January 5, 2024')
        .should('be.visible');
    });

    it('should go back on sessions if back button clicked', () => {
      cy.contains('button', 'arrow_back').click();
      cy.url().should('include', '/sessions');
    });

    it('should delete session when delete button clicked', () => {
      cy.contains('button', 'Delete').click();
      cy.get('snack-bar-container')
        .should('exist')
        .and('contain.text', 'Session deleted !');
      cy.url().should('include', '/sessions');
    });
  });

  // User is NOT an admin
  describe('user non-admin', () => {
    beforeEach(() => {
      cy.login('jean.dupont@yoga.com', 'notAdminPassword123!');
      cy.wait('@sessions');
      cy.contains('button', 'Detail').click();
      cy.wait('@getSession');
      cy.wait('@getTeacher');
    });

    it('should not display delete buttons', () => {
      cy.contains('button', 'Delete').should('not.exist');
      cy.contains('button', 'Participate').should('not.exist');
      cy.contains('button', 'Do not participate').should('be.visible');
    });

    it('should go back on sessions if back button clicked', () => {
      cy.contains('button', 'arrow_back').click();
      cy.url().should('include', '/sessions');
    });

    it('should switch participate button when participate buttons clicked', () => {
      cy.intercept('GET', '/api/session/1', {
        id: 1,
        name: 'Yoga Doux Matinal',
        description: 'Une session relaxante pour bien commencer la journée.',
        date: '2024-01-10T07:30:00Z',
        teacher_id: 1,
        users: [],
        createdAt: '2024-01-05T14:00:00Z',
        updatedAt: '2024-01-05T14:00:00Z',
      });
      cy.contains('button', 'Do not participate').click();

      cy.contains('button', 'Participate').should('be.visible');
      cy.contains('button', 'Do not participate').should('not.exist');
      cy.contains('0 attendees').should('be.visible');

      cy.intercept('GET', '/api/session/1', {
        id: 1,
        name: 'Yoga Doux Matinal',
        description: 'Une session relaxante pour bien commencer la journée.',
        date: '2024-01-10T07:30:00Z',
        teacher_id: 1,
        users: [2],
        createdAt: '2024-01-05T14:00:00Z',
        updatedAt: '2024-01-05T14:00:00Z',
      });
      cy.contains('button', 'Participate').click();

      cy.contains('button', 'Participate').should('not.exist');
      cy.contains('button', 'Do not participate').should('be.visible');
      cy.contains('1 attendees').should('be.visible');
    });
  });
});
