
CREATE TABLE `TEACHERS`
(
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `last_name` VARCHAR
(40),
  `first_name` VARCHAR
(40),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `SESSIONS`
(
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR
(50),
  `description` VARCHAR
(2000),
  `date` TIMESTAMP,
  `teacher_id` int,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `USERS`
(
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `last_name` VARCHAR
(40),
  `first_name` VARCHAR
(40),
  `admin` BOOLEAN NOT NULL DEFAULT false,
  `email` VARCHAR
(255),
  `password` VARCHAR
(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `PARTICIPATE`
(
  `user_id` INT, 
  `session_id` INT
);

ALTER TABLE `SESSIONS`
ADD FOREIGN KEY
(`teacher_id`) REFERENCES `TEACHERS`
(`id`);
ALTER TABLE `PARTICIPATE`
ADD FOREIGN KEY
(`user_id`) REFERENCES `USERS`
(`id`);
ALTER TABLE `PARTICIPATE`
ADD FOREIGN KEY
(`session_id`) REFERENCES `SESSIONS`
(`id`);


-- Création des enseignants
INSERT INTO TEACHERS (first_name, last_name) 
VALUES 
    ('Margot', 'DELAHAYE'), 
    ('Hélène', 'THIERCELIN');

-- Création des utilisateurs
INSERT INTO USERS (first_name, last_name, admin, email, password) 
VALUES 
    ('Admin', 'Admin', true, 'yoga@studio.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'), -- Admin existant
    ('Alice', 'Martin', false, 'alice.martin@example.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'), -- Non admin
    ('Bob', 'Dupont', false, 'bob.dupont@example.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'), -- Non admin
    ('Claire', 'Durand', false, 'claire.durand@example.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'), -- Non admin
    ('David', 'Leclerc', false, 'david.leclerc@example.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'); -- Non admin

-- Création des sessions
INSERT INTO SESSIONS (name, description, date, teacher_id) 
VALUES 
    ('Yoga Débutant', 'Une session pour les débutants en yoga.', '2025-01-15 10:00:00', 1), -- Margot DELAHAYE
    ('Méditation Avancée', 'Approfondissez votre pratique de la méditation.', '2025-01-20 15:00:00', 2), -- Hélène THIERCELIN
    ('Relaxation du Soir', 'Session pour se relaxer après une journée chargée.', '2025-01-18 18:00:00', 1), -- Margot DELAHAYE
    ('Pilates Intermédiaire', 'Travaillez votre souplesse et votre force.', '2025-01-22 14:00:00', 2); -- Hélène THIERCELIN

-- Participation des utilisateurs aux sessions
INSERT INTO PARTICIPATE (user_id, session_id) 
VALUES 
    (2, 1), -- Alice participe à "Yoga Débutant"
    (3, 1), -- Bob participe à "Yoga Débutant"
    (4, 2), -- Claire participe à "Méditation Avancée"
    (5, 3), -- David participe à "Relaxation du Soir"
    (2, 3), -- Alice participe également à "Relaxation du Soir"
    (3, 4); -- Bob participe à "Pilates Intermédiaire"