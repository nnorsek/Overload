package com.overload.server.DTOs.workouts.responses;

public record WorkoutExerciseSetResponse(
    Long setId,
    int setOrder,
    int defaultReps,
    Float defaultWeight
) {
}
