package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

class AuthTokenFilterTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDoFilterInternal_WithValidJwt() throws Exception {
        // Arrange
        String jwt = "valid.jwt.token";
        String username = "testUser";
        UserDetails userDetails = User.withUsername(username).password("password").authorities("ROLE_USER").build();

        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(jwtUtils.validateJwtToken(jwt)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(jwt)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(jwtUtils, times(1)).validateJwtToken(jwt);
        verify(jwtUtils, times(1)).getUserNameFromJwtToken(jwt);
        verify(userDetailsService, times(1)).loadUserByUsername(username);
        assertThat(SecurityContextHolder.getContext().getAuthentication())
                .isInstanceOf(UsernamePasswordAuthenticationToken.class)
                .satisfies(auth -> {
                    UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) auth;
                    assertThat(authentication.getPrincipal()).isEqualTo(userDetails);
                });

        // Verify that the filter chain proceeds
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void testDoFilterInternal_WithInvalidJwt() throws Exception {
        // Arrange
        String jwt = "invalid.jwt.token";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);
        when(jwtUtils.validateJwtToken(jwt)).thenReturn(false);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(jwtUtils, times(1)).validateJwtToken(jwt);
        verify(jwtUtils, never()).getUserNameFromJwtToken(jwt);
        verify(userDetailsService, never()).loadUserByUsername(anyString());
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();

        // Verify that the filter chain proceeds
        verify(filterChain, times(1)).doFilter(request, response);
    }

    // @Test
    // void testParseJwt_WithValidHeader() {
    // // Arrange
    // String jwt = "valid.jwt.token";
    // when(request.getHeader("Authorization")).thenReturn("Bearer " + jwt);

    // // Act
    // String parsedJwt = authTokenFilter.parseJwt(request);

    // // Assert
    // assertThat(parsedJwt).isEqualTo(jwt);
    // }

    // @Test
    // void testParseJwt_WithInvalidHeader() {
    // // Arrange
    // when(request.getHeader("Authorization")).thenReturn("InvalidHeader");

    // // Act
    // String parsedJwt = authTokenFilter.parseJwt(request);

    // // Assert
    // assertThat(parsedJwt).isNull();
    // }
}
