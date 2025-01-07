export default function createSessionSpec() {
  describe('Create session (form spec)', () => {
    beforeEach(() => {
      cy.initIntercepts();
      cy.intercept('POST', '/api/session', {
        id: 3,
        name: 'Initiation Yoga Session',
        description: 'A relaxing yoga session to start the day.',
        date: '2025-01-15T18:00:00Z',
        teacher_id: 2,
        users: [1, 2],
        createdAt: '2024-01-02T14:00:00Z',
        updatedAt: '2024-01-02T14:00:00Z',
      });

      cy.login('yoga@studio.com', 'test!1234');
      cy.wait('@sessions');
      cy.contains('button', 'Create').click();
    });

    it('should go back on sessions if back button clicked', () => {
      cy.contains('button', 'arrow_back').click();
      cy.url().should('include', '/sessions');
    });

    it('should create a new session', () => {
      cy.contains('Create session');
      cy.get('input[formControlName="name"]').type('Initiation Yoga Session');
      cy.get('input[formControlName="date"]').type('2025-01-15');

      cy.get('mat-select[formControlName="teacher_id"]').click(); // Ouvre la liste
      cy.get('mat-option').contains('Hélène THIERCELIN').click(); // Clique sur une option spécifique

      cy.get('textarea[formControlName="description"]').type(
        'A relaxing yoga session to start the day.'
      );
      cy.get('button[type="submit"]').click();

      cy.get('snack-bar-container')
        .should('exist')
        .and('contain.text', 'Session created !');

      cy.url().should('contain', '/sessions');
    });
  });
}
