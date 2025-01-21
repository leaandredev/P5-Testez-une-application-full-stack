package com.openclassrooms.starterjwt.payload.request;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class LoginRequestTest {

    @Test
    public void testGetEmail() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        assertThat(loginRequest.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    public void testSetEmail() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        assertThat(loginRequest.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    public void testGetPassword() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setPassword("password123");
        assertThat(loginRequest.getPassword()).isEqualTo("password123");
    }

    @Test
    public void testSetPassword() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setPassword("password123");
        assertThat(loginRequest.getPassword()).isEqualTo("password123");
    }
}
