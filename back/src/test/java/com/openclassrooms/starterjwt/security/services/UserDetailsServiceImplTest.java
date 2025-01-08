package com.openclassrooms.starterjwt.security.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsServiceImpl;

    private User mockUser;

    @BeforeEach
    public void beforeEach() {
        mockUser = User.builder()
                .id(1L)
                .email("test@email.com")
                .firstName("Deborah")
                .lastName("GOLD")
                .password("password1234!")
                .admin(true)
                .build();
    }

    @Test
    public void testLoadUserByUsername() {
        // Arrange
        when(userRepository.findByEmail(mockUser.getEmail())).thenReturn(Optional.of(mockUser));

        // Act
        UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(mockUser.getEmail());

        // Assert
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo(mockUser.getEmail());
        assertThat(userDetails.getPassword()).isEqualTo(mockUser.getPassword());
        verify(userRepository).findByEmail(mockUser.getEmail());
    }

    @Test
    public void testLoadUserByUsernameWithUserNotFound() {
        // Arrange
        when(userRepository.findByEmail("wrongemail@test.com")).thenReturn(Optional.empty());

        // Act and Assert
        assertThatThrownBy(() -> {
            userDetailsServiceImpl.loadUserByUsername("wrongemail@test.com");
        }).isInstanceOf(UsernameNotFoundException.class);
    }
}
