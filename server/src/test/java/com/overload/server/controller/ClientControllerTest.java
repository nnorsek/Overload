package com.overload.server.controller;

import com.overload.server.DTOs.clients.requests.ClientLoginRequest;
import com.overload.server.DTOs.clients.requests.CreateClientRequest;
import com.overload.server.DTOs.clients.responses.ClientByIdResponse;
import com.overload.server.DTOs.clients.responses.ClientLoginResponse;
import com.overload.server.DTOs.clients.responses.ClientsByTrainerIdResponse;
import com.overload.server.DTOs.clients.responses.CreateClientResponse;
import com.overload.server.security.UserDetailsImpl;
import com.overload.server.service.ClientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClientControllerTest {

    @Mock ClientService clientService;
    @InjectMocks ClientController clientController;

    private static final Long CLIENT_ID = 1L;
    private static final Long TRAINER_ID = 1L;
    private static final String EMAIL = "client@example.com";
    private static final String TOKEN = "jwt-token";

    private UserDetailsImpl trainerPrincipal;

    @BeforeEach
    void setUp() {
        trainerPrincipal = new UserDetailsImpl(TRAINER_ID, "t@t.com", "pw");
    }

    // --- POST /client/create ---

    @Test
    void createClient_validRequest_returns201WithBody() {
        CreateClientRequest req = new CreateClientRequest(
                "John", null, "Doe",
                LocalDate.of(1990, 1, 1), "Male",
                EMAIL, "Password1!", 80.0f, 180, "Build muscle", null
        );
        CreateClientResponse serviceResponse = new CreateClientResponse(
                CLIENT_ID, "John", "Doe", EMAIL, 80.0f, 180, "Male", TOKEN
        );
        when(clientService.createClient(req)).thenReturn(serviceResponse);

        ResponseEntity<CreateClientResponse> response = clientController.createClient(req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(serviceResponse);
        verify(clientService).createClient(req);
    }

    // --- GET /client/all ---

    @Test
    void getMyClients_authenticatedTrainer_returns200WithClientList() {
        ClientsByTrainerIdResponse clientSummary = new ClientsByTrainerIdResponse(
                CLIENT_ID, "John", "Doe", EMAIL,
                LocalDate.of(1990, 1, 1), "Male", 80.0f, 78.0f,
                180, "Build muscle", null, LocalDateTime.now()
        );
        when(clientService.getAllClientByTrainerId(TRAINER_ID)).thenReturn(List.of(clientSummary));

        ResponseEntity<List<ClientsByTrainerIdResponse>> response = clientController.getMyClients(trainerPrincipal);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).clientId()).isEqualTo(CLIENT_ID);
        verify(clientService).getAllClientByTrainerId(TRAINER_ID);
    }

    // --- GET /client/{id} ---

    @Test
    void getClientByID_existingId_returns200WithBody() {
        ClientByIdResponse serviceResponse = new ClientByIdResponse(
                CLIENT_ID, "John", "Doe", "Build muscle",
                80.0f, 78.0f, 180, EMAIL, null, LocalDate.of(1990, 1, 1)
        );
        when(clientService.getClientById(CLIENT_ID)).thenReturn(serviceResponse);

        ResponseEntity<ClientByIdResponse> response = clientController.getClientByID(CLIENT_ID);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(serviceResponse);
        verify(clientService).getClientById(CLIENT_ID);
    }

    // --- POST /client/login ---

    @Test
    void loginClient_validCredentials_returns200WithToken() {
        ClientLoginRequest req = new ClientLoginRequest(EMAIL, "Password1!");
        ClientLoginResponse serviceResponse = new ClientLoginResponse(CLIENT_ID, EMAIL, TOKEN, "ROLE_CLIENT");
        when(clientService.loginClient(req)).thenReturn(serviceResponse);

        ResponseEntity<ClientLoginResponse> response = clientController.loginClient(req);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(serviceResponse);
        assertThat(response.getBody().token()).isEqualTo(TOKEN);
        verify(clientService).loginClient(req);
    }
}
