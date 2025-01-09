package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;

@ActiveProfiles("test")
@SpringBootTest(classes = { SpringBootSecurityJwtApplication.class, AuthController.class })
@AutoConfigureMockMvc
public class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

    @Test
    public void testAuthenticateUser() throws Exception {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("yoga@studio.com");
        loginRequest.setPassword("test!1234");

        String jsonLoginRequest = mapper.writeValueAsString(loginRequest);

        // Act and Assert
        this.mockMvc.perform(
                post("/api/auth/login")
                        .content(jsonLoginRequest)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    public void testRegisterUser() throws Exception {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setFirstName("Josh");
        signupRequest.setLastName("FREUDOL");
        signupRequest.setEmail("jfeurdol@example.com");
        signupRequest.setPassword("newPassword1234!");

        String jsonSignupRequest = mapper.writeValueAsString(signupRequest);

        // Act and Assert
        this.mockMvc.perform(
                post("/api/auth/register")
                        .content(jsonSignupRequest)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    public void testRegisterUserWhenUserAlreadyRegistered() throws Exception {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setFirstName("Alice");
        signupRequest.setLastName("Martin");
        signupRequest.setEmail("alice.martin@example.com");
        signupRequest.setPassword("newPassword1234!");

        String jsonSignupRequest = mapper.writeValueAsString(signupRequest);

        // Act and Assert
        this.mockMvc.perform(post("/api/auth/register")
                .content(jsonSignupRequest)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
        ;
    }
}
