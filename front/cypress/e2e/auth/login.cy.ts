export default function loginSpec() {
  describe('Login spec', () => {
    beforeEach(() => {
      cy.initIntercepts();
    });

    it('should log successfully', () => {
      cy.login('yoga@studio.com', 'test!1234');
      cy.url().should('include', '/sessions');
    });

    it('should display an error if login failed', () => {
      cy.intercept('POST', '/api/auth/login', { statusCode: 401 });

      cy.login('wrongemail@studio.com', 'wrongpassword!1234');
      cy.contains('An error occurred');
    });
  });
}
