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

    @Query("""
        SELECT e FROM Exercise e
        WHERE e.trainer.trainerId = :trainerId
        OR (e.trainer IS NULL
            AND e.exerciseId NOT IN (
                SELECT f.originalExerciseId FROM Exercise f
                WHERE f.trainer.trainerId = :trainerId AND f.originalExerciseId IS NOT NULL
            )
            AND e.exerciseId NOT IN (
                SELECT h.exercise.exerciseId FROM TrainerHiddenExercise h
                WHERE h.trainer.trainerId = :trainerId
            )
        )
    """)
    List<Exercise> findAllByTrainerIdOrDefault(@Param("trainerId") Long trainerId);

    @Query("SELECT COUNT(e) > 0 FROM Exercise e WHERE e.name = :name AND e.trainer.trainerId = :trainerId")
    boolean existsByName(@Param("name") String name, @Param("trainerId") Long trainerId);

    @Query("SELECT COUNT(e) > 0 FROM Exercise e WHERE e.exerciseId = :id AND e.trainer.trainerId = :trainerId")
    boolean existsByIdAndTrainerId(@Param("id") Long id, @Param("trainerId") Long trainerId);

    @Query("SELECT e FROM Exercise e WHERE e.exerciseId = :exerciseId AND e.trainer.trainerId = :trainerId")
    Optional<Exercise> findByExerciseIdAndTrainerId(@Param("exerciseId") Long exerciseId, @Param("trainerId") Long trainerId);

    @Query("SELECT e FROM Exercise e WHERE e.exerciseId = :exerciseId AND e.trainer IS NULL")
    Optional<Exercise> findDefaultById(@Param("exerciseId") Long exerciseId);
}
