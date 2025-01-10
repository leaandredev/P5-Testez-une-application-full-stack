package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class JwtResponseTest {

    @Test
    void testConstructorAndGetters() {
        // Arrange
        String token = "sampleToken";
        Long id = 1L;
        String username = "user@example.com";
        String firstName = "John";
        String lastName = "Doe";
        Boolean admin = true;

        // Act
        JwtResponse jwtResponse = new JwtResponse(token, id, username, firstName, lastName, admin);

        // Assert
        assertThat(jwtResponse.getToken()).isEqualTo(token);
        assertThat(jwtResponse.getType()).isEqualTo("Bearer");
        assertThat(jwtResponse.getId()).isEqualTo(id);
        assertThat(jwtResponse.getUsername()).isEqualTo(username);
        assertThat(jwtResponse.getFirstName()).isEqualTo(firstName);
        assertThat(jwtResponse.getLastName()).isEqualTo(lastName);
        assertThat(jwtResponse.getAdmin()).isEqualTo(admin);
    }

    @Test
    void testSetters() {
        // Arrange
        JwtResponse jwtResponse = new JwtResponse(null, null, null, null, null, null);

        // Act
        jwtResponse.setToken("newToken");
        jwtResponse.setId(2L);
        jwtResponse.setUsername("newUser@example.com");
        jwtResponse.setFirstName("Jane");
        jwtResponse.setLastName("Smith");
        jwtResponse.setAdmin(false);

        // Assert
        assertThat(jwtResponse.getToken()).isEqualTo("newToken");
        assertThat(jwtResponse.getId()).isEqualTo(2L);
        assertThat(jwtResponse.getUsername()).isEqualTo("newUser@example.com");
        assertThat(jwtResponse.getFirstName()).isEqualTo("Jane");
        assertThat(jwtResponse.getLastName()).isEqualTo("Smith");
        assertThat(jwtResponse.getAdmin()).isFalse();
    }

    @Test
    void testDefaultTypeValue() {
        // Arrange
        JwtResponse jwtResponse = new JwtResponse(null, null, null, null, null, null);

        // Assert
        assertThat(jwtResponse.getType()).isEqualTo("Bearer");
    }
}
