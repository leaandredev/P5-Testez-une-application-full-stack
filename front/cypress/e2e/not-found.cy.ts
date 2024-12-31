describe('Not Found spec', () => {
  it('should display Page not found for wrong url', () => {
    cy.visit('/url-not-found');
    cy.contains('Page not found !');
  });
});
