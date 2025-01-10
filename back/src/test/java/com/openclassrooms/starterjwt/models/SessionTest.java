package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SessionTest {

    @Test
    void testLombokGeneratedMethods() {
        // Test @Builder
        Teacher teacher = Teacher.builder().id(1L).lastName("Julie").firstName("Sarah").build();
        User user1 = User.builder()
                .email("test@example.com")
                .lastName("Doe")
                .firstName("John")
                .password("password123")
                .admin(true)
                .build();
        User user2 = User.builder()
                .email("test2@example.com")
                .lastName("Jack")
                .firstName("David")
                .password("password123")
                .admin(true)
                .build();

        Session session = Session.builder()
                .id(1L)
                .name("Yoga Session")
                .date(new Date())
                .description("A relaxing yoga session")
                .teacher(teacher)
                .users(List.of(user1, user2))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        assertThat(session).isNotNull();
        assertThat(session.getName()).isEqualTo("Yoga Session");
        assertThat(session.getDescription()).isEqualTo("A relaxing yoga session");
        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getUsers()).containsExactly(user1, user2);

        // Test @ToString
        String sessionString = session.toString();
        assertThat(sessionString).contains("id=1");
        assertThat(sessionString).contains("name=Yoga Session");
        assertThat(sessionString).contains("teacher=" + teacher.toString());
    }

    @Test
    void testAllArgsConstructor() {
        Teacher teacher = Teacher.builder().id(1L).lastName("Julie").firstName("Sarah").build();
        User user1 = User.builder()
                .email("test@example.com")
                .lastName("Doe")
                .firstName("John")
                .password("password123")
                .admin(true)
                .build();
        User user2 = User.builder()
                .email("test2@example.com")
                .lastName("Jack")
                .firstName("David")
                .password("password123")
                .admin(true)
                .build();
        List<User> users = new ArrayList<>();
        users.add(user1);
        users.add(user2);
        LocalDateTime now = LocalDateTime.now();

        Session session = new Session(
                1L,
                "Yoga Session",
                new Date(),
                "A relaxing yoga session",
                teacher,
                users,
                now,
                now);

        assertThat(session.getId()).isEqualTo(1L);
        assertThat(session.getName()).isEqualTo("Yoga Session");
        assertThat(session.getUsers()).isEqualTo(users);
    }

    @Test
    void testNoArgsConstructor() {
        Session session = new Session();
        assertThat(session).isNotNull();
    }

    @Test
    void testDataAnnotation() {
        Session session = new Session();
        session.setId(1L);
        session.setName("Yoga Session");
        session.setDate(new Date());
        session.setDescription("A relaxing yoga session");

        assertThat(session.getId()).isEqualTo(1L);
        assertThat(session.getName()).isEqualTo("Yoga Session");
        assertThat(session.getDescription()).isEqualTo("A relaxing yoga session");
    }

    @Test
    void testValidation() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();

        Session session = Session.builder()
                .name("") // Invalid: blank
                .date(null) // Invalid: null
                .description(null) // Invalid: null
                .build();

        Set<ConstraintViolation<Session>> violations = validator.validate(session);
        assertThat(violations).isNotEmpty();

        violations.forEach(violation -> {
            String propertyPath = violation.getPropertyPath().toString();
            if (propertyPath.equals("name")) {
                assertThat(violation.getMessage()).isEqualTo("ne doit pas être vide");
            } else if (propertyPath.equals("date")) {
                assertThat(violation.getMessage()).isEqualTo("ne doit pas être nul");
            } else if (propertyPath.equals("description")) {
                assertThat(violation.getMessage()).isEqualTo("ne doit pas être nul");
            }
        });
    }

    @Test
    void testRelationships() {
        Teacher teacher = Teacher.builder().id(1L).lastName("Julie").firstName("Sarah").build();
        User user1 = User.builder()
                .email("test@example.com")
                .lastName("Doe")
                .firstName("John")
                .password("password123")
                .admin(true)
                .build();
        User user2 = User.builder()
                .email("test2@example.com")
                .lastName("Jack")
                .firstName("David")
                .password("password123")
                .admin(true)
                .build();

        Session session = Session.builder()
                .teacher(teacher)
                .users(List.of(user1, user2))
                .build();

        assertThat(session.getTeacher()).isEqualTo(teacher);
        assertThat(session.getUsers()).containsExactly(user1, user2);
    }
}
