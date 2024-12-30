// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('interceptWithFixture', (method, url, fixturePath) => {
  cy.fixture(fixturePath).then((data) => {
    cy.intercept(
      {
        method: method,
        url: url,
      },
      data
    ).as(fixturePath); // Utilise le chemin comme alias pour retrouver l'interception
  });
});

Cypress.Commands.add('initIntercepts', () => {
  //get all
  cy.interceptWithFixture('GET', '/api/session', 'sessions');
  cy.interceptWithFixture('GET', '/api/user', 'users');
  cy.interceptWithFixture('GET', '/api/teacher', 'teachers');

  // get user by id
  cy.fixture('users').then((users) => {
    cy.intercept('GET', '/api/user/*', (req) => {
      const userId = Number(req.url.split('/').pop());
      const user = users.find((u) => u.id === userId);
      req.reply(user ? user : { error: 'User not found' });
    }).as('getUser');
  });

  cy.fixture('sessions').then((sessions) => {
    cy.intercept('GET', '/api/session/*', (req) => {
      const sessionId = Number(req.url.split('/').pop());
      const session = sessions.find((s) => s.id === sessionId);
      req.reply(session ? session : { error: 'Session not found' });
    }).as('getSession');
  });

  cy.fixture('teachers').then((teachers) => {
    cy.intercept('GET', '/api/teacher/*', (req) => {
      const teacherId = Number(req.url.split('/').pop());
      const teacher = teachers.find((t) => t.id === teacherId);
      req.reply(teacher ? teacher : { error: 'Teacher not found' });
    }).as('getTeacher');
  });

  // login response success
  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: true,
    },
  }).as('login');

  // register response success
  cy.intercept('POST', '/api/auth/register', {
    body: {
      message: 'User registered successfully!',
    },
  }).as('register');
});

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[formControlName=email]').type(email);
  cy.get('input[formControlName=password]').type(`${password}{enter}{enter}`);
});

Cypress.Commands.add('register', (firstName, lastName, email, password) => {
  cy.visit('/register');
  cy.get('input[formControlName=firstName]').type(firstName);
  cy.get('input[formControlName=lastName]').type(lastName);
  cy.get('input[formControlName=email]').type(email);
  cy.get('input[formControlName=password]').type(`${password}{enter}{enter}`);
});
