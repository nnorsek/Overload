package com.overload.server.controller;

import com.overload.server.DTOs.sessions.requests.AddClientRequest;
import com.overload.server.DTOs.sessions.requests.CreateSessionRequest;
import com.overload.server.security.UserDetailsImpl;
import com.overload.server.service.SessionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SessionControllerTest {

    @Mock SessionService sessionService;
    @InjectMocks SessionController sessionController;

    private final UserDetailsImpl trainer = new UserDetailsImpl(1L, "trainer@test.com", "pass");

    private CreateSessionRequest validRequest() {
        return new CreateSessionRequest(
                List.of(2L),
                3L,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(1),
                null
        );
    }

    @Test
    void createSession_returnsCreated() {
        CreateSessionRequest req = validRequest();

        ResponseEntity<Void> response = sessionController.createSession(req, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        verify(sessionService).createSession(req, 1L);
    }

    @Test
    void updateSession_returnsOk() {
        CreateSessionRequest req = validRequest();

        ResponseEntity<Void> response = sessionController.updateSession(10L, req, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(sessionService).updateSession(10L, req, 1L);
    }

    @Test
    void deleteSession_returnsNoContent() {
        ResponseEntity<Void> response = sessionController.deleteSession(10L, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(sessionService).deleteSession(10L, 1L);
    }

    @Test
    void addClientToSession_returnsOk() {
        AddClientRequest req = new AddClientRequest(2L);

        ResponseEntity<Void> response = sessionController.addClientToSession(10L, req, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(sessionService).addClientToSession(10L, 2L, 1L);
    }

    @Test
    void removeClientFromSession_returnsNoContent() {
        ResponseEntity<Void> response = sessionController.removeClientFromSession(10L, 2L, trainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(sessionService).removeClientFromSession(10L, 2L, 1L);
    }
}
