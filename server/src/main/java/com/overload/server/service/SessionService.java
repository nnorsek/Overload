package com.overload.server.service;

import com.overload.server.DTOs.sessions.responses.TrainerSessionsResponse;
import com.overload.server.model.Session;
import com.overload.server.model.Trainer;
import com.overload.server.repo.SessionRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepo sessionRepo;

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
