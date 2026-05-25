package com.overload.server.DTOs.exercises.repsonses;

import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.ExerciseCategory;
import com.overload.server.enums.MuscleGroup;
import lombok.Setter;

@Setter
public class ExerciseResponse {

    private Long exerciseId;
    private String name;
    private EquipmentType equipmentType;
    private MuscleGroup muscleGroup;
    private ExerciseCategory category;
    private String description;
}
