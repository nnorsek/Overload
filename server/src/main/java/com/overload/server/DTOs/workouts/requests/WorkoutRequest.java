package com.overload.server.DTOs.workouts.requests;

import com.overload.server.enums.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record WorkoutRequest(
    @NotBlank String name,
    @NotBlank String description,
    @NotNull DifficultyLevel difficultyLevel,
    @Positive int estimatedDuration
) {}
