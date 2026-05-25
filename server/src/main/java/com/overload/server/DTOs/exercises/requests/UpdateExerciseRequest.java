package com.overload.server.DTOs.exercises.requests;

import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.ExerciseCategory;
import com.overload.server.enums.MuscleGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class UpdateExerciseRequest {

    @NotBlank
    @Size(max = 50)
    private String name;

    @NotBlank
    @Size(max = 100)
    private String description;

    @NotNull
    private EquipmentType equipmentType;

    @NotNull
    private MuscleGroup muscleGroup;

    @NotNull
    private ExerciseCategory category;

}
