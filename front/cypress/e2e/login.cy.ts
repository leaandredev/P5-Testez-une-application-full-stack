describe('Login spec', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });
  });

  it('Login successfull', () => {
    cy.login('yoga@studio.com', 'test!1234');
    cy.url().should('include', '/sessions');
  });

  it('should display an error if login failed', () => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials',
      },
    }).as('errorRequest');
    cy.get('input[formControlName=email]').type('wrongemail@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'wrongpassword!1234'}{enter}{enter}`
    );

    cy.contains('An error occurred');
  });
});
