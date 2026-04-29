package com.overload.server.repo;

import com.overload.server.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionRepo extends JpaRepository<Session, Long> {
    List<Session> findAllByTrainer_TrainerId(Long trainerId);
}

