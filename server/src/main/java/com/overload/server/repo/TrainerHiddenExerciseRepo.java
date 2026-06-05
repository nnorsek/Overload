package com.overload.server.repo;

import com.overload.server.model.TrainerHiddenExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainerHiddenExerciseRepo extends JpaRepository<TrainerHiddenExercise, Long> {

    boolean existsByTrainer_TrainerIdAndExercise_ExerciseId(Long trainerId, Long exerciseId);
}
