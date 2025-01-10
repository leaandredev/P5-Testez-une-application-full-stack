package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.*;

@ActiveProfiles("test")
@SpringBootTest(classes = { SpringBootSecurityJwtApplication.class, UserController.class })
@AutoConfigureMockMvc
public class UserControllerIT {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @BeforeEach
    public void beforeEach() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    public void testFindById() throws Exception {
        // Act and Assert
        this.mockMvc.perform(get("/api/user/{id}", 2)
                .with(user("yoga@studio.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.email").value("alice.martin@example.com"))
                .andExpect(jsonPath("$.firstName").value("Alice"))
                .andExpect(jsonPath("$.lastName").value("Martin"))
                .andExpect(jsonPath("$.admin").value(false));

    }

    @Test
    public void testFindByIdWithUserNotFound() throws Exception {
        // Act and Assert
        this.mockMvc.perform(get("/api/user/{id}", 12)
                .with(user("yoga@studio.com")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testFindByIdWithWrongNumberFormat() throws Exception {
        // Act and Assert
        this.mockMvc.perform(get("/api/user/{id}", "notNumber")
                .with(user("yoga@studio.com")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testSave() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/user/{id}", 1)
                .with(user("yoga@studio.com")))
                .andExpect(status().isOk());
    }

    @Test
    public void testSaveUnauthorizedDelete() throws Exception {
        // Act and Assert
        // User authentificated is different from the one we try to delete
        this.mockMvc.perform(delete("/api/user/{id}", 2)
                .with(user("yoga@studio.com")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testSaveWithUserNotFound() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/user/{id}", 12)
                .with(user("yoga@studio.com")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testSaveWithWithWrongNumberFormat() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/user/{id}", "notNumber")
                .with(user("yoga@studio.com")))
                .andExpect(status().isBadRequest());
    }

}
