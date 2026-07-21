package com.overload.server.DTOs.workouts.requests;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record WorkoutExerciseSetRequest (
    @Positive int setOrder,
    @Positive int defaultReps,
    @PositiveOrZero Float defaultWeight
){}
