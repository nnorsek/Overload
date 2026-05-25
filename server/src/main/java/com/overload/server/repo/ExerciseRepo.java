package com.overload.server.repo;

import com.overload.server.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseRepo extends JpaRepository<Exercise, Long> {

    @Query("SELECT e FROM Exercise e WHERE e.trainer.trainerId = :trainerId OR e.trainer IS NULL")
    List<Exercise> findAllByTrainerIdOrDefault(@Param("trainerId") Long trainerId);

    @Query("SELECT COUNT(e) > 0 FROM Exercise e WHERE e.name = :name AND e.trainer.trainerId = :trainerId")
    boolean existsByName(@Param("name") String name, @Param("trainerId") Long trainerId);

    @Query("SELECT COUNT(e) > 0 FROM Exercise e WHERE e.id = :id AND e.trainer.trainerId = :trainerId")
    boolean existsByIdAndTrainerId(@Param("id") Long id, @Param("trainerId") Long trainerId);

    Optional<Exercise> findByExerciseIdAndTrainer_TrainerId(Long exerciseId, Long trainerId);
}
