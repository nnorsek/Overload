package com.overload.server.service;

import com.overload.server.DTOs.sessions.requests.CreateSessionRequest;
import com.overload.server.DTOs.sessions.responses.TrainerSessionResponse;
import com.overload.server.enums.SessionStatus;
import com.overload.server.model.Client;
import com.overload.server.model.Session;
import com.overload.server.model.Trainer;
import com.overload.server.model.Workout;
import com.overload.server.repo.ClientRepo;
import com.overload.server.repo.SessionRepo;
import com.overload.server.repo.TrainerRepo;
import com.overload.server.repo.WorkoutRepo;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock SessionRepo sessionRepo;
    @Mock ClientRepo clientRepo;
    @Mock TrainerRepo trainerRepo;
    @Mock WorkoutRepo workoutRepo;
    @InjectMocks SessionService sessionService;

    private static final Long TRAINER_ID = 1L;
    private static final Long SESSION_ID = 10L;
    private static final Long CLIENT_ID = 2L;
    private static final Long WORKOUT_ID = 3L;

    private Client client;
    private Trainer trainer;
    private Workout workout;
    private Session session;
    private CreateSessionRequest validRequest;

    @BeforeEach
    void setUp() {
        client = new Client();
        client.setClientId(CLIENT_ID);

        trainer = new Trainer();
        trainer.setTrainerId(TRAINER_ID);

        workout = new Workout();
        workout.setWorkoutId(WORKOUT_ID);

        session = new Session();
        session.setSessionId(SESSION_ID);
        session.setTrainer(trainer);
        session.setWorkout(workout);
        session.setStatus(SessionStatus.PENDING);
        session.setScheduledStart(LocalDateTime.now().plusDays(1));
        session.setScheduledEnd(LocalDateTime.now().plusDays(1).plusHours(1));
        session.setClients(new HashSet<>(Set.of(client)));

        validRequest = new CreateSessionRequest(
                List.of(CLIENT_ID),
                WORKOUT_ID,
                LocalDateTime.now().plusDays(1),
                LocalDateTime.now().plusDays(1).plusHours(1),
                "Test notes"
        );
    }

    // --- createSession ---

    @Test
    void createSession_success() {
        when(clientRepo.findAllById(List.of(CLIENT_ID))).thenReturn(List.of(client));
        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.of(trainer));
        when(workoutRepo.findById(WORKOUT_ID)).thenReturn(Optional.of(workout));

        assertDoesNotThrow(() -> sessionService.createSession(validRequest, TRAINER_ID));
        verify(sessionRepo).save(any(Session.class));
    }

    @Test
    void createSession_clientNotFound_throws() {
        when(clientRepo.findAllById(List.of(CLIENT_ID))).thenReturn(List.of());

        assertThatThrownBy(() -> sessionService.createSession(validRequest, TRAINER_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("One or more clients not found");
    }

    @Test
    void createSession_trainerNotFound_throws() {
        when(clientRepo.findAllById(List.of(CLIENT_ID))).thenReturn(List.of(client));
        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.createSession(validRequest, TRAINER_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Trainer not found");
    }

    @Test
    void createSession_workoutNotFound_throws() {
        when(clientRepo.findAllById(List.of(CLIENT_ID))).thenReturn(List.of(client));
        when(trainerRepo.findById(TRAINER_ID)).thenReturn(Optional.of(trainer));
        when(workoutRepo.findById(WORKOUT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.createSession(validRequest, TRAINER_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Workout not found");
    }

    // --- getSessions ---

    @Test
    void getSessions_returnsMappedResponses() {
        when(sessionRepo.findAllByTrainer_TrainerId(TRAINER_ID)).thenReturn(List.of(session));

        List<TrainerSessionResponse> result = sessionService.getSessions(TRAINER_ID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).sessionId()).isEqualTo(SESSION_ID);
        assertThat(result.get(0).clients()).hasSize(1);
        assertThat(result.get(0).clients().get(0).clientId()).isEqualTo(CLIENT_ID);
    }

    @Test
    void getSessions_emptyClients_returnsEmptyClientList() {
        session.setClients(new HashSet<>());
        when(sessionRepo.findAllByTrainer_TrainerId(TRAINER_ID)).thenReturn(List.of(session));

        List<TrainerSessionResponse> result = sessionService.getSessions(TRAINER_ID);

        assertThat(result.get(0).clients()).isEmpty();
    }

    // --- updateSession ---

    @Test
    void updateSession_success() {
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.of(session));
        when(workoutRepo.findById(WORKOUT_ID)).thenReturn(Optional.of(workout));

        assertDoesNotThrow(() -> sessionService.updateSession(SESSION_ID, validRequest, TRAINER_ID));
    }

    @Test
    void updateSession_sessionNotFound_throws() {
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.updateSession(SESSION_ID, validRequest, TRAINER_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Session not found");
    }

    @Test
    void updateSession_forbidden_throws() {
        Trainer otherTrainer = new Trainer();
        otherTrainer.setTrainerId(99L);
        session.setTrainer(otherTrainer);
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> sessionService.updateSession(SESSION_ID, validRequest, TRAINER_ID))
                .isInstanceOf(ResponseStatusException.class);
    }

    // --- deleteSession ---

    @Test
    void deleteSession_success() {
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.of(session));

        assertDoesNotThrow(() -> sessionService.deleteSession(SESSION_ID, TRAINER_ID));
        verify(sessionRepo).delete(session);
    }

    @Test
    void deleteSession_sessionNotFound_throws() {
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.deleteSession(SESSION_ID, TRAINER_ID))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void deleteSession_forbidden_throws() {
        Trainer otherTrainer = new Trainer();
        otherTrainer.setTrainerId(99L);
        session.setTrainer(otherTrainer);
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> sessionService.deleteSession(SESSION_ID, TRAINER_ID))
                .isInstanceOf(ResponseStatusException.class);
    }

    // --- addClientToSession ---

    @Test
    void addClientToSession_success() {
        Client newClient = new Client();
        newClient.setClientId(5L);
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.of(session));
        when(clientRepo.findById(5L)).thenReturn(Optional.of(newClient));

        assertDoesNotThrow(() -> sessionService.addClientToSession(SESSION_ID, 5L, TRAINER_ID));
        assertThat(session.getClients()).contains(newClient);
    }

    @Test
    void addClientToSession_sessionNotFound_throws() {
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.addClientToSession(SESSION_ID, CLIENT_ID, TRAINER_ID))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void addClientToSession_forbidden_throws() {
        Trainer otherTrainer = new Trainer();
        otherTrainer.setTrainerId(99L);
        session.setTrainer(otherTrainer);
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> sessionService.addClientToSession(SESSION_ID, CLIENT_ID, TRAINER_ID))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void addClientToSession_clientNotFound_throws() {
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.of(session));
        when(clientRepo.findById(CLIENT_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.addClientToSession(SESSION_ID, CLIENT_ID, TRAINER_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Client not found");
    }

    // --- removeClientFromSession ---

    @Test
    void removeClientFromSession_success() {
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.of(session));

        assertDoesNotThrow(() -> sessionService.removeClientFromSession(SESSION_ID, CLIENT_ID, TRAINER_ID));
        assertThat(session.getClients()).doesNotContain(client);
    }

    @Test
    void removeClientFromSession_sessionNotFound_throws() {
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.removeClientFromSession(SESSION_ID, CLIENT_ID, TRAINER_ID))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void removeClientFromSession_forbidden_throws() {
        Trainer otherTrainer = new Trainer();
        otherTrainer.setTrainerId(99L);
        session.setTrainer(otherTrainer);
        when(sessionRepo.findById(SESSION_ID)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> sessionService.removeClientFromSession(SESSION_ID, CLIENT_ID, TRAINER_ID))
                .isInstanceOf(ResponseStatusException.class);
    }
}
