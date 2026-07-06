package com.overload.server.DTOs.workouts.responses;

import java.util.List;

import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.ExerciseCategory;
import com.overload.server.enums.MuscleGroup;

public record WorkoutExerciseResponse(
    Long workoutExerciseId,
    int exerciseOrder,
    List<WorkoutExerciseSetResponse> sets,
    Long exerciseId,
    String exerciseName,
    MuscleGroup muscleGroup,
    EquipmentType equipmentType,
    ExerciseCategory category
) {}
