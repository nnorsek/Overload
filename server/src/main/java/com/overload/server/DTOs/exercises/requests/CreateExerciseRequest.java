package com.overload.server.DTOs.exercises.requests;

import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.ExerciseCategory;
import com.overload.server.enums.MuscleGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateExerciseRequest(
    @NotBlank @Size(max = 50) String name,
    @NotBlank @Size(max = 100) String description,
    @NotNull ExerciseCategory category,
    @NotNull EquipmentType equipmentType,
    @NotNull MuscleGroup muscleGroup
) {}
