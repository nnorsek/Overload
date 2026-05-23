package com.overload.server.DTOs.exercises.repsonses;

import com.overload.server.enums.EquipmentType;
import com.overload.server.enums.MuscleGroup;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Setter
public class ExerciseResponse {

    private long exerciseId;
    private String name;
    private EquipmentType equipmentType;
    private MuscleGroup muscleGroup;
    private String description;
}
