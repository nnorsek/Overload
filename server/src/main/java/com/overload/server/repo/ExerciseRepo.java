package com.overload.server.repo;

import com.overload.server.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExerciseRepo extends JpaRepository<Exercise, Long> {

    List<Exercise> findByTrainerId(long trainerId);
}
