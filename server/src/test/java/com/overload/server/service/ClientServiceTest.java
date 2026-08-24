package com.overload.server.service;

import com.overload.server.DTOs.clients.requests.ClientLoginRequest;
import com.overload.server.DTOs.clients.requests.CreateClientRequest;
import com.overload.server.DTOs.clients.responses.ClientByIdResponse;
import com.overload.server.DTOs.clients.responses.ClientLoginResponse;
import com.overload.server.DTOs.clients.responses.ClientsByTrainerIdResponse;
import com.overload.server.DTOs.clients.responses.CreateClientResponse;
import com.overload.server.model.Client;
import com.overload.server.repo.ClientRepo;
import com.overload.server.utils.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock ClientRepo clientRepo;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtUtil jwtUtil;
    @InjectMocks ClientService clientService;

    private static final Long CLIENT_ID = 1L;
    private static final Long TRAINER_ID = 5L;
    private static final String EMAIL = "client@example.com";
    private static final String PASSWORD = "Password1!";
    private static final String HASHED = "hashed-password";
    private static final String TOKEN = "jwt-token";

    private Client client;
    private CreateClientRequest createRequest;
    private ClientLoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        client = new Client();
        client.setClientId(CLIENT_ID);
        client.setFirstName("John");
        client.setLastName("Doe");
        client.setEmail(EMAIL);
        client.setPasswordHash(HASHED);
        client.setGender("Male");
        client.setDateOfBirth(LocalDate.of(1990, 1, 1));
        client.setStartingWeight(80.0f);
        client.setCurrentWeight(80.0f);
        client.setHeight(180);
        client.setGoal("Build muscle");

        createRequest = new CreateClientRequest(
                "John",
                null,
                "Doe",
                LocalDate.of(1990, 1, 1),
                "Male",
                EMAIL,
                PASSWORD,
                80.0f,
                180,
                "Build muscle",
                null
        );

        loginRequest = new ClientLoginRequest(EMAIL, PASSWORD);
    }

    // --- createClient ---

    @Test
    void createClient_success_savesClientAndReturnsToken() {
        when(clientRepo.findByEmail(EMAIL)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(PASSWORD)).thenReturn(HASHED);
        when(clientRepo.save(any(Client.class))).thenReturn(client);
        when(jwtUtil.generateToken(EMAIL, "ROLE_CLIENT", CLIENT_ID)).thenReturn(TOKEN);

        CreateClientResponse response = clientService.createClient(createRequest);

        assertThat(response.clientId()).isEqualTo(CLIENT_ID);
        assertThat(response.email()).isEqualTo(EMAIL);
        assertThat(response.token()).isEqualTo(TOKEN);
        verify(clientRepo).save(any(Client.class));
        verify(jwtUtil).generateToken(EMAIL, "ROLE_CLIENT", CLIENT_ID);
    }

    @Test
    void createClient_duplicateEmail_throwsConflict() {
        when(clientRepo.findByEmail(EMAIL)).thenReturn(Optional.of(client));

        assertThatThrownBy(() -> clientService.createClient(createRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Email already exists");

        verify(clientRepo, never()).save(any());
    }

    // --- getClientById ---

    @Test
    void getClientById_found_returnsDto() {
        when(clientRepo.findById(CLIENT_ID)).thenReturn(Optional.of(client));

        ClientByIdResponse response = clientService.getClientById(CLIENT_ID);

        assertThat(response.clientId()).isEqualTo(CLIENT_ID);
        assertThat(response.firstName()).isEqualTo("John");
        assertThat(response.email()).isEqualTo(EMAIL);
    }

    @Test
    void getClientById_notFound_throwsRuntimeException() {
        when(clientRepo.findById(CLIENT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> clientService.getClientById(CLIENT_ID))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Client not found with id " + CLIENT_ID);
    }

    // --- getAllClientByTrainerId ---

    @Test
    void getAllClientByTrainerId_returnsMappedList() {
        when(clientRepo.findByTrainerTrainerId(TRAINER_ID)).thenReturn(List.of(client));

        List<ClientsByTrainerIdResponse> result = clientService.getAllClientByTrainerId(TRAINER_ID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).clientId()).isEqualTo(CLIENT_ID);
        assertThat(result.get(0).email()).isEqualTo(EMAIL);
    }

    @Test
    void getAllClientByTrainerId_noClients_returnsEmptyList() {
        when(clientRepo.findByTrainerTrainerId(TRAINER_ID)).thenReturn(List.of());

        List<ClientsByTrainerIdResponse> result = clientService.getAllClientByTrainerId(TRAINER_ID);

        assertThat(result).isEmpty();
    }

    // --- loginClient ---

    @Test
    void loginClient_correctPassword_returnsTokenResponse() {
        when(clientRepo.findByEmail(EMAIL)).thenReturn(Optional.of(client));
        when(passwordEncoder.matches(PASSWORD, HASHED)).thenReturn(true);
        when(jwtUtil.generateToken(EMAIL, "ROLE_CLIENT", CLIENT_ID)).thenReturn(TOKEN);

        ClientLoginResponse response = clientService.loginClient(loginRequest);

        assertThat(response.id()).isEqualTo(CLIENT_ID);
        assertThat(response.email()).isEqualTo(EMAIL);
        assertThat(response.token()).isEqualTo(TOKEN);
        assertThat(response.role()).isEqualTo("ROLE_CLIENT");
    }

    @Test
    void loginClient_wrongPassword_throwsUnauthorized() {
        when(clientRepo.findByEmail(EMAIL)).thenReturn(Optional.of(client));
        when(passwordEncoder.matches(PASSWORD, HASHED)).thenReturn(false);

        assertThatThrownBy(() -> clientService.loginClient(loginRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Invalid email or password");

        verify(jwtUtil, never()).generateToken(anyString(), anyString(), any());
    }

    @Test
    void loginClient_clientNotFound_throwsUnauthorized() {
        when(clientRepo.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> clientService.loginClient(loginRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Invalid email or password");
    }
}
