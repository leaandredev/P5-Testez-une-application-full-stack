export default function meSpec() {
  describe('Me spec', () => {
    beforeEach(() => {
      cy.initIntercepts();
    });

    describe('admin user', () => {
      beforeEach(() => {
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

      it('should go back on sessions if back button clicked', () => {
        cy.url().should('include', '/sessions');
        cy.contains('Account').click();
        cy.url().should('include', '/me');
        cy.get('button[mat-icon-button]').click();
        cy.url().should('include', '/sessions');
      });
    });

    describe('user non-admin', () => {
      beforeEach(() => {
        cy.login('jean.dupont@yoga.com', 'notAdminPassword123!');
      });

      it('should display infos and and delete button successfully', () => {
        cy.contains('Account').click();
        cy.url().should('include', '/me');
        cy.contains('Name: Jean DUPONT');
        cy.contains('Email: jean.dupont@yoga.com');
        cy.contains('button', 'Detail').should('exist');
      });

      it('should delete account when delete button clicked', () => {
        cy.contains('Account').click();
        cy.contains('button', 'Detail').click();
        cy.get('snack-bar-container')
          .should('exist')
          .and('contain.text', 'Your account has been deleted !');
        cy.url().should('include', '/');
      });
    });
  });
}
