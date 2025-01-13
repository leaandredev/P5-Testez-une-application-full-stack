package com.openclassrooms.starterjwt.security.services;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Collection;
import java.util.HashSet;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

class UserDetailsImplTest {

    private UserDetailsImpl userDetails;

    @BeforeEach
    public void beforeEach() {
        userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testuser")
                .firstName("John")
                .lastName("Doe")
                .admin(true)
                .password("password123")
                .build();
    }

    @Test
    public void testGetter() {
        // Assert
        assertThat(userDetails.getId()).isEqualTo(1L);
        assertThat(userDetails.getUsername()).isEqualTo("testuser");
        assertThat(userDetails.getFirstName()).isEqualTo("John");
        assertThat(userDetails.getLastName()).isEqualTo("Doe");
        assertThat(userDetails.getPassword()).isEqualTo("password123");
        assertThat(userDetails.getAdmin()).isTrue();
    }

    @Test
    public void testGetAuthorities() {
        // Act
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        // Assert
        assertThat(authorities).isNotNull();
        assertThat(authorities).isInstanceOf(HashSet.class);
        assertThat(authorities).isEmpty();
    }

    @Test
    public void testIsAccountNonExpired() {
        assertThat(userDetails.isAccountNonExpired()).isTrue();
    }

    @Test
    public void testIsAccountNonLocked() {
        assertThat(userDetails.isAccountNonLocked()).isTrue();
    }

    @Test
    public void testIsCredentialsNonExpired() {
        assertThat(userDetails.isCredentialsNonExpired()).isTrue();
    }

    @Test
    public void testIsEnabled() {
        assertThat(userDetails.isEnabled()).isTrue();
    }

    @Test
    public void testEqualsSameObject() {
        assertThat(userDetails).isEqualTo(userDetails);
    }

    @Test
    public void testEqualsDifferentObject() {
        // Arrange
        UserDetailsImpl otherUserDetails = UserDetailsImpl.builder()
                .id(2L)
                .username("otheruser")
                .build();

        // Assert
        assertThat(userDetails).isNotEqualTo(otherUserDetails);
    }

    @Test
    public void testEqualsSameId() {
        UserDetailsImpl sameIdUser = UserDetailsImpl.builder()
                .id(1L)
                .username("differentuser")
                .build();

        assertThat(userDetails).isEqualTo(sameIdUser);
    }
}
