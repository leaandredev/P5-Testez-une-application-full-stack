describe('Register spec', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/register', {
      body: {
        message: 'User registered successfully!',
      },
    });
  });

  it('should registered then logged in successfully', () => {
    cy.visit('/register');
    cy.get('input[formControlName=firstName]').type('newFirstName');
    cy.get('input[formControlName=lastName]').type('newLastName');
    cy.get('input[formControlName=email]').type('newemail@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'newpassword!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/login');
    cy.login('newemail@studio.com', 'newpassword!1234');
    cy.url().should('include', '/sessions');
  });

  it('should display error message if register failed', () => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
      body: {
        message: 'Error: Email is already taken!',
      },
    }).as('errorRequest');
    cy.get('input[formControlName=firstName]').type('newFirstName');
    cy.get('input[formControlName=lastName]').type('newLastName');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'newpassword!1234'}{enter}`
    );
    cy.contains('An error occurred');
  });
});
