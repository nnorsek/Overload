package com.overload.server.service;

import com.overload.server.DTOs.clients.requests.AssignClientToTrainerRequest;
import com.overload.server.DTOs.trainers.requests.CreateTrainerRequest;
import com.overload.server.DTOs.trainers.requests.LoginTrainerRequest;
import com.overload.server.DTOs.trainers.responses.CreateTrainerResponse;
import com.overload.server.DTOs.trainers.responses.LoginTrainerResponse;
import com.overload.server.model.Client;
import com.overload.server.model.Trainer;
import com.overload.server.repo.ClientRepo;
import com.overload.server.repo.TrainerRepo;
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
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrainerServiceTest {

    @Mock TrainerRepo trainerRepo;
    @Mock ClientRepo clientRepo;
    @Mock JwtUtil jwtUtil;
    @Mock PasswordEncoder passwordEncoder;
    @InjectMocks TrainerService trainerService;

    private static final Long TRAINER_ID = 1L;
    private static final Long CLIENT_ID = 2L;
    private static final String EMAIL = "trainer@example.com";
    private static final String PASSWORD = "Password1!";
    private static final String ENCODED_PASSWORD = "encoded_password";
    private static final String TOKEN = "jwt.token.here";

    private Trainer savedTrainer;
    private Client client;
    private CreateTrainerRequest createRequest;
    private LoginTrainerRequest loginRequest;

    @BeforeEach
    void setUp() {
        savedTrainer = new Trainer();
        savedTrainer.setTrainerId(TRAINER_ID);
        savedTrainer.setFirstName("John");
        savedTrainer.setLastName("Doe");
        savedTrainer.setEmail(EMAIL);
        savedTrainer.setGender("Male");
        savedTrainer.setPasswordHash(ENCODED_PASSWORD);

        client = new Client();
        client.setClientId(CLIENT_ID);

        createRequest = new CreateTrainerRequest(
                "John",
                "Doe",
                LocalDate.of(1990, 1, 1),
                "Male",
                null,
                EMAIL,
                PASSWORD
        );

        loginRequest = new LoginTrainerRequest(EMAIL, PASSWORD);
    }

    // --- createTrainer ---

    @Test
    void createTrainer_success_encodesPasswordSavesTrainerAndReturnsToken() {
        when(trainerRepo.findByEmail(EMAIL)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(PASSWORD)).thenReturn(ENCODED_PASSWORD);
        when(trainerRepo.save(any(Trainer.class))).thenReturn(savedTrainer);
        when(jwtUtil.generateToken(EMAIL, "ROLE_TRAINER", TRAINER_ID)).thenReturn(TOKEN);

        CreateTrainerResponse response = trainerService.createTrainer(createRequest);

        verify(passwordEncoder).encode(PASSWORD);
        verify(trainerRepo).save(any(Trainer.class));
        verify(jwtUtil).generateToken(EMAIL, "ROLE_TRAINER", TRAINER_ID);

        assertThat(response.trainerId()).isEqualTo(TRAINER_ID);
        assertThat(response.email()).isEqualTo(EMAIL);
        assertThat(response.token()).isEqualTo(TOKEN);
        assertThat(response.firstName()).isEqualTo("John");
        assertThat(response.lastName()).isEqualTo("Doe");
    }

    @Test
    void createTrainer_duplicateEmail_throwsConflict() {
        when(trainerRepo.findByEmail(EMAIL)).thenReturn(Optional.of(savedTrainer));

        assertThatThrownBy(() -> trainerService.createTrainer(createRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Email already exists");

        verify(trainerRepo, never()).save(any());
    }

    // --- loginTrainer ---

    @Test
    void loginTrainer_correctCredentials_returnsTokenResponse() {
        when(trainerRepo.findByEmail(EMAIL)).thenReturn(Optional.of(savedTrainer));
        when(passwordEncoder.matches(PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
        when(jwtUtil.generateToken(EMAIL, "ROLE_TRAINER", TRAINER_ID)).thenReturn(TOKEN);

        LoginTrainerResponse response = trainerService.loginTrainer(loginRequest);

        assertThat(response.id()).isEqualTo(TRAINER_ID);
        assertThat(response.email()).isEqualTo(EMAIL);
        assertThat(response.token()).isEqualTo(TOKEN);
        assertThat(response.role()).isEqualTo("ROLE_TRAINER");
    }

    @Test
    void loginTrainer_wrongPassword_throwsUnauthorized() {
        when(trainerRepo.findByEmail(EMAIL)).thenReturn(Optional.of(savedTrainer));
        when(passwordEncoder.matches(PASSWORD, ENCODED_PASSWORD)).thenReturn(false);

        assertThatThrownBy(() -> trainerService.loginTrainer(loginRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Invalid email or password");

        verify(jwtUtil, never()).generateToken(anyString(), anyString(), any());
    }

    @Test
    void loginTrainer_emailNotFound_throwsUnauthorized() {
        when(trainerRepo.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> trainerService.loginTrainer(loginRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Invalid email or password");
    }

    // --- assignClientToTrainer ---

    @Test
    void assignClientToTrainer_success_linksClientToTrainer() {
        AssignClientToTrainerRequest req = new AssignClientToTrainerRequest(CLIENT_ID, TRAINER_ID);

        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.of(savedTrainer));
        when(clientRepo.findById(CLIENT_ID)).thenReturn(Optional.of(client));
        when(trainerRepo.save(savedTrainer)).thenReturn(savedTrainer);

        trainerService.assignClientToTrainer(req);

        verify(trainerRepo).save(savedTrainer);
        assertThat(savedTrainer.getClients()).contains(client);
    }

    @Test
    void assignClientToTrainer_trainerNotFound_throws() {
        AssignClientToTrainerRequest req = new AssignClientToTrainerRequest(CLIENT_ID, TRAINER_ID);

        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> trainerService.assignClientToTrainer(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Trainer not found");

        verify(trainerRepo, never()).save(any());
    }

    @Test
    void assignClientToTrainer_clientNotFound_throws() {
        AssignClientToTrainerRequest req = new AssignClientToTrainerRequest(CLIENT_ID, TRAINER_ID);

        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.of(savedTrainer));
        when(clientRepo.findById(CLIENT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> trainerService.assignClientToTrainer(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Client not found");

        verify(trainerRepo, never()).save(any());
    }
}
