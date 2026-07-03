package com.overload.server.repo;

import com.overload.server.model.WorkoutExercises;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkoutExercisesRepo extends JpaRepository<WorkoutExercises, Long> {

    Optional<WorkoutExercises> findByWorkoutExerciseIdAndWorkout_WorkoutId(Long workoutExerciseId, Long workoutId);
}
