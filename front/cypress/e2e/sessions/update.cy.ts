describe('Update session (form spec)', () => {
  beforeEach(() => {
    cy.initIntercepts();
    cy.intercept('PUT', '/api/session/1', {
      id: 1,
      name: 'Yoga Revigorant',
      description: 'Une session relaxante pour bien commencer la journée.',
      date: '2024-01-15T07:30:00Z',
      teacher_id: 2,
      users: [2],
      createdAt: '2024-01-05T14:00:00Z',
      updatedAt: '2024-01-02T14:00:00Z',
    });

    cy.login('yoga@studio.com', 'test!1234');
    cy.wait('@sessions');

    cy.contains('button', 'Edit').click();
    cy.wait('@getSession');
  });

  it('should go back on sessions if back button clicked', () => {
    cy.contains('button', 'arrow_back').click();
    cy.url().should('include', '/sessions');
  });

  it('should display first session infos', () => {
    cy.contains('Update session');
    cy.get('input[formControlName="name"]').should(
      'have.value',
      'Yoga Doux Matinal'
    );

    cy.get('input[formControlName="date"]').should('have.value', '2024-01-10');

    cy.get('mat-select[formControlName="teacher_id"]').should(
      'contain',
      'Margot DELAHAYE'
    );

    cy.get('textarea[formControlName="description"]').should(
      'have.value',
      'Une session relaxante pour bien commencer la journée.'
    );
  });

  it('should allow updates and submit the form', () => {
    cy.get('input[formControlName="name"]').clear().type('Yoga Revigorant');

    cy.get('input[formControlName="date"]').clear().type('2024-01-15');

    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Hélène THIERCELIN').click();

    cy.get('textarea[formControlName="description"]')
      .clear()
      .type(
        'Une session énergisante pour démarrer votre journée avec vitalité.'
      );

    cy.get('button[type="submit"]').click();

    cy.get('snack-bar-container')
      .should('exist')
      .and('contain.text', 'Session updated !');
    cy.url().should('include', '/sessions');
  });
});
