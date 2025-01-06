package com.openclassrooms.starterjwt;

import static org.mockito.Mockito.*;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User mockUser;

    @BeforeEach
    public void beforeEach() {
        mockUser = new User("test@email.com", "lastName", "firstName", "passWord1234!", true);
    }

    @Test
    public void testDelete() {
        // Act
        userService.delete(mockUser.getId());

        // Assert
        verify(userRepository).deleteById(mockUser.getId());
    }

    @Test
    public void testFindById() {
        // Arrange
        when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));

        // Act
        User user = userService.findById(mockUser.getId());

        // Assert
        assertThat(user).isNotNull();
        assertThat(user.getLastName()).isEqualTo("lastName");
        verify(userRepository).findById(mockUser.getId());
    }

    @Test
    public void testFindByIdNotFound() {
        // Arrange
        when(userRepository.findById((long) 15)).thenReturn(Optional.empty());

        // Act
        User user = userService.findById((long) 15);

        // Assert
        assertThat(user).isNull();
        verify(userRepository).findById((long) 15);
    }
}
