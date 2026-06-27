package com.overload.server.DTOs.workouts.requests;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record WorkoutExerciseRequest(
    @NotNull Long exerciseId,
    @Positive int exerciseOrder,
    @Positive int defaultSets,
    @Positive int defaultReps,
    @PositiveOrZero Float defaultWeight
) {}
