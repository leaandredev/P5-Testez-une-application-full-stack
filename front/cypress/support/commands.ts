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

Cypress.Commands.add('interceptLoginResponseForAdmin', () => {
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
});

Cypress.Commands.add('interceptLoginResponseNotAdmin', () => {
  // login response success
  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 2,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: false,
    },
  }).as('login');
});

Cypress.Commands.add('initIntercepts', () => {
  //get all
  cy.interceptWithFixture('GET', '/api/session', 'sessions');
  cy.interceptWithFixture('GET', '/api/user', 'users');
  cy.interceptWithFixture('GET', '/api/teacher', 'teachers');

  // delete
  cy.intercept('DELETE', '/api/user/*', {
    statusCode: 200,
  });
  cy.intercept('DELETE', '/api/session/*', {
    statusCode: 200,
  });

  // user particiapte to session
  cy.intercept('POST', '/api/session/*/participate/*', {
    statusCode: 200,
  }).as('participate');

  // user unparticipate to session
  cy.intercept('DELETE', '/api/session/*/participate/*', {
    statusCode: 200,
  }).as('unparticipate');

  // get by id
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

  // register response success
  cy.interceptLoginResponseForAdmin();
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
