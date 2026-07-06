package com.overload.server.DTOs.workouts.requests;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record WorkoutExerciseRequest(
    @NotNull Long exerciseId,
    @Positive int exerciseOrder,
    @NotEmpty @Valid List<WorkoutExerciseSetRequest> sets
) {}
