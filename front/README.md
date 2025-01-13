![Angular](https://img.shields.io/badge/Front-Angular%2014.1-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Jest](https://img.shields.io/badge/Tests-Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Cypress](https://img.shields.io/badge/Tests-Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)

# Yoga App (Front-end)

This is the frontend of Yoga APP, used to handle yoga sessions.

## Features:

- Register and log users to connect to the application
- Handle sessions :
  - get all, create or modify one
  - user participation
- Handle user profil

## Installation

Git clone:

```
git clone https://github.com/leaandredev/P5-Testez-une-application-full-stack.git
```

Install dependencies:

```
npm install
```

Launch Front-end:

```
npm run start;
```

## Ressources

### Mockoon env

### Postman collection

For Postman import the collection

> ressources/postman/yoga.postman_collection.json

by following the documentation:

https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman

### MySQL

SQL script for creating the schema is available `ressources/sql/script.sql`

You will find installation procedure in back-end README.

By default the admin account is:

- login: yoga@studio.com
- password: test!1234

## Testing

### End to End (E2E) with Cypress

Launching e2e test:

```
npm run e2e
```

Generate coverage report (you should launch e2e test before):

```
npm run e2e:coverage
```

Report is available here:

> front/coverage/lcov-report/index.html

### Unitary test with Jest

Launching test:

```
npm run test
```

for following change:

```
npm run test:watch
```

## Technologies

**Angular** - Main framework

**TypeScript** - Programming language

**SCSS** - Styling for the UI design

**Jest** - Unit and Integration test library

**Cypress** - End to End (E2E) library

## Contributing

Yoga APP is an open source project. Feel free to fork the source and contribute with your own features.

## Authors

- Lea ANDRE

## Licensing

This project was built under the Creative Commons licence.