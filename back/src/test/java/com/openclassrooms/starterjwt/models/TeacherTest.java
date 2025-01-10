package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import java.time.LocalDateTime;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TeacherTest {

    @Test
    void testLombokGeneratedMethods() {
        // Test @Builder
        Teacher teacher = Teacher.builder()
                .id(1L)
                .lastName("Doe")
                .firstName("John")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        assertThat(teacher).isNotNull();
        assertThat(teacher.getLastName()).isEqualTo("Doe");
        assertThat(teacher.getFirstName()).isEqualTo("John");

        // Test @ToString
        String teacherString = teacher.toString();
        assertThat(teacherString).contains("id=1");
        assertThat(teacherString).contains("lastName=Doe");
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();
        Teacher teacher = new Teacher(1L, "Doe", "John", now, now);

        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getLastName()).isEqualTo("Doe");
        assertThat(teacher.getFirstName()).isEqualTo("John");
        assertThat(teacher.getCreatedAt()).isEqualTo(now);
        assertThat(teacher.getUpdatedAt()).isEqualTo(now);
    }

    @Test
    void testNoArgsConstructor() {
        Teacher teacher = new Teacher();
        assertThat(teacher).isNotNull();
    }

    @Test
    void testDataAnnotation() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Doe");
        teacher.setFirstName("John");

        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getLastName()).isEqualTo("Doe");
        assertThat(teacher.getFirstName()).isEqualTo("John");
    }

    @Test
    void testValidation() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();

        Teacher teacher = Teacher.builder()
                .lastName("") // Invalid: blank
                .firstName("John")
                .build();

        Set<ConstraintViolation<Teacher>> violations = validator.validate(teacher);
        assertThat(violations).isNotEmpty();

        ConstraintViolation<Teacher> violation = violations.iterator().next();
        assertThat(violation.getMessage()).isEqualTo("ne doit pas être vide");
    }
}
