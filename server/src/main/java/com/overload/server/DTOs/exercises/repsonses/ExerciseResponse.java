package com.overload.server.DTOs.exercises.repsonses;

import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.ExerciseCategory;
import com.overload.server.enums.MuscleGroup;

public record ExerciseResponse(
    Long exerciseId,
    String name,
    EquipmentType equipmentType,
    MuscleGroup muscleGroup,
    ExerciseCategory category,
    String description
) {}
