package com.overload.server.DTOs.workouts.responses;

import com.overload.server.enums.DifficultyLevel;

import java.time.Instant;
import java.util.List;

public record WorkoutResponse(
    Long workoutId,
    Long trainerId,
    String name,
    String description,
    DifficultyLevel difficultyLevel,
    int estimatedDuration,
    List<WorkoutExerciseResponse> exercises,
    Instant createdAt,
    Instant updatedAt
) {}
