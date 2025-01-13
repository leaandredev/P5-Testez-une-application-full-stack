package com.openclassrooms.starterjwt.mapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;

@ExtendWith(MockitoExtension.class)
public class SessionMapperTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @InjectMocks
    private SessionMapper sessionMapper = Mappers.getMapper(SessionMapper.class);

    private SessionDto mockSessionDto;
    private Session mockSession;

    @BeforeEach
    public void beforeEach() {
        LocalDateTime now = LocalDateTime.now();
        User mockFirstUser = User.builder()
                .id(1L)
                .email("test@email.com")
                .lastName("Deborah")
                .firstName("GOLD")
                .password("password1234!")
                .admin(true)
                .build();
        User mockSecondUser = User.builder()
                .id(2L)
                .email("test@email.com")
                .lastName("Flynn")
                .firstName("SERBUTI")
                .password("password1234!")
                .admin(true)
                .build();
        Teacher mockTeacher = Teacher.builder()
                .id(1L)
                .firstName("Jack")
                .lastName("DOLERTE")
                .build();
        mockSession = Session.builder()
                .id(1L)
                .name("Session 1")
                .date(new Date())
                .description("Description for session 1")
                .teacher(mockTeacher)
                .users(new ArrayList<>())
                .createdAt(now.minusDays(1))
                .updatedAt(now)
                .build();
        mockSession.getUsers().add(mockFirstUser);
        mockSession.getUsers().add(mockSecondUser);

        mockSessionDto = new SessionDto(
                1L, // id
                "Session 1", // name
                new Date(), // date
                1L, // teacher_id (mockTeacher.getId())
                "Description for session 1", // description
                Arrays.asList(1L, 2L), // users IDs (mockFirstUser.getId(), mockSecondUser.getId())
                now.minusDays(1), // createdAt
                now // updatedAt
        );
    }

    @Test
    public void testToEntity() {
        // Act
        Session session = sessionMapper.toEntity(mockSessionDto);

        // Assert
        assertThat(session).isNotNull();
        assertThat(session).isEqualTo(mockSession);
    }

    @Test
    public void testNullDtoToEntity() {
        // Act
        Session session = sessionMapper.toEntity((SessionDto) null);

        // Assert
        assertThat(session).isNull();
    }

    @Test
    public void testToEntityWithTeacherNull() {
        // Arrange
        mockSessionDto.setTeacher_id(null);

        // Act
        Session session = sessionMapper.toEntity(mockSessionDto);

        // Assert
        assertThat(session).isNotNull();
        assertThat(session).isEqualTo(mockSession);
        assertThat(session.getTeacher()).isNull();
    }

    @Test
    public void testToentityWithEmptyUsersList() {
        // Arrange
        mockSessionDto.setUsers(new ArrayList<>());

        // Act
        Session session = sessionMapper.toEntity(mockSessionDto);

        // Assert
        assertThat(session).isNotNull();
        assertThat(session).isEqualTo(mockSession);
        assertThat(session.getUsers()).isEmpty();
    }

    @Test
    public void testToentityWithNullUserInUsersList() {
        // Arrange
        mockSessionDto.setUsers(Arrays.asList(1L, null));

        // Act
        Session session = sessionMapper.toEntity(mockSessionDto);

        // Assert
        assertThat(session).isNotNull();
        assertThat(session).isEqualTo(mockSession);
        assertThat(session.getUsers()).isNotEmpty();
        assertThat(session.getUsers()).hasSize(2);
        assertThat(session.getUsers()).containsNull();
    }

    @Test
    public void testToentityWithUnkownUserInUsersList() {
        // Arrange
        mockSessionDto.setUsers(Arrays.asList(1L, 3L));

        // Act
        Session session = sessionMapper.toEntity(mockSessionDto);

        // Assert
        assertThat(session).isNotNull();
        assertThat(session).isEqualTo(mockSession);
        assertThat(session.getUsers()).isNotEmpty();
        assertThat(session.getUsers()).hasSize(2);
        assertThat(session.getUsers()).containsNull();
    }

    @Test
    public void testToentityWithNullUsersList() {
        // Arrange
        mockSessionDto.setUsers(null);

        // Act
        Session session = sessionMapper.toEntity(mockSessionDto);

        // Assert
        assertThat(session).isNotNull();
        assertThat(session).isEqualTo(mockSession);
        assertThat(session.getUsers()).isEmpty();
    }

    @Test
    public void testToDto() {
        // Act
        SessionDto sessionDto = sessionMapper.toDto(mockSession);

        // Assert
        assertThat(sessionDto).isNotNull();
        assertThat(sessionDto).isEqualTo(mockSessionDto);
    }

    @Test
    public void testEntityToDtoWithNullTeacher() {
        // Arrange
        mockSession.setTeacher((Teacher) null);
        mockSessionDto.setTeacher_id(null);

        // Act
        SessionDto sessionDto = sessionMapper.toDto(mockSession);

        // Assert
        assertThat(sessionDto).isNotNull();
        assertThat(sessionDto).isEqualTo(mockSessionDto);
        assertThat(sessionDto.getTeacher_id()).isNull();
    }

    @Test
    public void testEntityToDtoWithTeacherIdNull() {
        // Arrange
        mockSession.setTeacher(mockSession.getTeacher().setId(null));
        mockSessionDto.setTeacher_id(null);

        // Act
        SessionDto sessionDto = sessionMapper.toDto(mockSession);

        // Assert
        assertThat(sessionDto).isNotNull();
        assertThat(sessionDto).isEqualTo(mockSessionDto);
        assertThat(sessionDto.getTeacher_id()).isNull();
    }

    @Test
    public void testNullEntityToDto() {
        // Act
        SessionDto sessionDto = sessionMapper.toDto((Session) null);

        // Assert
        assertThat(sessionDto).isNull();
    }

    @Test
    public void testToEntityList() {
        // Arrange
        List<SessionDto> mockSessionDtoList = Arrays.asList(mockSessionDto, mockSessionDto);

        // Act
        List<Session> sessionList = sessionMapper.toEntity(mockSessionDtoList);

        // Assert
        assertThat(sessionList).isNotNull();
        assertThat(sessionList).hasSize(2);
    }

    @Test
    public void testNullSessionDtoListToEntityList() {
        // Arrange
        List<SessionDto> mockSessionDtoList = null;

        // Act
        List<Session> sessionList = sessionMapper.toEntity(mockSessionDtoList);

        // Assert
        assertThat(sessionList).isNull();
    }

    @Test
    public void testToDtoList() {
        // Arrange
        List<Session> mockSessionList = Arrays.asList(mockSession, mockSession);

        // Act
        List<SessionDto> sessionDtoList = sessionMapper.toDto(mockSessionList);

        // Assert
        assertThat(sessionDtoList).isNotNull();
        assertThat(sessionDtoList).hasSize(2);
    }

    @Test
    public void testNullSessionListToDtoList() {
        // Arrange
        List<Session> mockSessionList = null;

        // Act
        List<SessionDto> sessionDtoList = sessionMapper.toDto(mockSessionList);

        // Assert
        assertThat(sessionDtoList).isNull();
    }

}
