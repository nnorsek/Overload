package com.overload.server.service;

import com.overload.server.DTOs.sessions.responses.TrainerSessionsResponse;
import com.overload.server.model.Session;
import com.overload.server.model.Trainer;
import com.overload.server.repo.SessionRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// Spring will detect this class as a bean and allows for it to be injected in other places
@Service
public class SessionService {

    private final SessionRepo sessionRepo;

    // Spring needs to inject SessionRepo, so by declaring it in a constructor forces it to give the SessionRepo to create the SessionService
    // Constructor injection
    public SessionService (SessionRepo sessionRepo) {
        this.sessionRepo = sessionRepo;
    }

    public List<TrainerSessionsResponse> getSessions (Long trainerId) {
        return sessionRepo.findAllByTrainer_TrainerId(trainerId)
                .stream()
                .map(session -> new TrainerSessionsResponse(
                        session.getSessionId(),
                        session.getClient().getFirstName(),
                        session.getClient().getLastName(),
                        session.getScheduledStart(),
                        session.getScheduledEnd(),
                        session.getStatus(),
                        session.getNotes()
                        )).toList();
    }
}
