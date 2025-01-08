package com.openclassrooms.starterjwt.security.jwt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.lenient;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@ExtendWith(MockitoExtension.class)

public class JwtUtilsTest {

    private TestLogAppender logAppender;

    @Mock
    private Authentication authentication;

    @Mock
    private UserDetailsImpl userDetails;

    @InjectMocks
    private JwtUtils jwtUtils;

    @BeforeEach
    public void beforeEach() {
        // init jwtUtils private fields
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "testSecretKey");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000);

        lenient().when(authentication.getPrincipal()).thenReturn(userDetails);
        lenient().when(userDetails.getUsername()).thenReturn("testUsername");

        logAppender = new TestLogAppender();
        logAppender.start();
        Logger logger = (Logger) LoggerFactory.getLogger(JwtUtils.class);
        logger.addAppender(logAppender);
    }

    @Test
    public void testGenerateJwtToken() {
        // Act
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert
        assertThat(token).isNotNull();
    }

    @Test
    public void testGetUsernameFromJwtToken() {
        // Arrange
        String token = jwtUtils.generateJwtToken(authentication);

        // Act
        String userName = jwtUtils.getUserNameFromJwtToken(token);

        // Assert
        assertThat(userName).isNotNull();
        assertThat(userName).isEqualTo("testUsername");
    }

    @Test
    public void testValidateJwtToken() {
        // Arrange
        String token = jwtUtils.generateJwtToken(authentication);

        // Act
        boolean tokenValidation = jwtUtils.validateJwtToken(token);

        // Assert
        assertThat(tokenValidation).isNotNull();
        assertThat(tokenValidation).isTrue();
    }

    @Test
    public void testValidateJwtTokenWithSignatureException() {
        // Arrange
        String token = jwtUtils.generateJwtToken(authentication);
        String modifiedToken = token + "modified";

        // Act
        boolean tokenValidation = jwtUtils.validateJwtToken(modifiedToken);

        // Assert
        assertThat(tokenValidation).isNotNull();
        assertThat(tokenValidation).isFalse();
        assertThat(logAppender.getLogs()).contains("Invalid JWT signature");
    }

    @Test
    public void testValidateJwtTokenWithMalformedJwtException() {
        // Arrange
        String token = "invalid.token";

        // Act
        boolean tokenValidation = jwtUtils.validateJwtToken(token);

        // Assert
        assertThat(tokenValidation).isNotNull();
        assertThat(tokenValidation).isFalse();
        assertThat(logAppender.getLogs()).contains("Invalid JWT token");
    }

    @Test
    public void testValidateJwtTokenWithExpiredJwtException() throws InterruptedException {
        // Arrange
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 1000); // 1 second expiration

        // Act
        String token = jwtUtils.generateJwtToken(authentication);
        Thread.sleep(1500);
        boolean tokenValidation = jwtUtils.validateJwtToken(token);

        // Assert
        assertThat(tokenValidation).isNotNull();
        assertThat(tokenValidation).isFalse();
        assertThat(logAppender.getLogs()).contains("JWT token is expired");

    }

    @Test
    public void testValidateJwtTokenWithUnsupportedToken() {
        // Arrange
        String unsupportedToken = Jwts.builder()
                .setSubject("user")
                .signWith(SignatureAlgorithm.HS384, "wrongKey") // Mauvais algorithme
                .compact();

        // Act
        boolean tokenValidation = jwtUtils.validateJwtToken(unsupportedToken);

        // Assert
        assertThat(tokenValidation).isNotNull();
        assertThat(tokenValidation).isFalse();
    }

    @Test
    public void testValidateJwtTokenWithIllegalJwtException() {
        // Act
        boolean tokenValidation = jwtUtils.validateJwtToken(null);

        // Assert
        assertThat(tokenValidation).isNotNull();
        assertThat(tokenValidation).isFalse();
        assertThat(logAppender.getLogs()).contains("JWT claims string is empty");
    }

    // Custom appender to capture logs
    public static class TestLogAppender extends AppenderBase<ILoggingEvent> {
        private final StringBuilder logs = new StringBuilder();

        @Override
        protected void append(ILoggingEvent eventObject) {
            logs.append(eventObject.getFormattedMessage());
        }

        public String getLogs() {
            return logs.toString();
        }
    }
}
