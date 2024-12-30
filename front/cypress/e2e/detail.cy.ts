describe('Detail spec', () => {
  beforeEach(() => {
    cy.initIntercepts();
  });

  it('should display infos successfully', () => {
    cy.login('yoga@studio.com', 'test!1234');
    cy.contains('Account').click();
    cy.url().should('include', '/me');
  });
});
