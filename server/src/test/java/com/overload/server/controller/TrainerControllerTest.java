package com.overload.server.controller;

import com.overload.server.DTOs.clients.requests.AssignClientToTrainerRequest;
import com.overload.server.DTOs.sessions.responses.TrainerSessionResponse;
import com.overload.server.DTOs.trainers.requests.CreateTrainerRequest;
import com.overload.server.DTOs.trainers.requests.LoginTrainerRequest;
import com.overload.server.DTOs.trainers.responses.CreateTrainerResponse;
import com.overload.server.DTOs.trainers.responses.LoginTrainerResponse;
import com.overload.server.security.UserDetailsImpl;
import com.overload.server.service.SessionService;
import com.overload.server.service.TrainerService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TrainerControllerTest {

    @Mock TrainerService trainerService;
    @Mock SessionService sessionService;
    @InjectMocks TrainerController trainerController;

    private final UserDetailsImpl authenticatedTrainer = new UserDetailsImpl(1L, "trainer@example.com", "pass");

    @Test
    void createTrainer_returnsCreated() {
        CreateTrainerRequest req = new CreateTrainerRequest(
                "John", "Doe", LocalDate.of(1990, 1, 1), "Male", null,
                "trainer@example.com", "Password1!"
        );
        CreateTrainerResponse serviceResponse = new CreateTrainerResponse(
                1L, "John", "Doe", "trainer@example.com", "Male", "token"
        );
        when(trainerService.createTrainer(req)).thenReturn(serviceResponse);

        ResponseEntity<CreateTrainerResponse> response = trainerController.createTrainer(req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(serviceResponse);
        verify(trainerService).createTrainer(req);
    }

    @Test
    void clientToTrainer_returnsOk() {
        AssignClientToTrainerRequest req = new AssignClientToTrainerRequest(2L, 1L);

        ResponseEntity<?> response = trainerController.clientToTrainer(req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(trainerService).assignClientToTrainer(req);
    }

    @Test
    void getSessionsByTrainerID_returnsOkWithSessions() {
        List<TrainerSessionResponse> sessions = List.of();
        when(sessionService.getSessions(1L)).thenReturn(sessions);

        ResponseEntity<List<TrainerSessionResponse>> response =
                trainerController.getSessionsByTrainerID(authenticatedTrainer);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(sessions);
        verify(sessionService).getSessions(1L);
    }

    @Test
    void loginTrainer_returnsOkWithTokenResponse() {
        LoginTrainerRequest req = new LoginTrainerRequest("trainer@example.com", "Password1!");
        LoginTrainerResponse serviceResponse = new LoginTrainerResponse(
                1L, "trainer@example.com", "jwt.token", "ROLE_TRAINER"
        );
        when(trainerService.loginTrainer(req)).thenReturn(serviceResponse);

        ResponseEntity<LoginTrainerResponse> response = trainerController.loginTrainer(req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(serviceResponse);
        verify(trainerService).loginTrainer(req);
    }
}
