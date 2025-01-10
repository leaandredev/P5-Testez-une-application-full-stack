package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.*;

@ActiveProfiles("test")
@SpringBootTest(classes = { SpringBootSecurityJwtApplication.class, TeacherController.class })
@AutoConfigureMockMvc
public class TeacherControllerIT {

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
        this.mockMvc.perform(get("/api/teacher/{id}", 1)
                .with(user("yoga@studio.com")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Margot"))
                .andExpect(jsonPath("$.lastName").value("DELAHAYE"));
    }

    @Test
    public void testFindByIdWithUserNotFound() throws Exception {
        // Act and Assert
        this.mockMvc.perform(get("/api/teacher/{id}", 12)
                .with(user("yoga@studio.com")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testFindByIdWithWrongNumberFormat() throws Exception {
        // Act and Assert
        this.mockMvc.perform(get("/api/teacher/{id}", "notNumber")
                .with(user("yoga@studio.com")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testFindAll() throws Exception {
        // Act and Assert
        this.mockMvc.perform(get("/api/teacher")
                .with(user("yoga@studio.com")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].firstName").value("Margot"))
                .andExpect(jsonPath("$[0].lastName").value("DELAHAYE"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].firstName").value("Hélène"))
                .andExpect(jsonPath("$[1].lastName").value("THIERCELIN"));
    }

}
