package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;

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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.dto.SessionDto;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.*;

@ActiveProfiles("test")
@SpringBootTest(classes = { SpringBootSecurityJwtApplication.class, SessionController.class })
@AutoConfigureMockMvc
public class SessionControllerIT {

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

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
        this.mockMvc.perform(get("/api/session/{id}", 1)
                .with(user("yoga@studio.com")))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Yoga Débutant"))
                .andExpect(jsonPath("$.description").value("Une session pour les débutants en yoga."))
                .andExpect(jsonPath("$.date").value("2025-01-15T09:00:00.000+00:00"))
                .andExpect(jsonPath("$.teacher_id").value(1))
                .andExpect(jsonPath("$.users").isArray())
                .andExpect(jsonPath("$.users.length()").value(2))
                .andExpect(jsonPath("$.users[0]").value(2))
                .andExpect(jsonPath("$.users[1]").value(3));
    }

    @Test
    public void testFindByIdWithUserNotFound() throws Exception {
        // Act and Assert
        this.mockMvc.perform(get("/api/session/{id}", 12)
                .with(user("yoga@studio.com")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testFindByIdWithWrongNumberFormat() throws Exception {
        // Act and Assert
        this.mockMvc.perform(get("/api/session/{id}", "notNumber")
                .with(user("yoga@studio.com")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testFindAll() throws Exception {
        // Act and Assert
        this.mockMvc.perform(get("/api/session")
                .with(user("yoga@studio.com")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Yoga Débutant"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Méditation Avancée"))
                .andExpect(jsonPath("$[2].id").value(3))
                .andExpect(jsonPath("$[2].name").value("Relaxation du Soir"))
                .andExpect(jsonPath("$[3].id").value(4))
                .andExpect(jsonPath("$[3].name").value("Pilates Intermédiaire"));
    }

    @Test
    public void testCreate() throws Exception {
        // Arrange
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        Date expectedDate = sdf.parse("2025-01-25T09:00:00.000+0000");

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("new Yoga Session");
        sessionDto.setDescription("description for new Yoga Session");
        sessionDto.setDate(expectedDate);
        sessionDto.setTeacher_id(1L);

        String jsonSessionDto = mapper.writeValueAsString(sessionDto);

        // Act and Assert
        this.mockMvc.perform(
                post("/api/session")
                        .with(user("yoga@studio.com"))
                        .content(jsonSessionDto).contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("new Yoga Session"))
                .andExpect(jsonPath("$.description").value("description for new Yoga Session"))
                .andExpect(jsonPath("$.date").value("2025-01-25T09:00:00.000+00:00"))
                .andExpect(jsonPath("$.teacher_id").value(1));

    }

    @Test
    public void testUdapte() throws Exception {
        // Arrange
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        Date expectedDate = sdf.parse("2025-01-15T10:00:00.000+0000");

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Yoga Débutant MODIFIED");
        sessionDto.setDescription("Une session pour les débutants en yoga.");
        sessionDto.setTeacher_id(1L);
        sessionDto.setDate(expectedDate);

        String jsonSessionDto = mapper.writeValueAsString(sessionDto);

        // Act and Assert
        this.mockMvc.perform(
                put("/api/session/{id}", 1)
                        .with(user("yoga@studio.com"))
                        .content(jsonSessionDto).contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Yoga Débutant MODIFIED"))
                .andExpect(jsonPath("$.description").value("Une session pour les débutants en yoga."))
                .andExpect(jsonPath("$.date").value("2025-01-15T10:00:00.000+00:00"))
                .andExpect(jsonPath("$.teacher_id").value(1));
    }

    @Test
    public void testUdapteWithWrongNumberFormat() throws Exception {
        // Arrange
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        Date expectedDate = sdf.parse("2025-01-15T10:00:00.000+0000");

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Yoga Débutant MODIFIED");
        sessionDto.setDescription("Une session pour les débutants en yoga.");
        sessionDto.setTeacher_id(1L);
        sessionDto.setDate(expectedDate);

        String jsonSessionDto = mapper.writeValueAsString(sessionDto);

        // Act and Assert
        this.mockMvc.perform(
                put("/api/session/{id}", "notNumber")
                        .with(user("yoga@studio.com"))
                        .content(jsonSessionDto).contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testSave() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/session/{id}", 4)
                .with(user("yoga@studio.com")))
                .andExpect(status().isOk());
    }

    @Test
    public void testSaveWithSessionNotFound() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/session/{id}", 12)
                .with(user("yoga@studio.com")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testSaveWithWithWrongNumberFormat() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/session/{id}", "notNumber")
                .with(user("yoga@studio.com")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testParticipate() throws Exception {
        // Act and Assert
        this.mockMvc.perform(post("/api/session/{id}/participate/{userId}", 1, 4)
                .with(user("yoga@studio.com")))
                .andExpect(status().isOk());
    }

    @Test
    public void testParticipateWithWrongNumberFormat() throws Exception {
        // Act and Assert
        this.mockMvc.perform(post("/api/session/{id}/participate/{userId}", "NotNumber", 4)
                .with(user("yoga@studio.com")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testParticipateWithSessionNotFound() throws Exception {
        // Act and Assert
        this.mockMvc.perform(post("/api/session/{id}/participate/{userId}", 12, 4)
                .with(user("yoga@studio.com")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testParticipateWithUserNotFound() throws Exception {
        // Act and Assert
        this.mockMvc.perform(post("/api/session/{id}/participate/{userId}", 1, 12)
                .with(user("yoga@studio.com")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testParticipateWithUserAlreadyParticipate() throws Exception {
        // Act and Assert
        this.mockMvc.perform(post("/api/session/{id}/participate/{userId}", 1, 2)
                .with(user("yoga@studio.com")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testNoLongerParticipate() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/session/{id}/participate/{userId}", 2, 4)
                .with(user("yoga@studio.com")))
                .andExpect(status().isOk());
    }

    @Test
    public void testNoLongerParticipateWithWrongNumberFormat() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/session/{id}/participate/{userId}", "NotNumber", 4)
                .with(user("yoga@studio.com")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testNoLongerParticipateWithSessionNotFound() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/session/{id}/participate/{userId}", 12, 4)
                .with(user("yoga@studio.com")))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testNoLongerParticipateWithUserNotFound() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/session/{id}/participate/{userId}", 2, 12)
                .with(user("yoga@studio.com")))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testNoLongerParticipateWithUserAlreadyNoLongerParticipate() throws Exception {
        // Act and Assert
        this.mockMvc.perform(delete("/api/session/{id}/participate/{userId}", 2, 2)
                .with(user("yoga@studio.com")))
                .andExpect(status().isBadRequest());
    }

}
