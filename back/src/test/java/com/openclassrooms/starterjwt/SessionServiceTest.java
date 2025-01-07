package com.openclassrooms.starterjwt;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SessionRepository sessionRepository;

    @InjectMocks
    private SessionService sessionService;

    private List<Session> mockSessions;

    private Session mockFirstSession;
    private Session mockSecondSession;

    private User mockFirstUser;
    private User mockSecondUser;
    private Teacher mockTeacher;

    @BeforeEach
    public void beforeEach() {
        mockSessions = new ArrayList<>();
        mockSessions = new ArrayList<>();

        mockFirstUser = User.builder()
                .id(1L)
                .email("test@email.com")
                .lastName("Deborah")
                .firstName("GOLD")
                .password("password1234!")
                .admin(true)
                .build();
        mockSecondUser = User.builder()
                .id(2L)
                .email("test@email.com")
                .lastName("Flynn")
                .firstName("SERBUTI")
                .password("password1234!")
                .admin(true)
                .build();

        mockTeacher = Teacher.builder()
                .id(1L)
                .firstName("Jack")
                .lastName("DOLERTE")
                .build();

        mockFirstSession = Session.builder()
                .id(1L)
                .name("Session 1")
                .date(new Date())
                .description("Description for session 1")
                .teacher(mockTeacher)
                .users(new ArrayList<>())
                .build();
        mockFirstSession.getUsers().add(mockFirstUser);
        mockSecondSession = Session.builder()
                .id(2L)
                .name("Session 2")
                .date(new Date())
                .description("Description for session 2")
                .teacher(mockTeacher)
                .users(new ArrayList<>())
                .build();
        mockSecondSession.getUsers().add(mockSecondUser);
        mockSessions.add(mockFirstSession);
        mockSessions.add(mockSecondSession);
    }

    @Test
    public void testCreate() {
        // Arrange
        when(sessionRepository.save(mockFirstSession)).thenReturn(mockFirstSession);

        // Act
        Session session = sessionService.create(mockFirstSession);

        // Assert
        assertThat(session).isNotNull();
        assertThat(session).isEqualTo(mockFirstSession);
        verify(sessionRepository).save(mockFirstSession);
    }

    @Test
    public void testDelete() {
        // Act
        sessionService.delete(mockFirstSession.getId());

        // Assert
        verify(sessionRepository).deleteById(mockFirstSession.getId());
    }

    @Test
    public void testFindAll() {
        // Arrange
        when(sessionRepository.findAll()).thenReturn(mockSessions);

        // Act
        List<Session> sessions = sessionService.findAll();

        // Assert
        assertThat(sessions).isNotNull();
        assertThat(sessions).hasSize(2);
        assertThat(sessions).containsExactly(mockFirstSession, mockSecondSession);
        verify(sessionRepository).findAll();
    }

    @Test
    public void testGetById() {
        // Arrange
        when(sessionRepository.findById(mockFirstSession.getId())).thenReturn(Optional.of(mockFirstSession));

        // Act
        Session session = sessionService.getById(mockFirstSession.getId());

        // Assert
        assertThat(session).isNotNull();
        assertThat(session.getName()).isEqualTo("Session 1");
        verify(sessionRepository).findById(mockFirstSession.getId());
    }

    @Test
    public void testGetByIdNotFound() {
        // Arrange
        when(sessionRepository.findById((long) 15)).thenReturn(Optional.empty());

        // Act
        Session session = sessionService.getById((long) 15);

        // Assert
        assertThat(session).isNull();
        verify(sessionRepository).findById((long) 15);
    }

    @Test
    public void testUpdate() {
        // Arrange
        Session mockInputSession = Session.builder()
                .name("Session 2")
                .date(new Date())
                .description("Description for session 2 has been modified")
                .teacher(mockTeacher)
                .users(new ArrayList<>())
                .build();
        when(sessionRepository.save(any(Session.class))).thenReturn(mockInputSession);

        // Act
        Session updatedSession = sessionService.update(mockSecondSession.getId(), mockInputSession);

        // Asser
        assertThat(updatedSession).isNotNull();
        assertThat(updatedSession.getId()).isEqualTo(mockSecondSession.getId());
        assertThat(updatedSession.getDescription()).isEqualTo("Description for session 2 has been modified");
        verify(sessionRepository).save(mockInputSession);
    }

    @Test
    public void testParticipate() {
        // Arrange
        when(sessionRepository.findById(mockFirstSession.getId())).thenReturn(Optional.of(mockFirstSession));
        when(userRepository.findById(mockSecondUser.getId())).thenReturn(Optional.of(mockSecondUser));
        when(sessionRepository.save(mockFirstSession)).thenReturn(mockFirstSession);

        // Act
        sessionService.participate(mockFirstSession.getId(), mockSecondUser.getId());

        // Assert
        assertThat(mockFirstSession.getUsers()).contains(mockSecondUser);
        verify(sessionRepository).findById(mockFirstSession.getId());
        verify(userRepository).findById(mockSecondUser.getId());
        verify(sessionRepository).save(mockFirstSession);
    }

    @Test
    public void testParticipateSessionNotFound() {
        // Arrange
        when(sessionRepository.findById(mockFirstSession.getId())).thenReturn(Optional.empty());

        // Act and Assert
        assertThatThrownBy(() -> {
            sessionService.participate(mockFirstSession.getId(), mockSecondUser.getId());
        }).isInstanceOf(NotFoundException.class);
    }

    @Test
    public void testParticipateUserNotFound() {
        // Arrange
        when(sessionRepository.findById(mockFirstSession.getId())).thenReturn(Optional.of(mockFirstSession));
        when(userRepository.findById(mockSecondUser.getId())).thenReturn(Optional.empty());

        // Act and Assert
        assertThatThrownBy(() -> {
            sessionService.participate(mockFirstSession.getId(), mockSecondUser.getId());
        }).isInstanceOf(NotFoundException.class);
    }

    @Test
    public void testParticipateAlreadyParticipate() {
        // Arrange
        when(sessionRepository.findById(mockFirstSession.getId())).thenReturn(Optional.of(mockFirstSession));
        when(userRepository.findById(mockFirstUser.getId())).thenReturn(Optional.of(mockFirstUser));

        // Act and Assert
        assertThatThrownBy(() -> {
            sessionService.participate(mockFirstSession.getId(), mockFirstUser.getId());
        }).isInstanceOf(BadRequestException.class);
    }

    @Test
    public void testNoLongerParticipate() {
        // Arrange
        when(sessionRepository.findById(mockFirstSession.getId())).thenReturn(Optional.of(mockFirstSession));
        when(sessionRepository.save(mockFirstSession)).thenReturn(mockFirstSession);

        // Act
        sessionService.noLongerParticipate(mockFirstSession.getId(), mockFirstUser.getId());

        // Assert
        assertThat(mockFirstSession.getUsers()).doesNotContain(mockFirstUser);
        assertThat(mockFirstSession.getUsers()).isEmpty();
        verify(sessionRepository).findById(mockFirstSession.getId());
        verify(sessionRepository).save(mockFirstSession);
    }

    @Test
    public void testNoLongerParticipateSessionNotFound() {
        // Arrange
        when(sessionRepository.findById(mockFirstSession.getId())).thenReturn(Optional.empty());

        // Act and Assert
        assertThatThrownBy(() -> {
            sessionService.noLongerParticipate(mockFirstSession.getId(), mockFirstUser.getId());
        }).isInstanceOf(NotFoundException.class);
    }

    @Test
    public void testNoLongerParticipateUserAlreadyUnsubscribe() {
        // Arrange
        when(sessionRepository.findById(mockFirstSession.getId())).thenReturn(Optional.of(mockFirstSession));

        // Act and Assert
        assertThatThrownBy(() -> {
            sessionService.noLongerParticipate(mockFirstSession.getId(), mockSecondUser.getId());
        }).isInstanceOf(BadRequestException.class);
    }

    @Test
    public void testNoLongerParticipateMultipleUsers() {
        // Arrange
        mockFirstSession.setUsers(List.of(mockFirstUser, mockSecondUser)); // Session avec plusieurs utilisateurs
        when(sessionRepository.findById(mockFirstSession.getId())).thenReturn(Optional.of(mockFirstSession));
        when(sessionRepository.save(mockFirstSession)).thenReturn(mockFirstSession);

        // Act
        sessionService.noLongerParticipate(mockFirstSession.getId(), mockFirstUser.getId());

        // Assert
        assertThat(mockFirstSession.getUsers()).contains(mockSecondUser); // Vérifie que l'autre utilisateur reste
        assertThat(mockFirstSession.getUsers()).doesNotContain(mockFirstUser);
        verify(sessionRepository).findById(mockFirstSession.getId());
        verify(sessionRepository).save(mockFirstSession);
    }

}
