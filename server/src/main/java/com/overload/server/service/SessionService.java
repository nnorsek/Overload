package com.overload.server.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepo sessionRepo;
    private final ClientRepo clientRepo;
    private final TrainerRepo trainerRepo;
    private final WorkoutRepo workoutRepo;

    @Transactional
    public void createSession (CreateSessionRequest req, Long trainerId) {
        Client client = clientRepo.findById(req.clientId())
            .orElseThrow(() -> new EntityNotFoundException("Client not found: " + req.clientId()));

        Trainer trainer = trainerRepo.findById(trainerId)
            .orElseThrow(() -> new EntityNotFoundException("Trainer not found: " + trainerId));

        Workout workout = workoutRepo.findById(req.workoutId())
            .orElseThrow(() -> new EntityNotFoundException("Workout not found: " + req.workoutId()));
        
        Session session = new Session();
        session.setClient(client);
        session.setTrainer(trainer);
        session.setWorkout(workout);
        session.setScheduledStart(req.scheduledStart());
        session.setScheduledEnd(req.scheduledEnd());
        session.setStatus(SessionStatus.PENDING);
        session.setNotes(req.notes());
        
        sessionRepo.save(session);
    }

    @Transactional
    public List<TrainerSessionResponse> getSessions (Long trainerId) {
        return sessionRepo.findAllByTrainer_TrainerId(trainerId)
                .stream()
                .map(session -> new TrainerSessionResponse(
                        session.getSessionId(),
                        session.getClient().getFirstName(),
                        session.getClient().getLastName(),
                        session.getScheduledStart(),
                        session.getScheduledEnd(),
                        session.getStatus(),
                        session.getNotes()
                        )).toList();
    }

    public void updateSession(Long sessionId, CreateSessionRequest req, Long trainerId) {
        Session session = sessionRepo.findById(sessionId)
            .orElseThrow(() -> new EntityNotFoundException("Session not found: " + sessionId));

        if (!session.getTrainer().getTrainerId().equals(trainerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this session");
        }

        
        session.setClient(client);
        session.setTrainer(trainer);
        session.setWorkout(workout);
        session.setScheduledStart(req.scheduledStart());
        session.setScheduledEnd(req.scheduledEnd());
        session.setStatus(SessionStatus.PENDING);
        session.setNotes(req.notes());
    }

}
