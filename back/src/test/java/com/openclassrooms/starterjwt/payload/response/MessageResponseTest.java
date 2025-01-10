package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class MessageResponseTest {

    @Test
    void testConstructorAndGetter() {
        // Arrange
        String expectedMessage = "Operation successful";

        // Act
        MessageResponse messageResponse = new MessageResponse(expectedMessage);

        // Assert
        assertThat(messageResponse.getMessage()).isEqualTo(expectedMessage);
    }

    @Test
    void testSetter() {
        // Arrange
        MessageResponse messageResponse = new MessageResponse(null);

        // Act
        String newMessage = "An error occurred";
        messageResponse.setMessage(newMessage);

        // Assert
        assertThat(messageResponse.getMessage()).isEqualTo(newMessage);
    }
}