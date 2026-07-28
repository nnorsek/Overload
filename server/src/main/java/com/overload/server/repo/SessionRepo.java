package com.overload.server.repo;

import com.overload.server.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SessionRepo extends JpaRepository<Session, Long> {
    List<Session> findAllByTrainer_TrainerId(Long trainerId);

    Optional<Session> findByScheduledStartAndScheduledEnd(LocalDateTime scheduledStart, LocalDateTime scheduledEnd);
}

