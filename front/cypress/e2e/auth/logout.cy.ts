describe('Logout spec', () => {
  beforeEach(() => {
    cy.initIntercepts();
  });

  it('should log out successfully', () => {
    cy.login('yoga@studio.com', 'test!1234');
    cy.contains('Logout').click();
    cy.url().should('include', '');
  });
});
