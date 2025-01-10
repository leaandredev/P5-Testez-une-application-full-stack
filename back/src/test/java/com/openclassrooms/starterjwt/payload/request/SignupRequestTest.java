package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class SignupRequestTest {

    @Test
    void testLombokGeneratedMethods() {
        // Test @Data (Getters and Setters)
        SignupRequest request = new SignupRequest();
        request.setEmail("test@example.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("securePassword");

        assertThat(request.getEmail()).isEqualTo("test@example.com");
        assertThat(request.getFirstName()).isEqualTo("John");
        assertThat(request.getLastName()).isEqualTo("Doe");
        assertThat(request.getPassword()).isEqualTo("securePassword");

        // Test @Data (toString, equals, hashCode)
        SignupRequest anotherRequest = new SignupRequest();
        anotherRequest.setEmail("test@example.com");
        anotherRequest.setFirstName("John");
        anotherRequest.setLastName("Doe");
        anotherRequest.setPassword("securePassword");

        assertThat(request).isEqualTo(anotherRequest);
        assertThat(request.hashCode()).isEqualTo(anotherRequest.hashCode());
        assertThat(request.toString()).contains("test@example.com", "John", "Doe");
    }

    @Test
    void testValidation() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();

        // Invalid SignupRequest
        SignupRequest invalidRequest = new SignupRequest();
        invalidRequest.setEmail("invalid-email"); // Invalid email format
        invalidRequest.setFirstName("Jo"); // Too short
        invalidRequest.setLastName(""); // Blank
        invalidRequest.setPassword("123"); // Too short

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(invalidRequest);

        assertThat(violations).isNotEmpty();
        assertThat(violations).hasSize(5); // 4 invalid fields

        violations.forEach(violation -> {
            String propertyPath = violation.getPropertyPath().toString();
            switch (propertyPath) {
                case "email":
                    assertThat(violation.getMessage()).isEqualTo("doit être une adresse électronique syntaxiquement correcte");
                    break;
                case "firstName":
                    assertThat(violation.getMessage()).isEqualTo("la taille doit être comprise entre 3 et 20");
                    break;
                case "lastName":
                    assertThat(violation.getMessage()).isIn("ne doit pas être vide", "la taille doit être comprise entre 3 et 20");
                    break;
                case "password":
                    assertThat(violation.getMessage()).isEqualTo("la taille doit être comprise entre 6 et 40");
                    break;
                default:
                    throw new IllegalStateException("Unexpected violation: " + propertyPath);
            }
        });

        // Valid SignupRequest
        SignupRequest validRequest = new SignupRequest();
        validRequest.setEmail("valid@example.com");
        validRequest.setFirstName("John");
        validRequest.setLastName("Doe");
        validRequest.setPassword("securePassword");

        violations = validator.validate(validRequest);

        assertThat(violations).isEmpty();
    }
}
