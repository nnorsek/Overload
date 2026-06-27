package com.overload.server.repo;

import com.overload.server.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutRepo extends JpaRepository<Workout, Long> {

    List<Workout> findAllByTrainer_TrainerId(Long trainerId);

    @Query("SELECT w FROM Workout w WHERE w.workoutId = :workoutId AND w.trainer.trainerId = :trainerId")
    Optional<Workout> findByWorkoutIdAndTrainerId(@Param("workoutId") Long workoutId, @Param("trainerId") Long trainerId);
}
