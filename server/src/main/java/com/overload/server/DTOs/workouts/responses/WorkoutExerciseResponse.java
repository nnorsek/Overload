package com.overload.server.DTOs.workouts.responses;

import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.ExerciseCategory;
import com.overload.server.enums.MuscleGroup;

public record WorkoutExerciseResponse(
    Long workoutExerciseId,
    int exerciseOrder,
    int defaultSets,
    int defaultReps,
    Float defaultWeight,
    Long exerciseId,
    String exerciseName,
    MuscleGroup muscleGroup,
    EquipmentType equipmentType,
    ExerciseCategory category
) {}
