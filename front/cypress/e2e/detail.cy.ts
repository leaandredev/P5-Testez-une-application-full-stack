describe('Detail spec', () => {
  beforeEach(() => {
    cy.initIntercepts();
    cy.login('yoga@studio.com', 'test!1234');
  });

  it('should display infos successfully', () => {
    cy.contains('Account').click();
    cy.url().should('include', '/me');
    cy.contains('Name: Admin ADMIN');
    cy.contains('Email: yoga@studio.com');
    cy.contains('You are admin');
  });

  it('should not display infos if no user found', () => {
    cy.intercept('GET', '/api/user/1', {
      statusCode: 404,
    });
    cy.contains('Account').click();
    cy.url().should('include', '/me');
    cy.get('mat-card-content').should('be.empty');
  });
});
