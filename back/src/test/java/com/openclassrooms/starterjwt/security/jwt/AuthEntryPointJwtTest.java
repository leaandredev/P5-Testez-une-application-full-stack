package com.openclassrooms.starterjwt.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

class AuthEntryPointJwtTest {

    private AuthEntryPointJwt authEntryPointJwt;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void beforeEach() {
        MockitoAnnotations.openMocks(this);
        authEntryPointJwt = new AuthEntryPointJwt();
    }

    @Test
    public void testCommence() throws Exception {
        // Arrange
        String servletPath = "/test/path";
        String exceptionMessage = "Access denied";

        when(request.getServletPath()).thenReturn(servletPath);
        when(authException.getMessage()).thenReturn(exceptionMessage);

        // Mock OutputStream
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ServletOutputStream servletOutputStream = new ServletOutputStream() {
            @Override
            public void write(int b) throws IOException {
                outputStream.write(b);
            }

            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setWriteListener(WriteListener listener) {
                // Not necessary
            }
        };
        when(response.getOutputStream()).thenReturn(servletOutputStream);

        // Act
        authEntryPointJwt.commence(request, response, authException);

        // Assert
        verify(response, times(1)).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response, times(1)).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // Check JSON content
        String jsonResponse = outputStream.toString();
        Map<String, Object> responseBody = objectMapper.readValue(jsonResponse, Map.class);

        assertThat(responseBody)
                .containsEntry("status", HttpServletResponse.SC_UNAUTHORIZED)
                .containsEntry("error", "Unauthorized")
                .containsEntry("message", exceptionMessage)
                .containsEntry("path", servletPath);
    }

}
