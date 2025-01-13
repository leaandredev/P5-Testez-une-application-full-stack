![Java](https://img.shields.io/badge/Java-11-blue?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.6.1-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)
![JUnit](https://img.shields.io/badge/Tests-JUnit-25A162?style=for-the-badge&logo=java&logoColor=white)
![Mockito](https://img.shields.io/badge/Tests-Mockito-59666C?style=for-the-badge&logo=java&logoColor=white)
![Jacoco](https://img.shields.io/badge/Coverage-Jacoco-BE2C2C?style=for-the-badge&logo=java&logoColor=white)

# Yoga App (Back-end)

This is the backend of Yoga APP, used to handle yoga sessions.

## Features:

- Register and log users to connect to the application
- Handle sessions :
  - get all, create or modify one
  - user participation
- Handle user profil

## Installation

After the repository has been imported (see README in the front part of the project), go in back directory and install depencies with maven :

```
mvn install
```

### Create the Yoga Database

1. **Set Up the Database**  
   Open a MySQL client in your terminal or use a tool like MySQL Workbench, and execute the following commands. Replace `yoga_db`, `your_user_name`, and `your_password` with your desired database name, username, and password:

   ```sql
   CREATE DATABASE yoga_db;
   CREATE USER 'your_user_name'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON yoga_db.* TO 'your_user_name'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Create Tables**  
   Locate the SQL script in the front directory of the project, `ressources/sql/script.sql`, and execute it in your MySQL client to create the required tables (`USERS`, `SESSIONS`, `PARTICAPTE` and `TEACHERS`).

3. **Configure Database Access in the API Project**  
   The application uses environment variables to define database parameters. In the `src/main/resources/application.properties` file, ensure the following lines are present:

   ```properties
   # MySQL Database Configuration
   spring.datasource.url=${MYSQL_DATABASE_URL}
   spring.datasource.username=${MYSQL_DATABASE_USERNAME}
   spring.datasource.password=${MYSQL_DATABASE_PASSWORD}
   ```

4. **Set Environment Variables**  
   Configure the environment variables for your operating system:

   - **On Linux/macOS:**  
     Add the following lines to your `~/.bashrc` (or `~/.zshrc` for macOS with zsh) file:

     ```bash
     export MYSQL_DATABASE_URL=jdbc:mysql://localhost:3306/yoga_db
     export MYSQL_DATABASE_USERNAME=your_user_name
     export MYSQL_DATABASE_PASSWORD=your_password
     ```

     Apply the changes:

     ```bash
     source ~/.bashrc
     ```

   - **On Windows (Command Prompt):**  
     Set the environment variables temporarily for the current session:

     ```cmd
     set MYSQL_DATABASE_URL=jdbc:mysql://localhost:3306/yoga_db
     set MYSQL_DATABASE_USERNAME=your_user_name
     set MYSQL_DATABASE_PASSWORD=your_password
     ```

     For persistent variables, use the _System Properties_ panel in Windows to add them under _Environment Variables_.

   - **On Windows (PowerShell):**  
     Use the following commands to set variables for the current session:
     ```powershell
     $env:MYSQL_DATABASE_URL="jdbc:mysql://localhost:3306/yoga_db"
     $env:MYSQL_DATABASE_USERNAME="your_user_name"
     $env:MYSQL_DATABASE_PASSWORD="your_password"
     ```

### Run the server

Run the Spring Boot application in your IDE or in the terminal using maver:

```
mvn spring-boot:run
```

## Usage

The API will be available on your local machine at http://localhost:8080/

## Testing

For launch and generate the jacoco code coverage, with unit AND integration test :

```
mvn clean verify
```

Report is available here :

> back/target/jacoco/index.html

## Technologies

**Spring Boot** - Main framework for building the application with modules :

- Spring Data JPA
- Spring Security
- Spring Web
- Spring Validation

**Java 14** - Programming language

**MySQL** - Database to store application data

**Maven**: Build and dependency management tool.

**Junit**: Testing library for unit and integration test

**Mockito**: Library to mock dependecies in test

**Jacoco**: Generate test reports

## Contributing

Yoga APP is an open source project. Feel free to fork the source and contribute with your own features.

## Authors

- Lea ANDRE

## Licensing

This project was built under the Creative Commons licence.
