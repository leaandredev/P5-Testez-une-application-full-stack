export default function registerSpec() {
  describe('Register spec', () => {
    beforeEach(() => {
      cy.initIntercepts();
      // login response success
    });

    it('should registered then logged in successfully', () => {
      cy.register(
        'newFirstName',
        'newLastName',
        'newemail@studio.com',
        'newpassword!1234'
      );

      cy.url().should('include', '/login');
      cy.login('newemail@studio.com', 'newpassword!1234', true);
      cy.url().should('include', '/sessions');
    });

    it('should display error message if register failed', () => {
      cy.intercept('POST', '/api/auth/register', {
        statusCode: 400,
      });

      cy.register(
        'newFirstName',
        'newLastName',
        'yoga@studio.com',
        'newpassword!1234'
      );
      cy.contains('An error occurred');
    });
  });
}
